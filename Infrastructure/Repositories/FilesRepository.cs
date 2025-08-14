using Amazon.S3;
using Amazon.S3.Model;
using ApplicationContract.IFiles;
using ApplicationContract.ITeacher;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
using Domain.Entities;
using Infrastructure.Presistence;
using Infrastructure.Repositories.SignalR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Net;

namespace Infrastructure.Repositories
{
    public class FilesRepository : IFilesRepository
    {
        private readonly PlatFormDbContext _dbContext;
        private readonly ITeacherRepository _teacher;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly IConfiguration _configuration;
        string FilePath;
        string VideoPath;
        private readonly AmazonS3Client _s3Client;
        private readonly string _bucketName;
        public FilesRepository(PlatFormDbContext dbContext, IConfiguration _configuration, ITeacherRepository teacher, IHubContext<NotificationHub> hub)
        {
            _dbContext = dbContext;
            _teacher = teacher;
            _hub = hub;
            var appSettingsSection = _configuration.GetSection("AppConfiguration");
            FilePath = appSettingsSection["FilePath"];
            VideoPath = appSettingsSection["VideoPath"];
            _bucketName = _configuration["AWS:BucketName"];
            var awsOptions = new Amazon.Extensions.NETCore.Setup.AWSOptions
            {
                Region = Amazon.RegionEndpoint.GetBySystemName(_configuration["AWS:Region"]),
                Credentials = new Amazon.Runtime.BasicAWSCredentials(
               _configuration["AWS:AccessKey"],
               _configuration["AWS:SecretKey"]
           )
            };
            var s3Config = new AmazonS3Config
            {
                RegionEndpoint = awsOptions.Region,
                Timeout = TimeSpan.FromHours(2),
                MaxErrorRetry = 3,
                RetryMode = Amazon.Runtime.RequestRetryMode.Standard
            };
            _s3Client = new AmazonS3Client(awsOptions.Credentials, awsOptions.Region);
        }

        public async Task<CommonResult> UploadFilePDF(FilePdfDTO filePDF)
        {
            try
            {
                // Validate required fields
                if (filePDF.file == null || filePDF.file.Length == 0)
                {
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "No file uploaded",
                        TransactionHeaderMessage = "No file uploaded"
                    };
                }

                string fileName = Path.GetFileNameWithoutExtension(filePDF.file.FileName);
                string fileExtension = Path.GetExtension(filePDF.file.FileName);
                string fullFileName = fileName + fileExtension;
                string s3FileKey;
                // S3 key for the file (organized in folders)
                if (filePDF.isBook == false)
                {
                    s3FileKey = $"pdf-files/{fullFileName}";
                }
                else
                {
                    s3FileKey = $"pdf-book/{fullFileName}";
                }

                // Check if file already exists in database
                if (filePDF.isAnswer == false)
                {
                    var existingFile = await _dbContext.Files
                        .FirstOrDefaultAsync(f => f.TeacherID == filePDF.teacherId && f.FileName == fullFileName);

                    if (existingFile != null && filePDF.fileID == null)
                    {
                        return new CommonResult
                        {
                            IsValidTransaction = false,
                            TransactionDetails = "اسم الملف موجود بالفعل",
                            TransactionHeaderMessage = "File already exists"
                        };
                    }
                }
                // Upload file to S3
                using (var pdfStream = filePDF.file.OpenReadStream())
                {
                    var watermarkedBytes = PdfWatermarkHelper.AddTextWatermark(pdfStream, "Knowledge Galaxy");

                    using (var ms = new MemoryStream(watermarkedBytes))
                    {
                        var putRequest = new PutObjectRequest
                        {
                            BucketName = _bucketName,
                            Key = s3FileKey,
                            InputStream = ms,
                            ContentType = "application/pdf",
                            ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
                        };

                        var result = await _s3Client.PutObjectAsync(putRequest);

                        if (result.HttpStatusCode != System.Net.HttpStatusCode.OK)
                        {
                            return new CommonResult
                            {
                                IsValidTransaction = false,
                                TransactionDetails = "S3 upload failed.",
                                TransactionHeaderMessage = "Upload failed"
                            };
                        }
                    }
                }
                Files files = null;
                int userId = 0;
                int studentId = 0;
                // Save to database via EF Core
                if (filePDF.isAnswer == false)
                {
                    files = await _dbContext.Files
                        .FirstOrDefaultAsync(c => c.FilesID == filePDF.fileID);
                    userId = await _dbContext.Teachers.Where(t => t.Email == filePDF.userEmail)
                                                        .Select(u => u.TeacherID)
                                                        .FirstOrDefaultAsync();

                    if (files != null)
                    {
                        // Update existing
                        files.FileName = fullFileName;
                        _dbContext.Files.Update(files);
                    }
                    else
                    {
                        // Create new if it doesn't exist
                        files = new Files
                        {
                            UserID = userId,
                            FileName = fullFileName,
                            TeacherID = (int)filePDF.teacherId,
                            TaskName = filePDF.taskName,
                            IsBook = filePDF.isBook,
                            ChapterID = filePDF.ChapterId
                        };
                        _dbContext.Files.Add(files);
                    }
                }
                else
                {
                    studentId = await _dbContext.Students.Where(t => t.Email == filePDF.studentEmail)
                                                       .Select(u => u.StudentID)
                                                       .FirstOrDefaultAsync();
                    var filesAnswer = await _dbContext.FileAnswers
                        .FirstOrDefaultAsync(c => c.FilesID == filePDF.fileID && c.StudentID == studentId);

                    if (filesAnswer != null)
                    {
                        // Update existing
                        filesAnswer.AnswerName = fullFileName;
                        _dbContext.FileAnswers.Update(filesAnswer);
                    }
                    else
                    {
                        // Create new if it doesn't exist
                        filesAnswer = new FileAnswers
                        {
                            StudentID = studentId,
                            AnswerName = fullFileName,
                            FilesID = (int)filePDF.fileID,
                        };

                        var filessolved = await _dbContext.Files
                            .FirstOrDefaultAsync(c => c.FilesID == filePDF.fileID);

                        if (filessolved != null)
                        {
                            filessolved.IsAnswer = true;
                            _dbContext.Files.Update(filessolved);
                        }

                        _dbContext.FileAnswers.Add(filesAnswer);
                    }
                }

                await _dbContext.SaveChangesAsync();

                // Send notifications to students (only if not a student answer)
                if (studentId == 0)
                {
                    var res = await _teacher.GetTeacherWithInclude(userId);
                    foreach (var item in res.Students)
                    {
                        try
                        {
                            string message = $"{filePDF.taskName} تم اضافه";
                            var connections = UserConnectionManager.GetConnections(item.Email);
                            if (UserConnectionManager.IsOnline(item.Email))
                            {
                                // Send notification to the student
                                await _hub.Clients.Clients(connections).SendAsync("ReceiveNotification", message);
                            }
                            else
                            {
                                // Save offline message
                                await OfflineMessageManager.SaveMessage(_dbContext, item.Email, message);
                            }
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Failed to send notification to student {item.Email}: {ex.Message}");
                        }
                    }
                }

                Console.WriteLine("PDF file upload completed successfully");
                return new CommonResult
                {
                    IsValidTransaction = true,
                    TransactionDetails = "File uploaded successfully",
                    TransactionHeaderMessage = $"s3://{_bucketName}/{s3FileKey}"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading PDF file: {ex.Message}");
                return new CommonResult
                {
                    IsValidTransaction = false,
                    TransactionDetails = $"An error occurred while uploading the file: {ex.Message}",
                    TransactionHeaderMessage = "Upload failed"
                };
            }
        }
        ////////////////////////////////////////////////////////////////////////
        public async Task DeleteAsync(int ID)
        {
            var _old = await GetAsync(ID);
            _dbContext.Remove(_old);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<IReadOnlyList<Files>> GetAllAsync()
        => await _dbContext.Files.AsNoTracking().ToListAsync();


        public async Task<Files> GetAsync(int? ID)
        => await _dbContext.Files.FindAsync(ID);

        public async Task<IEnumerable<AcademicLevels>> GetAllAcademicLevelsAsync()
       => await _dbContext.AcademicLevels.ToListAsync();

        public async Task<PaginatedResult<Files>> GetTeachersFilesAsync(TeacherFileDTO teacherFile)
        {
            var query = _dbContext.Files.AsQueryable();
            query = query.Where(f => f.ChapterID == teacherFile.ChapterId);

            if (!string.IsNullOrWhiteSpace(teacherFile.TaskName))
            {
                query = query.Where(f => f.TaskName.Contains(teacherFile.TaskName));
            }

            if (teacherFile.IsBook.HasValue)
            {
                query = query.Where(f => f.IsBook == teacherFile.IsBook.Value);
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((teacherFile.PageNumber - 1) * teacherFile.PageSize)
                .Take(teacherFile.PageSize)
                .ToListAsync();

            return new PaginatedResult<Files>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = teacherFile.PageNumber,
                PageSize = teacherFile.PageSize
            };
        }

        public async Task<FileDto> GetFileAsync(string fileName, bool isBook)
        {
            try
            {
                // S3 key for the file (matching the upload folder structure)
                string s3FileKey;
                if (isBook)
                {
                    s3FileKey = $"pdf-book/{fileName}";
                }
                else
                {
                    s3FileKey = $"pdf-files/{fileName}";
                }
                Console.WriteLine($"Downloading file from S3: {s3FileKey}");

                // Create request to get object from S3
                var getObjectRequest = new GetObjectRequest
                {
                    BucketName = _bucketName,
                    Key = s3FileKey
                };

                // Get the object from S3
                using (var response = await _s3Client.GetObjectAsync(getObjectRequest))
                {
                    // Check if the response is successful
                    if (response.HttpStatusCode != System.Net.HttpStatusCode.OK)
                    {
                        throw new FileNotFoundException($"File '{fileName}' not found in S3.");
                    }

                    // Read the content from S3 response stream
                    using (var memoryStream = new MemoryStream())
                    {
                        await response.ResponseStream.CopyToAsync(memoryStream);
                        var bytes = memoryStream.ToArray();

                        // Get content type from S3 metadata or determine from file extension
                        var contentType = response.Headers.ContentType ?? MimeMapping.MimeUtility.GetMimeMapping(fileName);

                        Console.WriteLine($"File downloaded successfully: {fileName}, Size: {bytes.Length} bytes");

                        return new FileDto
                        {
                            Content = bytes,
                            ContentType = contentType,
                            FileName = fileName
                        };
                    }
                }
            }
            catch (AmazonS3Exception s3Ex)
            {
                Console.WriteLine($"S3 Error downloading file '{fileName}': {s3Ex.Message}");

                if (s3Ex.StatusCode == System.Net.HttpStatusCode.NotFound)
                {
                    throw new FileNotFoundException($"File '{fileName}' not found in S3.");
                }

                throw new Exception($"Error downloading file from S3: {s3Ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error downloading file '{fileName}': {ex.Message}");
                throw new Exception($"An error occurred while downloading the file: {ex.Message}");
            }
        }

        public async Task<PaginatedResult<Videos>> GetTeachersVideoAsync(TeacherVideoDTO teacherVideo)
        {
            var query = _dbContext.Videos.AsQueryable();
            query = query.Where(f =>  f.ChapterID ==teacherVideo.ChapterId);

            if (!string.IsNullOrWhiteSpace(teacherVideo.VideoName))
            {
                query = query.Where(f => f.VideoName.Contains(teacherVideo.VideoName));
            }

            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((teacherVideo.PageNumber - 1) * teacherVideo.PageSize)
                .Take(teacherVideo.PageSize)
                .ToListAsync();

            return new PaginatedResult<Videos>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = teacherVideo.PageNumber,
                PageSize = teacherVideo.PageSize
            };
        }

        public async Task<PaginatedResult<StudentAnswerFilesDTO>> GetStudentAnswerAsync(StudentAnswerFilesDTO StudentAnswerFile)
        {
            var query = _dbContext.FileAnswers
                                .Include(f => f.Files)
                                //.ThenInclude(f => f.AcademicLevel)
                                .Include(f => f.Student)
                                .Where(f => f.Files.TeacherID == StudentAnswerFile.TeacherId
                                         && f.Files.FilesID == StudentAnswerFile.FilesId)
                                .AsQueryable();

            //if (!string.IsNullOrWhiteSpace(StudentAnswerFile.TaskName))
            //{
            //    query = query.Where(f => f.Files.TaskName.Contains(StudentAnswerFile.TaskName));
            //}

            if (!string.IsNullOrWhiteSpace(StudentAnswerFile.AnswerName))
            {
                query = query.Where(f => f.AnswerName.Contains(StudentAnswerFile.AnswerName));
            }


            if (!string.IsNullOrWhiteSpace(StudentAnswerFile.StudentName))
            {
                var name = StudentAnswerFile.StudentName.ToLower();
                
                query = query.Where(f =>
                    ((f.Student.FirstName ?? "") + " " + (f.Student.LastName ?? "")).ToLower().Contains(name));
            }

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((StudentAnswerFile.PageNumber - 1) * StudentAnswerFile.PageSize)
                .Take(StudentAnswerFile.PageSize)
                .Select(f => new
                {
                    f.FileAnswersID,
                    f.AnswerName,
                    StudentName = f.Student.FirstName + " " + f.Student.LastName,
                    //f.Student.StudentName, 
                    f.Files.FileName,
                    f.Files.FilesID,
                    f.Files.TeacherID,
                    f.Files.TaskName,
                    //f.Files.AcademicLevel.AcademicLevelName,
                    //f.Files.AcademicLevel.AcademicLevelID
                })
                .ToListAsync();

            return new PaginatedResult<StudentAnswerFilesDTO>
            {
                Items = items.Select(x => new StudentAnswerFilesDTO
                {
                    FileAnswersID = x.FileAnswersID,
                    AnswerName = x.AnswerName,
                    StudentName = x.StudentName,
                    //StudentName = x.StudentName, 
                    FileName = x.FileName,
                    TaskName = x.TaskName,
                    //AcademicLevelId = x.AcademicLevelID,
                    //AcademicLevelName = x.AcademicLevelName,
                    FilesId = x.FilesID,
                    TeacherId = x.TeacherID
                }).ToList(),
                TotalCount = totalCount,
                PageNumber = StudentAnswerFile.PageNumber,
                PageSize = StudentAnswerFile.PageSize
            };
        }
        public async Task<string> GetVideoFileStreamAsync(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName) ||
                fileName.Contains("..") ||
                fileName.Contains("/") ||
                fileName.Contains("\\"))
            {
                throw new ArgumentException("Invalid file name.");
            }

            // Check if file exists and get metadata
            var request = new GetObjectMetadataRequest
            {
                BucketName = _bucketName,
                Key = fileName
            };

            GetObjectMetadataResponse metadata;
            try
            {
                metadata = await _s3Client.GetObjectMetadataAsync(request);
                Console.WriteLine($"Content-Type: {metadata.Headers.ContentType}");
                Console.WriteLine($"Content-Length: {metadata.Headers.ContentLength}");
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                throw new FileNotFoundException("الملف غير موجود", fileName);
            }

            // Generate pre-signed URL with proper headers to prevent download
            var urlRequest = new GetPreSignedUrlRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                Verb = HttpVerb.GET,
                Expires = DateTime.UtcNow.AddHours(2), // Shorter expiry for security

                ResponseHeaderOverrides = new ResponseHeaderOverrides
                {
                    ContentType = "video/mp4",
                    ContentDisposition = "inline; filename=\"video.mp4\"", // More explicit inline directive
                    CacheControl = "no-store, must-revalidate", // Prevent caching

                    // Additional headers to discourage downloads
                    ContentEncoding = null // Ensure no encoding issues
                }
            };

            return await _s3Client.GetPreSignedURLAsync(urlRequest);
        }
        public async Task<IActionResult> GetVideoStreamAsync(string fileName, HttpRequest request)
        {
            if (string.IsNullOrWhiteSpace(fileName) ||
                fileName.Contains("..") ||
                fileName.Contains("/") ||
                fileName.Contains("\\"))
            {
                throw new ArgumentException("Invalid file name.");
            }

            // Get file metadata
            var metadataRequest = new GetObjectMetadataRequest
            {
                BucketName = _bucketName,
                Key = fileName
            };

            GetObjectMetadataResponse metadata;
            try
            {
                metadata = await _s3Client.GetObjectMetadataAsync(metadataRequest);
            }
            catch (AmazonS3Exception ex) when (ex.StatusCode == HttpStatusCode.NotFound)
            {
                throw new FileNotFoundException("الملف غير موجود", fileName);
            }

            long fileSize = metadata.Headers.ContentLength;
            long start = 0;
            long end = fileSize - 1;

            // Parse Range header
            string rangeHeader = request.Headers["Range"].FirstOrDefault();
            if (!string.IsNullOrEmpty(rangeHeader) && rangeHeader.StartsWith("bytes="))
            {
                var range = rangeHeader.Substring(6);
                var parts = range.Split('-');

                if (parts.Length == 2)
                {
                    if (long.TryParse(parts[0], out long rangeStart))
                    {
                        start = rangeStart;
                    }

                    if (!string.IsNullOrEmpty(parts[1]) && long.TryParse(parts[1], out long rangeEnd))
                    {
                        end = Math.Min(rangeEnd, fileSize - 1);
                    }
                }
            }

            // Create S3 request with byte range
            var s3Request = new GetObjectRequest
            {
                BucketName = _bucketName,
                Key = fileName,
                ByteRange = new ByteRange(start, end)
            };

            var s3Response = await _s3Client.GetObjectAsync(s3Request);

            // Calculate content length
            long contentLength = end - start + 1;

            // Create custom ActionResult that properly handles the stream
            return new VideoStreamResult(s3Response.ResponseStream, contentLength, start, end, fileSize, "video/mp4");
        }

        // NEW: Custom ActionResult for video streaming
        public class VideoStreamResult : IActionResult
        {
            private readonly Stream _stream;
            private readonly long _contentLength;
            private readonly long _start;
            private readonly long _end;
            private readonly long _fileSize;
            private readonly string _contentType;

            public VideoStreamResult(Stream stream, long contentLength, long start, long end, long fileSize, string contentType)
            {
                _stream = stream;
                _contentLength = contentLength;
                _start = start;
                _end = end;
                _fileSize = fileSize;
                _contentType = contentType;
            }

            public async Task ExecuteResultAsync(ActionContext context)
            {
                var response = context.HttpContext.Response;

                response.ContentType = _contentType;
                response.Headers.Add("Accept-Ranges", "bytes");
                response.Headers.Add("Content-Range", $"bytes {_start}-{_end}/{_fileSize}");
                response.Headers.Add("Content-Length", _contentLength.ToString());

                // Set status code
                response.StatusCode = _start > 0 || _end < _fileSize - 1 ? 206 : 200;

                // Disable response buffering for large files
                var bufferingFeature = context.HttpContext.Features.Get<IHttpResponseBodyFeature>();
                bufferingFeature?.DisableBuffering();

                // Stream the content
                const int bufferSize = 8192;
                var buffer = new byte[bufferSize];
                int bytesRead;

                try
                {
                    while ((bytesRead = await _stream.ReadAsync(buffer, 0, bufferSize)) > 0)
                    {
                        await response.Body.WriteAsync(buffer, 0, bytesRead);
                        await response.Body.FlushAsync();

                        // Check if client disconnected
                        if (context.HttpContext.RequestAborted.IsCancellationRequested)
                        {
                            break;
                        }
                    }
                }
                finally
                {
                    _stream?.Dispose();
                }
            }
        }
        //////////////////////////////////////////////////////////////////////////////////////////////////////
        public async Task<CommonResult> UploadFileChunk([FromForm] FileChunkDto chunkDto)
        {
            try
            {
                // Validate required fields
                if (chunkDto.Chunk == null || chunkDto.Chunk.Length == 0)
                {
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "No chunk data provided",
                        TransactionHeaderMessage = "Upload failed"
                    };
                }

                if (string.IsNullOrEmpty(chunkDto.FileName))
                {
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "FileName is required",
                        TransactionHeaderMessage = "Upload failed"
                    };
                }

                if (chunkDto.ChunkNumber <= 0 || chunkDto.TotalChunks <= 0)
                {
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "ChunkNumber and TotalChunks must be greater than 0",
                        TransactionHeaderMessage = "Upload failed"
                    };
                }

                // Check if file already exists
                var existingFile = await _dbContext.Videos
                    .FirstOrDefaultAsync(f => f.TeacherID == chunkDto.TeacherId && f.VideoName == chunkDto.FileName);

                if (existingFile != null)
                {
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "اسم الفديو موجود بالفعل",
                        TransactionHeaderMessage = "File already exists"
                    };
                }

                // S3 key for the chunk (using temp prefix)
                string tempChunkKey = $"temp/{chunkDto.FileName}_{chunkDto.UserId}/chunk_{chunkDto.ChunkNumber}";
                string finalFileKey = chunkDto.FileName;

                Console.WriteLine($"Uploading chunk {chunkDto.ChunkNumber} of {chunkDto.TotalChunks} for {chunkDto.FileName}");

                // Upload chunk to S3
                using (var stream = chunkDto.Chunk.OpenReadStream())
                {
                    var putRequest = new PutObjectRequest
                    {
                        BucketName = _bucketName,
                        Key = tempChunkKey,
                        InputStream = stream,
                        ContentType = "application/octet-stream",
                        ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
                    };
                    var result = await _s3Client.PutObjectAsync(putRequest); // make sure it's awaited

                    if (result.HttpStatusCode != System.Net.HttpStatusCode.OK)
                    {
                        return new CommonResult
                        {
                            IsValidTransaction = false,
                            TransactionDetails = "S3 upload failed.",
                            TransactionHeaderMessage = "Upload failed"
                        };
                    }
                }

                // Check if all chunks are uploaded
                var uploadedChunks = await GetUploadedChunksFromS3(chunkDto.FileName, chunkDto.UserId);

                Console.WriteLine($"Uploaded chunks: {uploadedChunks.Count} / {chunkDto.TotalChunks}");

                if (uploadedChunks.Count == chunkDto.TotalChunks)
                {
                    Console.WriteLine("All chunks received, combining file...");

                    // Combine all chunks into the final file
                    await CombineChunksInS3(chunkDto.FileName, chunkDto.UserId, chunkDto.TotalChunks, finalFileKey);

                    // Clean up temp chunks
                    await CleanupTempChunks(chunkDto.FileName, chunkDto.UserId, chunkDto.TotalChunks);

                    // Save to database
                    var newFile = new Videos
                    {
                        UserID = chunkDto.UserId,
                        VideoName = chunkDto.FileName,
                        TeacherID = chunkDto.TeacherId,
                        ChapterID = chunkDto.ChapterId
                    };
                    _dbContext.Videos.Add(newFile);
                    await _dbContext.SaveChangesAsync();

                    Console.WriteLine("File upload completed successfully");
                    return new CommonResult
                    {
                        IsValidTransaction = true,
                        TransactionDetails = "File uploaded successfully",
                        TransactionHeaderMessage = $"s3://{_bucketName}/{finalFileKey}"
                    };
                }

                // Return partial success for intermediate chunks
                return new CommonResult
                {
                    IsValidTransaction = true,
                    TransactionDetails = $"Chunk {chunkDto.ChunkNumber} of {chunkDto.TotalChunks} uploaded",
                    TransactionHeaderMessage = "Chunk uploaded"
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error uploading chunk: {ex.Message}");
                return new CommonResult
                {
                    IsValidTransaction = false,
                    TransactionDetails = $"An error occurred while uploading the chunk: {ex.Message}",
                    TransactionHeaderMessage = "Upload failed"
                };
            }
        }

        public async Task<ChunkStatusDto> CheckUploadedChunks(int userId, string fileName)
        {
            try
            {
                var uploadedChunks = await GetUploadedChunksFromS3(fileName, userId);

                return new ChunkStatusDto
                {
                    FileName = fileName,
                    UserId = userId,
                    UploadedChunkNumbers = uploadedChunks.OrderBy(x => x).ToList()
                };
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error checking chunks: {ex.Message}");
                return new ChunkStatusDto
                {
                    FileName = fileName,
                    UserId = userId,
                    UploadedChunkNumbers = new List<int>(),
                    ErrorMessage = "An error occurred while checking uploaded chunks."
                };
            }
        }

        // Helper method to get uploaded chunks from S3
        private async Task<List<int>> GetUploadedChunksFromS3(string fileName, int userId)
        {
            var uploadedChunks = new List<int>();

            try
            {
                var listRequest = new ListObjectsV2Request
                {
                    BucketName = _bucketName,
                    Prefix = $"temp/{fileName}_{userId}/chunk_"
                };

                var response = await _s3Client.ListObjectsV2Async(listRequest);

                // Check if S3Objects is not null and has items
                if (response.S3Objects != null && response.S3Objects.Count > 0)
                {
                    foreach (var obj in response.S3Objects)
                    {
                        var chunkFileName = Path.GetFileName(obj.Key);
                        if (chunkFileName.StartsWith("chunk_"))
                        {
                            if (int.TryParse(chunkFileName.Replace("chunk_", ""), out int chunkNumber))
                            {
                                uploadedChunks.Add(chunkNumber);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error listing S3 objects: {ex.Message}");
            }

            return uploadedChunks;
        }
        // Helper method to combine chunks in S3
        private async Task CombineChunksInS3(string fileName, int userId, int totalChunks, string finalFileKey)
        {
            // For large files, we'll use S3 Multipart Upload to combine chunks
            var initiateRequest = new InitiateMultipartUploadRequest
            {
                BucketName = _bucketName,
                Key = finalFileKey,
                ContentType = "video/mp4"
            };

            var initiateResponse = await _s3Client.InitiateMultipartUploadAsync(initiateRequest);
            var uploadId = initiateResponse.UploadId;

            var parts = new List<PartETag>();

            try
            {
                for (int i = 1; i <= totalChunks; i++)
                {
                    string chunkKey = $"temp/{fileName}_{userId}/chunk_{i}";

                    // Use CopyPart instead of UploadPart to avoid stream issues
                    var copyPartRequest = new CopyPartRequest
                    {
                        SourceBucket = _bucketName,
                        SourceKey = chunkKey,
                        DestinationBucket = _bucketName,
                        DestinationKey = finalFileKey,
                        UploadId = uploadId,
                        PartNumber = i
                    };

                    var copyPartResponse = await _s3Client.CopyPartAsync(copyPartRequest);
                    parts.Add(new PartETag(i, copyPartResponse.ETag));
                }

                // Complete multipart upload
                var completeRequest = new CompleteMultipartUploadRequest
                {
                    BucketName = _bucketName,
                    Key = finalFileKey,
                    UploadId = uploadId,
                    PartETags = parts
                };

                await _s3Client.CompleteMultipartUploadAsync(completeRequest);
            }
            catch (Exception ex)
            {
                // Abort multipart upload on error
                await _s3Client.AbortMultipartUploadAsync(new AbortMultipartUploadRequest
                {
                    BucketName = _bucketName,
                    Key = finalFileKey,
                    UploadId = uploadId
                });
                throw;
            }
        }
        // Helper method to cleanup temp chunks
        private async Task CleanupTempChunks(string fileName, int userId, int totalChunks)
        {
            try
            {
                var deleteObjects = new List<KeyVersion>();

                for (int i = 1; i <= totalChunks; i++)
                {
                    deleteObjects.Add(new KeyVersion
                    {
                        Key = $"temp/{fileName}_{userId}/chunk_{i}"
                    });
                }

                var deleteRequest = new DeleteObjectsRequest
                {
                    BucketName = _bucketName,
                    Objects = deleteObjects
                };

                await _s3Client.DeleteObjectsAsync(deleteRequest);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error cleaning up temp chunks: {ex.Message}");
                // Don't throw here as the main upload succeeded
            }
        }
    }

}
