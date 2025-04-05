using ApplicationContract.Models;
using ApplicationContract.Models.File;
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
        Task<CommonResult> UploadFilePDF(FilePdfDTO file);
        Task<CommonResult> UploadFileChunk([FromForm] FileChunkDto chunkDto);
        Task<PaginatedResult<Files>> GetTeachersFilesAsync(TeacherFileDTO teacherFile);
        Task<ChunkStatusDto> CheckUploadedChunks(int userId, string fileName);
        Task<FileDto> GetFileAsync(string fileName);
        Task<PaginatedResult<Videos>> GetTeachersVideoAsync(TeacherVideoDTO teacherVideo);
        Task<IEnumerable<AcademicLevels>> GetAllAcademicLevelsAsync();
    }
}
