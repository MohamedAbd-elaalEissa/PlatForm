using ApplicationContract.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
//using Application.Models.CommonResult;

namespace ApplicationContract.IFiles
{
    public interface IFilesRepository
    {
        Task<IReadOnlyList<Files>> GetAllAsync();
        Task<Files> GetAsync(int? ID);
        Task DeleteAsync(int ID);
        Task<CommonResult> UploadFilePDF(IFormFile file, int userId, int teacherID, bool isAnswer,int? fileID, int AcademicLevelID);
        Task<CommonResult> UploadFileChunk([FromForm] FileChunkDto chunkDto);
        Task<IEnumerable<Files>> GetTeachersFilesAsync(int TeacherID);
        Task<ChunkStatusDto> CheckUploadedChunks(int userId, string fileName);
        Task<FileDto> GetFileAsync(string fileName);
    }
}
