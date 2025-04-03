using ApplicationContract.IFiles;
using ApplicationContract.Models;
using Domain.Entities;
using Infrastructure.Presistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Linq;

namespace Infrastructure.Repositories
{
    public class FilesRepository : IFilesRepository
    {
        private readonly PlatFormDbContext _dbContext;
        private readonly IConfiguration _configuration;
        string FilePath;
        string VideoPath;

        public FilesRepository(PlatFormDbContext dbContext, IConfiguration _configuration)
        {
            _dbContext = dbContext;
            var appSettingsSection = _configuration.GetSection("AppConfiguration");
            FilePath = appSettingsSection["FilePath"];
            VideoPath = appSettingsSection["VideoPath"];

        }

        public async Task<CommonResult> UploadFilePDF(IFormFile file, int userId, int teacherID, bool isAnswer, int? fileID)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "No file uploaded",
                        TransactionHeaderMessage = "No file uploaded"
                    };
                }
                string fileName = Path.GetFileNameWithoutExtension(file.FileName);
                string fileExtension = Path.GetExtension(file.FileName);
                string fullFileName = fileName + fileExtension;

                string filePath = Path.Combine(FilePath, fullFileName);
                //Check Duplicat Name
                var checkfiles = await _dbContext.Files
                   .FirstOrDefaultAsync(c => c.TeacherID == teacherID && (c.FileName == fullFileName || c.AnswerName == fullFileName)); // Or whatever the correct filtering logic is

                if (checkfiles != null)
                {
                    return new CommonResult
                    {
                        IsValidTransaction = false,
                        TransactionDetails = "TaskName Exist Befor ,Please Change It",
                        TransactionHeaderMessage = filePath
                    };
                }
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
                    await file.CopyToAsync(stream);
                }
                Files files = null;

                //// Save to database via EF Core
                if (isAnswer == false)
                {
                    //  files = await _dbContext.Files
                    //.FirstOrDefaultAsync(c => c.FilesID == fileID);
                    //  if (files != null)
                    //  {
                    //      // Update existing
                    //      files.FileName = fullFileName;
                    //      _dbContext.Files.Update(files);
                    //  }
                    //  else
                    //  {
                    // Create new if it doesn't exist
                    files = new Files
                    {
                        UserID = userId,
                        FileName = fullFileName,
                        TeacherID = teacherID
                    };
                    _dbContext.Files.Add(files);
                    // }
                }
                else
                {
                    files = await _dbContext.Files
                  .FirstOrDefaultAsync(c => c.FilesID == fileID);
                    if (files != null)
                    {
                        // Update existing
                        files.AnswerName = fullFileName;
                        _dbContext.Files.Update(files);
                    }
                }

                await _dbContext.SaveChangesAsync();
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
                    TransactionDetails = ex.Message,
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

        public async Task<IEnumerable<Files>> GetTeachersFilesAsync(int TeacherID)
        => await _dbContext.Files.Where(n => n.TeacherID == TeacherID).ToListAsync();

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
                            TeacherID = chunkDto.TeacherId
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
    }
}
