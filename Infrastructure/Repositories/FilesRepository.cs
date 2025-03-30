using ApplicationContract.IFiles;
using ApplicationContract.Models;
using Domain.Entities;
using Infrastructure.Presistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Repositories
{
    public class FilesRepository : IFilesRepository
    {
        private readonly PlatFormDbContext _dbContext;
        private readonly IConfiguration _configuration;
        string uploadImagePath;

        public FilesRepository(PlatFormDbContext dbContext, IConfiguration _configuration)
        {
            _dbContext = dbContext;
            var appSettingsSection = _configuration.GetSection("AppConfiguration");
            uploadImagePath = appSettingsSection["UploadFilePath"];

        }

        public async Task<CommonResult> UploadFile(IFormFile file, int userId, int teacherID)
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

                string filePath = Path.Combine(uploadImagePath, fullFileName);

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

                //// Save to database via EF Core
                //var files = await _dbContext.Files
                //    .FirstOrDefaultAsync(c => c.UserID == userId); // Or whatever the correct filtering logic is

                //if (files == null)
                //{
                // Create new if it doesn't exist
                var files = new Files
                {
                    UserID = userId,
                    FileName = fullFileName,
                    TeacherID = teacherID
                };

                _dbContext.Files.Add(files);
                //  }
                //else
                //{
                //    // Update existing
                //    files.FileName = fullFileName;
                //    _dbContext.Files.Update(files);
                //}

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
                string tempDir = Path.Combine(uploadImagePath, "temp", $"{chunkDto.FileName}_{chunkDto.UserId}");
                string tempChunkPath = Path.Combine(tempDir, $"chunk_{chunkDto.ChunkNumber}");
                string finalFilePath = Path.Combine(uploadImagePath, $"{Guid.NewGuid()}_{chunkDto.FileName}");

                Console.WriteLine($"Receiving chunk {chunkDto.ChunkNumber} of {chunkDto.TotalChunks} for {chunkDto.FileName}");

                // Ensure temp directory exists
                Directory.CreateDirectory(tempDir);

                // Save the chunk
                using (var stream = new FileStream(tempChunkPath, FileMode.Create))
                {
                    await chunkDto.Chunk.CopyToAsync(stream);
                }

                // Check if all chunks are uploaded
                int uploadedChunks = Directory.GetFiles(tempDir).Length;
                Console.WriteLine($"Uploaded chunks: {uploadedChunks} / {chunkDto.TotalChunks}");

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

                    // Save to database
                    var existingFile = await _dbContext.Files
                        .FirstOrDefaultAsync(f => f.UserID == chunkDto.UserId && f.TeacherID == chunkDto.TeacherId);

                    string finalFileName = Path.GetFileName(finalFilePath);
                    if (existingFile != null)
                    {
                        existingFile.FileName = finalFileName;
                        _dbContext.Files.Update(existingFile);
                    }
                    else
                    {
                        var newFile = new Files
                        {
                            UserID = chunkDto.UserId,
                            FileName = finalFileName,
                            TeacherID = chunkDto.TeacherId
                        };
                        _dbContext.Files.Add(newFile);
                    }

                    await _dbContext.SaveChangesAsync();

                    Console.WriteLine("File upload completed successfully");
                    return new CommonResult
                    {
                        IsValidTransaction = true,
                        TransactionDetails = "File uploaded successfully",
                        TransactionHeaderMessage = finalFilePath
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
                    TransactionDetails = "An error occurred while uploading the chunk",
                    TransactionHeaderMessage = "Upload failed"
                };
            }
        }
    }
}
