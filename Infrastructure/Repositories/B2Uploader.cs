using B2Net;
using B2Net.Models;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class B2Uploader
    {
        private readonly B2Client _b2Client;
        private readonly string _bucketId;
        private readonly string _tempDir;

        public B2Uploader(IConfiguration configuration)
        {
            var options = new B2Options
            {
                KeyId = configuration["B2Settings:KeyId"],
                ApplicationKey = configuration["B2Settings:ApplicationKey"],
                BucketId = configuration["B2Settings:BucketId"],
                PersistBucket = true
            };
            _b2Client = new B2Client(options);
           
            _bucketId = options.BucketId;
            _tempDir = Path.Combine(Path.GetTempPath(), "b2_uploads");
            try
            {
                _b2Client.Authorize().Wait();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"B2 Authorization failed: {ex.Message}");
                throw;
            }
        }

        public async Task<string> UploadFileAsync(string filePath, string fileName)
        {
            byte[] fileData = File.ReadAllBytes(filePath);
            var file = await _b2Client.Files.Upload(fileData, fileName);
            return file.FileName;
        }

        public async Task<string> UploadFileChunkAsync(byte[] chunkData, string fileName, int chunkNumber, int userId)
        {
            // Create a unique temp directory for this upload
            string uploadTempDir = Path.Combine(_tempDir, $"{userId}_{Path.GetFileNameWithoutExtension(fileName)}");
            Directory.CreateDirectory(uploadTempDir);

            // Save the chunk locally (temporarily)
            string chunkPath = Path.Combine(uploadTempDir, $"{chunkNumber}.chunk");
            await File.WriteAllBytesAsync(chunkPath, chunkData);

            return chunkPath;
        }

        public async Task<string> CombineChunksAndUploadAsync(string fileName, int totalChunks, int userId)
        {
            string uploadTempDir = Path.Combine(_tempDir, $"{userId}_{Path.GetFileNameWithoutExtension(fileName)}");

            // Check if all chunks are present
            var chunkFiles = Directory.GetFiles(uploadTempDir, "*.chunk");
            if (chunkFiles.Length != totalChunks)
            {
                throw new Exception($"Missing chunks. Expected {totalChunks}, found {chunkFiles.Length}");
            }

            // Combine chunks in memory
            using var memoryStream = new MemoryStream();
            for (int i = 1; i <= totalChunks; i++)
            {
                string chunkPath = Path.Combine(uploadTempDir, $"{i}.chunk");
                byte[] chunkData = await File.ReadAllBytesAsync(chunkPath);
                await memoryStream.WriteAsync(chunkData, 0, chunkData.Length);
            }

            // Replace the problematic line with the following:  
            B2File file = null;
            memoryStream.Position = 0;
            try
            {
                 file = await _b2Client.Files.Upload(memoryStream.ToArray(), fileName);

            }
            catch (Exception ex)
            {

                throw;
            }

            // Clean up temp files
            Directory.Delete(uploadTempDir, true);

            return file.FileName;
        }
    }
}