using Application.Features.Files.Commands;
using Application.Features.Files.Queries;
using ApplicationContract.Models.File;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    public class FileController : GeneralController
    {
        [HttpPost]
        [Route("UploadFilePDF")]
        public async Task<IActionResult> UploadFilePDF([FromForm] FilePdfDTO file)
        {
            UploadFilesPDFCommand command = new UploadFilesPDFCommand(file);
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

        [HttpPost]
        [Route("GetTeachersFiles")]
        public async Task<IActionResult> GetTeachersFiles(TeacherFileDTO teacherFile)
        {
            GetTeachersFilesQuery query = new GetTeachersFilesQuery(teacherFile);
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpGet]
        [Route("CheckUploadedChunks")]
        public async Task<IActionResult> CheckUploadedChunks(int userId, string fileName)
        {
            CheckUploadedChunksQuery query = new CheckUploadedChunksQuery(userId, fileName);
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

        [HttpPost]
        [Route("GetTeachersVideos")]
        public async Task<IActionResult> GetTeachersVideos(TeacherVideoDTO teacherVideo)
        {
            GetTeachersVideoQuery query = new GetTeachersVideoQuery(teacherVideo);
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetAllAcademicLevels")]
        public async Task<IActionResult> GetAllAcademicLevels()
        {
            GetAllAcademicLevelsQuery query = new GetAllAcademicLevelsQuery();
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpPost]
        [Route("GetStudentAnswer")]
        public async Task<IActionResult>GetStudentAnswer(StudentAnswerFilesDTO studentAnswerFiles)
        {
            StudentAnswerFilesQuery query = new StudentAnswerFilesQuery(studentAnswerFiles);
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetVideoFile")]
        public async Task<IActionResult> GetVideoFile(string fileName)
        {
            var fileStreamResult = await Mediator.Send(new GetVideoFileQuery(fileName));
            return fileStreamResult;
        }
    }
}
