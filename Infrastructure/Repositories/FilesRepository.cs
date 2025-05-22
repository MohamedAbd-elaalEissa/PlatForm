using ApplicationContract.IFiles;
using ApplicationContract.ITeacher;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Blobs.Specialized;
using Docker.DotNet.Models;
using Domain.Entities;
using Infrastructure.Presistence;
using Infrastructure.Repositories.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Polly;
using System.Net;
using System.Security.Cryptography;
using System.Text;
namespace Infrastructure.Repositories
{
    public class FilesRepository : IFilesRepository
    {
        private readonly PlatFormDbContext _dbContext;
        private readonly ITeacherRepository _teacher;
        private readonly IHubContext<NotificationHub> _hub;
        private readonly IMemoryCache _cache;
        private readonly IConfiguration _configuration;
        string FilePath;
        string VideoPath;
        string ConnectionString;
        string ContainerName;
        private readonly BlobServiceClient _blobServiceClient;
        private readonly ILogger<FilesRepository> _logger;
        public FilesRepository(PlatFormDbContext dbContext, IConfiguration _configuration, ITeacherRepository teacher, IHubContext<NotificationHub> hub
            , IMemoryCache cache, BlobServiceClient blobServiceClient,
            ILogger<FilesRepository> logger)
        {
            _dbContext = dbContext;
            _teacher = teacher;
            _hub = hub;
            _cache = cache;
            var appSettingsSection = _configuration.GetSection("AppConfiguration");
            var azureSettingsSection = _configuration.GetSection("AzureStorage");
            FilePath = appSettingsSection["FilePath"];
            VideoPath = appSettingsSection["VideoPath"];
            ConnectionString = azureSettingsSection["ConnectionString"];
            ContainerName = azureSettingsSection["ContainerName"];
            _blobServiceClient = blobServiceClient;
            _logger = logger;

        }

        public async Task<CommonResult> UploadFilePDF(FilePdfDTO filePDF)
        {
            try
            {
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

                string filePath = Path.Combine(FilePath, fullFileName);

                // Delete existing file if it exists
                string[] existingFiles = Directory.GetFiles(Path.GetDirectoryName(filePath), Path.GetFileName(filePath));
                foreach (string existingFile in existingFiles)
                {
                    try { File.Delete(existingFile); }
                    catch (Exception ex) { Console.WriteLine($"Failed to delete file: {existingFile}. Error: {ex.Message}"); }
                }

                // Save the new file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await filePDF.file.CopyToAsync(stream);
                }
                Files files = null;

                //// Save to database via EF Core
                if (filePDF.isAnswer == false)
                {
                    files = await _dbContext.Files
                  .FirstOrDefaultAsync(c => c.FilesID == filePDF.fileID);
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
                            UserID = filePDF.userId,
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
                    var filesAnswer = await _dbContext.FileAnswers
                    .FirstOrDefaultAsync(c => c.FilesID == filePDF.fileID && c.StudentID == filePDF.studentId);
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
                            StudentID = filePDF.studentId,
                            AnswerName = filePDF.answerName,
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
                if (filePDF.studentId is null)
                {
                    var res = await _teacher.GetTeacherWithInclude(filePDF.userId);
                    foreach (var item in res.Students)
                    {
                        try
                        {
                            string message = $"تم اضافه  {filePDF.taskName} في الفايلات";
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
                            Console.WriteLine(ex.Message, $"Failed to send notification to student {item.Email}");
                        }                       // await _hub.Clients.All.SendAsync("ReceiveNotification", $"{filePDF.userId} من {filePDF.taskName}تم اضافه  ");
                    }
                }

                return new CommonResult
                {
                    IsValidTransaction = true,
                    TransactionDetails = "Upload Successfully",
                    TransactionHeaderMessage = filePath
                };
            }
            catch (Exception ex)
            {
                return new CommonResult
                {
                    IsValidTransaction = false,
                    TransactionDetails = "اسم الملف موجود بالفعل",
                    TransactionHeaderMessage = ex.Message
                };
            }
        }
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

        public async Task<CommonResult> UploadFileChunk([FromForm] FileChunkDto chunkDto)
        {
            try
            {
                // Validate input
                if (chunkDto.Chunk == null || chunkDto.Chunk.Length == 0)
                    return Error("No chunk data provided");
                if (string.IsNullOrEmpty(chunkDto.FileName))
                    return Error("FileName is required");
                if (chunkDto.ChunkNumber <= 0 || chunkDto.TotalChunks <= 0)
                    return Error("Invalid chunk numbers");

                string blobName = $"{chunkDto.UserId}/{chunkDto.FileName}";

                // Get the BlobServiceClient from DI instead of creating new one

                var containerClient = _blobServiceClient.GetBlobContainerClient(ContainerName);

                await containerClient.CreateIfNotExistsAsync();

                var blockBlobClient = containerClient.GetBlockBlobClient(blobName);

                // Generate a Base64 block ID with proper padding
                string blockId = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{chunkDto.ChunkNumber:D6}"));

                // Use cancellation token for better control
                using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(10));

                using var stream = chunkDto.Chunk.OpenReadStream();

                // Stage block with cancellation token only
                try
                {
                    await blockBlobClient.StageBlockAsync(blockId, stream, cancellationToken: cts.Token);

                }
                catch (Exception ex)
                {

                    throw;
                }

                // Store uploaded blockId to track
                await StoreUploadedBlockIdAsync(chunkDto.UserId.ToString(), chunkDto.FileName, blockId);

                    if (uploadedChunks == chunkDto.TotalChunks)
                    {
                        Console.WriteLine("All chunks received, combining file...");
                        // Combine all chunks into the final file
                        using (var finalStream = new FileStream(finalFilePath, FileMode.Create))
                        {
                            for (int i = 1; i <= chunkDto.TotalChunks; i++)
                            {
                                string chunkPath = Path.Combine(tempDir, $"chunk_{i}");
                                if (!File.Exists(chunkPath))
                                {
                                    return new CommonResult
                                    {
                                        IsValidTransaction = false,
                                        TransactionDetails = $"Missing chunk {i}",
                                        TransactionHeaderMessage = "Upload failed"
                                    };
                                }
                                byte[] chunkBytes = await File.ReadAllBytesAsync(chunkPath);
                                await finalStream.WriteAsync(chunkBytes, 0, chunkBytes.Length);
                            }
                        }
                        // Clean up temp directory
                        Directory.Delete(tempDir, true);
                        var newFile = new Videos
                        {
                            UserID = chunkDto.UserId,
                            VideoName = finalFileName,
                            TeacherID = chunkDto.TeacherId,
                            ChapterID= chunkDto.ChapterId
                        };
                        _dbContext.Videos.Add(newFile);

            if (!blockIds.Contains(blockId)) // Avoid duplicates if retry happens
            {
                blockIds.Add(blockId);
                _cache.Set(key, blockIds, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromHours(2)
                });
            }

            return Task.CompletedTask;
        }

        private Task<bool> AllChunksUploadedAsync(string userId, string fileName, int totalChunks)
        {
            string key = $"{userId}_{fileName}";
            var blockIds = _cache.TryGetValue(key, out List<string> ids) ? ids : new List<string>();

            // Log progress for debugging
            _logger.LogInformation("Upload progress for {fileName}: {current}/{total} chunks",
                fileName, ids.Count, totalChunks);

            return Task.FromResult(ids.Count == totalChunks);
        }

        private Task<List<string>> GetBlockIdsAsync(string userId, string fileName)
        {
            string key = $"{userId}_{fileName}";
            var blockIds = _cache.TryGetValue(key, out List<string> ids) ? ids : new List<string>();

            // Sort blocks by their decoded numeric value to ensure correct assembly
            return Task.FromResult(blockIds.OrderBy(x => x).ToList());
        }

        //public async Task<CommonResult> UploadFileChunk([FromForm] FileChunkDto chunkDto)
        //{
        //    try
        //    {
        //        // Input validation
        //        if (chunkDto.Chunk == null || chunkDto.Chunk.Length == 0)
        //            return Error("No chunk data provided");

        //        if (string.IsNullOrEmpty(chunkDto.FileName))
        //            return Error("FileName is required");

        //        if (chunkDto.ChunkNumber <= 0 || chunkDto.TotalChunks <= 0)
        //            return Error("Invalid chunk numbers");

        //        if (chunkDto.ChunkNumber > chunkDto.TotalChunks)
        //            return Error("Chunk number exceeds total chunks");

        //        if (chunkDto.Chunk.Length > 5 * 1024 * 1024)
        //            return Error("Chunk size exceeds 5 MB limit");

        //        if (chunkDto.TotalChunks > 50000)
        //            return Error("Total chunks exceed Azure's 50,000 block limit");

        //        // Container and blob setup
        //        string blobName = $"{chunkDto.UserId}/{chunkDto.FileName}";
        //        var containerClient = _blobServiceClient.GetBlobContainerClient(ContainerName);
        //        await containerClient.CreateIfNotExistsAsync();
        //        var blockBlobClient = containerClient.GetBlockBlobClient(blobName);

        //        // Generate base64 block ID
        //        string plainBlockId = $"{chunkDto.ChunkNumber:D10}";
        //        string blockId = Convert.ToBase64String(Encoding.UTF8.GetBytes(plainBlockId));

        //        if (blockId.Length > 64)
        //            return Error("Block ID exceeds Azure limit");

        //        // Check for duplicate block
        //        var existingIds = await GetBlockIdsAsync(chunkDto.UserId.ToString(), chunkDto.FileName);
        //        if (existingIds.Contains(blockId))
        //        {
        //            return Success(new
        //            {
        //                Message = $"Chunk {chunkDto.ChunkNumber} already uploaded",
        //                CurrentChunk = chunkDto.ChunkNumber,
        //                TotalChunks = chunkDto.TotalChunks,
        //                Progress = (double)existingIds.Count / chunkDto.TotalChunks * 100
        //            });
        //        }

        //        // Retry policy
        //        var retryPolicy = Policy
        //            .Handle<RequestFailedException>(ex => ex.Status == 400 && ex.ErrorCode == "InvalidBlobOrBlock")
        //            .WaitAndRetryAsync(3, attempt => TimeSpan.FromSeconds(Math.Pow(2, attempt)));

        //        using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(30));

        //        // Read bytes
        //        byte[] chunkBytes;
        //        using (var sourceStream = chunkDto.Chunk.OpenReadStream())
        //        using (var memoryStream = new MemoryStream())
        //        {
        //            await sourceStream.CopyToAsync(memoryStream);
        //            chunkBytes = memoryStream.ToArray();
        //        }

        //        if (chunkBytes == null || chunkBytes.Length == 0)
        //            return Error("Chunk is empty or corrupted.");

        //        // Upload block
        //        using (var chunkStream = new MemoryStream(chunkBytes))
        //        {
        //            chunkStream.Position = 0;
        //            await retryPolicy.ExecuteAsync(async () =>
        //            {
        //                await blockBlobClient.StageBlockAsync(
        //                    blockId,
        //                    chunkStream,
        //                    cancellationToken: cts.Token);
        //            });
        //        }

        //        // Store block ID
        //        await StoreUploadedBlockIdAsync(chunkDto.UserId.ToString(), chunkDto.FileName, blockId);

        //        // Commit if all chunks are uploaded
        //        if (await AllChunksUploadedAsync(chunkDto.UserId.ToString(), chunkDto.FileName, chunkDto.TotalChunks))
        //        {
        //            var blockIds = await GetBlockIdsAsync(chunkDto.UserId.ToString(), chunkDto.FileName);
        //            if (blockIds.Count != chunkDto.TotalChunks)
        //                return Error("Mismatch in uploaded chunks");

        //            var headers = new BlobHttpHeaders
        //            {
        //                ContentType = FileExtensions.GetContentType(chunkDto.FileName)
        //            };

        //            var metadata = new Dictionary<string, string>
        //    {
        //        { "OriginalFileName", chunkDto.FileName },
        //        { "UploadedBy", chunkDto.UserId.ToString() },
        //        { "TotalChunks", chunkDto.TotalChunks.ToString() }
        //    };

        //            await blockBlobClient.SetMetadataAsync(metadata);
        //            await blockBlobClient.CommitBlockListAsync(blockIds, headers, cancellationToken: cts.Token);

        //            await using var transaction = await _dbContext.Database.BeginTransactionAsync();
        //            try
        //            {
        //                _dbContext.Videos.Add(new Videos
        //                {
        //                    UserID = chunkDto.UserId,
        //                    VideoName = chunkDto.FileName,
        //                    TeacherID = chunkDto.TeacherId,
        //                    AcademicLevelID = chunkDto.AcademicLevelID
        //                });
        //                await _dbContext.SaveChangesAsync();
        //                await transaction.CommitAsync();
        //            }
        //            catch (Exception dbEx)
        //            {
        //                await transaction.RollbackAsync();
        //                _logger.LogError(dbEx, "Failed to save video metadata");
        //            }

        //            _cache.Remove($"{chunkDto.UserId}_{chunkDto.FileName}");

        //            return Success(new
        //            {
        //                Message = "File uploaded and committed successfully",
        //                BlobName = blobName,
        //                TotalChunks = chunkDto.TotalChunks,
        //                UploadedChunks = blockIds.Count,
        //                FileSize = blockIds.Count * chunkDto.Chunk.Length
        //            });
        //        }

        //        int currentProgress = await GetUploadedChunkCountAsync(chunkDto.UserId.ToString(), chunkDto.FileName);
        //        return Success(new
        //        {
        //            Message = $"Chunk {chunkDto.ChunkNumber} uploaded",
        //            CurrentChunk = chunkDto.ChunkNumber,
        //            TotalChunks = chunkDto.TotalChunks,
        //            Progress = (double)currentProgress / chunkDto.TotalChunks * 100,
        //            UploadedBytes = currentProgress * chunkDto.Chunk.Length
        //        });
        //    }
        //    catch (RequestFailedException ex) when (ex.Status == 400 && ex.ErrorCode == "InvalidBlobOrBlock")
        //    {
        //        _logger.LogError(ex, "InvalidBlobOrBlock on chunk {ChunkNumber}", chunkDto.ChunkNumber);
        //        return Error("Invalid block content. Verify integrity and retry.");
        //    }
        //    catch (Exception ex)
        //    {
        //        _logger.LogError(ex, "Unhandled error on chunk {ChunkNumber}", chunkDto.ChunkNumber);
        //        return Error("Upload failed: " + ex.Message);
        //    }
        //}

        //// Helper methods with improved implementations
        //private static CommonResult Success(object data) => new()
        //{
        //    IsValidTransaction = true,
        //    TransactionDetails = data?.ToString()
        //};

        //private CommonResult Error(string msg) => new()
        //{
        //    IsValidTransaction = false,
        //    TransactionDetails = msg
        //};

        //private async Task StoreUploadedBlockIdAsync(string userId, string fileName, string blockId)
        //{
        //    string key = $"{userId}_{fileName}";
        //    var options = new MemoryCacheEntryOptions
        //    {
        //        SlidingExpiration = TimeSpan.FromHours(6),
        //        Size = 1 // Track cache size
        //    };

        //    var blockIds = _cache.GetOrCreate(key, entry =>
        //    {
        //        entry.SetOptions(options);
        //        return new List<string>();
        //    });

        //    lock (blockIds) // Thread-safe addition
        //    {
        //        if (!blockIds.Contains(blockId))
        //        {
        //            blockIds.Add(blockId);
        //            _cache.Set(key, blockIds, options);
        //        }
        //    }
        //}

        //private async Task<bool> AllChunksUploadedAsync(string userId, string fileName, int totalChunks)
        //{
        //    string key = $"{userId}_{fileName}";
        //    if (!_cache.TryGetValue(key, out List<string> ids))
        //    {
        //        return false;
        //    }

        //    _logger.LogInformation("Upload progress for {FileName}: {Current}/{Total} chunks",
        //        fileName, ids.Count, totalChunks);

        //    return ids.Count >= totalChunks;
        //}

        //private async Task<List<string>> GetBlockIdsAsync(string userId, string fileName)
        //{
        //    string key = $"{userId}_{fileName}";
        //    if (!_cache.TryGetValue(key, out List<string> ids))
        //    {
        //        return new List<string>();
        //    }

        //    return ids
        //        .OrderBy(x => Convert.ToInt32(Encoding.UTF8.GetString(Convert.FromBase64String(x))))
        //        .ToList();
        //}

        //private async Task<int> GetUploadedChunkCountAsync(string userId, string fileName)
        //{
        //    string key = $"{userId}_{fileName}";
        //    return _cache.TryGetValue(key, out List<string> ids) ? ids.Count : 0;
        //}


        /////////////////////////////////////////////////////////////////////////////////////
        public async Task<ChunkStatusDto> CheckUploadedChunks(int userId, string fileName)
        {
            try
            {
                string tempDir = Path.Combine(VideoPath, "temp", $"{fileName}_{userId}");
                if (!Directory.Exists(tempDir))
                {
                    return new ChunkStatusDto
                    {
                        FileName = fileName,
                        UserId = userId,
                        UploadedChunkNumbers = new List<int>()
                    };
                }

                var uploadedChunks = Directory.GetFiles(tempDir)
                    .Select(file => int.Parse(Path.GetFileName(file).Replace("chunk_", "")))
                    .OrderBy(num => num)
                    .ToList();

                return new ChunkStatusDto
                {
                    FileName = fileName,
                    UserId = userId,
                    UploadedChunkNumbers = uploadedChunks
                };
            }
            catch (Exception ex)
            {
                // Console.WriteLine($"Error checking chunks: {ex.Message}");
                return new ChunkStatusDto
                {
                    FileName = fileName,
                    UserId = userId,
                    UploadedChunkNumbers = new List<int>(),
                    ErrorMessage = "An error occurred while checking uploaded chunks."
                };
            }
        }

        public async Task<FileDto> GetFileAsync(string fileName)
        {
            var path = Path.Combine(FilePath, fileName);

            if (!File.Exists(path))
                throw new FileNotFoundException($"File '{fileName}' not found.");

            var bytes = await File.ReadAllBytesAsync(path);
            var contentType = MimeMapping.MimeUtility.GetMimeMapping(fileName);

            return new FileDto
            {
                Content = bytes,
                ContentType = contentType,
                FileName = fileName
            };
        }

        public async Task<PaginatedResult<Videos>> GetTeachersVideoAsync(TeacherVideoDTO teacherVideo)
        {
            var query = _dbContext.Videos.AsQueryable();
            query = query.Where(f => f.TeacherID == teacherVideo.TeacherId);

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
                                //.Include(f => f.Student) 
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


            //if (!string.IsNullOrWhiteSpace(StudentAnswerFile.StudentName))
            //{
            //    query = query.Where(f => f.Student.StudentName.Contains(StudentAnswerFile.StudentName));
            //}

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((StudentAnswerFile.PageNumber - 1) * StudentAnswerFile.PageSize)
                .Take(StudentAnswerFile.PageSize)
                .Select(f => new
                {
                    f.FileAnswersID,
                    f.AnswerName,
                    f.StudentID,
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
                    StudentId = x.StudentID,
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

        public async Task<FileStream> GetVideoFileStreamAsync(string fileName)
        {
            if (string.IsNullOrWhiteSpace(fileName) ||
                fileName.Contains("..") ||
                fileName.Contains("/") ||
                fileName.Contains("\\"))
            {
                throw new ArgumentException("Invalid file name.");
            }

            var videoPath = Path.Combine(VideoPath, fileName);

            if (!File.Exists(videoPath))
            {
                throw new FileNotFoundException("الملف غير موجود", fileName);
            }

            var stream = new FileStream(videoPath, FileMode.Open, FileAccess.Read);
            return stream;
        }
    }

}
