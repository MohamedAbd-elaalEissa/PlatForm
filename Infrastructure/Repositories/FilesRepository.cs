using ApplicationContract.IFiles;
using ApplicationContract.IStudent;
using ApplicationContract.ITeacher;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
using Domain.Entities;
using Infrastructure.Presistence;
using Infrastructure.Repositories.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

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

        public FilesRepository(PlatFormDbContext dbContext, IConfiguration _configuration, ITeacherRepository teacher, IHubContext<NotificationHub> hub)
        {
            _dbContext = dbContext;
            _teacher = teacher;
            _hub = hub;
            var appSettingsSection = _configuration.GetSection("AppConfiguration");
            FilePath = appSettingsSection["FilePath"];
            VideoPath = appSettingsSection["VideoPath"];

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
                            AcademicLevelID = (int)filePDF.academicLevelID,
                            TaskName = filePDF.taskName

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
                            await _hub.Clients.Client(NotificationHub.GetConnectionId(item.Email)).SendAsync("ReceiveNotification",
                                $"تم إضافة مهمة جديدة: {filePDF.taskName}");
                            //await _hub.Clients.All.SendAsync("ReceiveNotification", $"{filePDF.userId} من {filePDF.taskName}تم اضافه  ");
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
                    TransactionDetails = ex.InnerException.Message,
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
            query = query.Where(f => f.TeacherID == teacherFile.TeacherId);

            if (!string.IsNullOrWhiteSpace(teacherFile.TaskName) && teacherFile.AcademicLevelId.HasValue)
            {
                query = query.Where(f => f.TaskName.Contains(teacherFile.TaskName) && f.AcademicLevelID == teacherFile.AcademicLevelId.Value);

            }
            else if (!string.IsNullOrWhiteSpace(teacherFile.TaskName))
            {
                query = query.Where(f => f.TaskName.Contains(teacherFile.TaskName));
            }

            else if (teacherFile.AcademicLevelId.HasValue)
            {
                query = query.Where(f => f.AcademicLevelID == teacherFile.AcademicLevelId.Value);
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

                // Define paths
                string tempDir = Path.Combine(VideoPath, "temp", $"{chunkDto.FileName}_{chunkDto.UserId}");
                string tempChunkPath = Path.Combine(tempDir, $"chunk_{chunkDto.ChunkNumber}");
                string finalFilePath = Path.Combine(VideoPath, $"{chunkDto.FileName}");

                //Console.WriteLine($"Receiving chunk {chunkDto.ChunkNumber} of {chunkDto.TotalChunks} for {chunkDto.FileName}");

                // Ensure temp directory exists
                Directory.CreateDirectory(tempDir);


                var existingFile = await _dbContext.Videos
                        .FirstOrDefaultAsync(f => f.TeacherID == chunkDto.TeacherId && f.VideoName == chunkDto.FileName);

                string finalFileName = Path.GetFileName(finalFilePath);
                if (existingFile != null)
                {
                    //existingFile.VideoName = finalFileName;
                    //_dbContext.Videos.Update(existingFile);
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "Check Another VideoName",
                        TransactionHeaderMessage = finalFilePath
                    };
                }
                else
                {
                    // Save the chunk
                    using (var stream = new FileStream(tempChunkPath, FileMode.Create))
                    {
                        await chunkDto.Chunk.CopyToAsync(stream);
                    }

                    // Check if all chunks are uploaded
                    int uploadedChunks = Directory.GetFiles(tempDir).Length;
                    //Console.WriteLine($"Uploaded chunks: {uploadedChunks} / {chunkDto.TotalChunks}");

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
                            AcademicLevelID = chunkDto.AcademicLevelID
                        };
                        _dbContext.Videos.Add(newFile);

                        await _dbContext.SaveChangesAsync();

                        //Console.WriteLine("File upload completed successfully");
                        return new CommonResult
                        {
                            IsValidTransaction = true,
                            TransactionDetails = "File uploaded successfully",
                            TransactionHeaderMessage = finalFilePath
                        };
                    }
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
                //Console.WriteLine($"Error uploading chunk: {ex.Message}");
                return new CommonResult
                {
                    IsValidTransaction = false,
                    TransactionDetails = "An error occurred while uploading the chunk",
                    TransactionHeaderMessage = "Upload failed"
                };
            }
        }


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

            if (!string.IsNullOrWhiteSpace(teacherVideo.VideoName) && teacherVideo.AcademicLevelId.HasValue)
            {
                query = query.Where(f => f.VideoName.Contains(teacherVideo.VideoName) && f.AcademicLevelID == teacherVideo.AcademicLevelId.Value);

            }
            else if (!string.IsNullOrWhiteSpace(teacherVideo.VideoName))
            {
                query = query.Where(f => f.VideoName.Contains(teacherVideo.VideoName));
            }

            else if (teacherVideo.AcademicLevelId.HasValue)
            {
                query = query.Where(f => f.AcademicLevelID == teacherVideo.AcademicLevelId.Value);
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
                                    .ThenInclude(f => f.AcademicLevel)
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

            if (!string.IsNullOrWhiteSpace(StudentAnswerFile.AcademicLevelName))
            {
                query = query.Where(f => f.Files.AcademicLevel.AcademicLevelName.Contains(StudentAnswerFile.AcademicLevelName));
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
                    f.Files.AcademicLevel.AcademicLevelName,
                    f.Files.AcademicLevel.AcademicLevelID
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
                    AcademicLevelId = x.AcademicLevelID,
                    AcademicLevelName = x.AcademicLevelName,
                    FilesId = x.FilesID,
                    TeacherId = x.TeacherID
                }).ToList(),
                TotalCount = totalCount,
                PageNumber = StudentAnswerFile.PageNumber,
                PageSize = StudentAnswerFile.PageSize
            };
        }


    }

}
