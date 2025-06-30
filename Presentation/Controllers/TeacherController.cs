using Application.Features.Files.Commands;
using Application.Features.Files.Queries;
using Application.Features.Teachers.Commands;
using Application.Features.Teachers.Queries;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
using Domain.Entities;
using Microsoft.AspNetCore.Authorization;
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
       // [Authorize(Roles ="Admin")]
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

        [HttpGet]
        [Route("GetTeacherByEmail")]
        public async Task<IActionResult> GetTeacherByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest("Email is required.");

            var query = new GetTeacherByEmailQuery(email);
            var result = await Mediator.Send(query);

            if (result == null)
                return NotFound($"No teacher found with email: {email}");

            return Ok(result);
        }

        [HttpGet]
        [Route("GetAllStudySubject")]
        public async Task<IActionResult> GetAllStudySubject()
        {
            GetAllStudySubjectQuery query = new GetAllStudySubjectQuery();
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpPost("UploadMultipleImages")]
        public async Task<IActionResult> UploadMultipleImages(List<IFormFile> files)
        {
            var uploadedFileNames = new List<string>();
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser");

            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var uniqueName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var fullPath = Path.Combine(folderPath, uniqueName);

                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    uploadedFileNames.Add(uniqueName);
                }
            }

            return Ok(uploadedFileNames); 
        }


    }
}
