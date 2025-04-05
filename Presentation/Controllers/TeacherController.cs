using Application.Features.Files.Commands;
using Application.Features.Files.Queries;
using Application.Features.Teachers.Commands;
using Application.Features.Teachers.Queries;
using ApplicationContract.Models;
using ApplicationContract.Models.File;
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
    }
}
