using Application.Features.Files.Commands;
using Application.Features.Files.Queries;
using Application.Features.Teachers.Commands;
using Application.Features.Teachers.Queries;
using ApplicationContract.Models;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    public class TeacherController : GeneralController
    {
        [HttpPost]
        [Route("CreateTeacher")]
        public async Task<IActionResult> CreateTeacher(CreateTeacherCommand command)
        {
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpPost]
        [Route("UpdateTeacher")]
        public async Task<IActionResult> UpdateTeacher(UpdateTeacherCommand command)
        {
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("DeleteTeacher")]
        public async Task<IActionResult> DeleteTeacher(int TeacherID)
        {
            DeleteTeacherCommand command = new DeleteTeacherCommand(TeacherID);
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetAllTeachers")]
        public async Task<IActionResult> GetAllTeachers()
        {
            GetAllTeachersQueries query = new GetAllTeachersQueries();
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetTeacherWithStudents")]
        public async Task<IActionResult> GetTeacherWithStudents()
        {
            GetTeacherWithStudentsQueries query = new GetTeacherWithStudentsQueries();
            var res = await Mediator.Send(query);
            return Ok(res);
        }
        [HttpPost]
        [Route("UploadFilePDF")]
        public async Task<IActionResult> UploadFilePDF([FromForm] FilePdfDTO file)
        {
            UploadFilesPDFCommand command = new UploadFilesPDFCommand(file.file,file.userId,file.teacherId,file.isAnswer,file.fileID);
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [DisableRequestSizeLimit]
        [RequestFormLimits(MultipartBodyLengthLimit = 3221225472)]
        [HttpPost]
        [Route("UploadFileChunk")]
        public async Task<IActionResult> UploadFileChunk([FromForm] FileChunkDto chunkDto)
        {
            UploadFilesChunkCommand command = new UploadFilesChunkCommand(chunkDto);
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetTeachersFiles")]
        public async Task<IActionResult> GetTeachersFiles(int teacherID)
        {
            GetTeachersFilesQuery query = new GetTeachersFilesQuery(teacherID);
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpGet]
        [Route("CheckUploadedChunks")]
        public async Task<IActionResult> CheckUploadedChunks(int userId, string fileName)
        {
            CheckUploadedChunksQuery query = new CheckUploadedChunksQuery(userId,fileName);
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpGet]
        [Route("DownloadFile")]
        public async Task<IActionResult> Download(string fileName)
        {
            var fileDto = await Mediator.Send(new DownloadFileQuery(fileName));

            return File(fileDto.Content, fileDto.ContentType, fileDto.FileName);
        }
    }
}
