using ApplicationContract.IFiles;
using ApplicationContract.Models;
using Domain.Entities;
using Infrastructure.Presistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            _configuration = _configuration;
            var appSettingsSection = _configuration.GetSection("AppConfiguration");
            uploadImagePath = appSettingsSection["UploadFilePath"];

        }

        public async Task<CommonResult> CreateAsync(IFormFile file, int userId)
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

                // Save to database via EF Core
                var files = await _dbContext.Files
                    .FirstOrDefaultAsync(c => c.UserID == userId); // Or whatever the correct filtering logic is

                if (files == null)
                {
                    // Create new if it doesn't exist
                    files = new Files
                    {
                        UserID = userId,
                        FileName = fullFileName
                    };

                    _dbContext.Files.Add(files);
                }
                else
                {
                    // Update existing
                    files.FileName = fullFileName;
                    _dbContext.Files.Update(files);
                }

                await _dbContext.SaveChangesAsync();

                return new CommonResult
                {
                    IsValidTransaction = true,
                    TransactionDetails = "Upload Logo successfully",
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

    }
}
