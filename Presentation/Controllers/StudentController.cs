using Application.Features.Students.Commands;
using Application.Features.Students.Queries;
using Application.Features.Teachers.Commands;
using Application.Features.Teachers.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    public class StudentController : GeneralController
    {
        [HttpPost]
        [Route("CreateStudent")]
        public async Task<IActionResult> CreateStudent([FromBody] CreateStudentCommand command)
        {
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpPost]
        [Route("UpdateStudent")]
        public async Task<IActionResult> UpdateStudent(UpdateStudentCommand command)
        {
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("DeleteStudent")]
        public async Task<IActionResult> DeleteStudent(int TeacherID)
        {
            DeleteStudentCommand command = new DeleteStudentCommand(TeacherID);
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetAllStudent")]
        public async Task<IActionResult> GetAllStudent()
        {
            GetAllStudentsQueries query = new GetAllStudentsQueries();
            var res = await Mediator.Send(query);
            return Ok(res);
        }

        [HttpGet]
        [Route("GetStudentWithTeachers")]
        public async Task<IActionResult> GetStudentWithTeachers()
        {
            GetStudentWithTeachersQueries query = new GetStudentWithTeachersQueries();
            var res = await Mediator.Send(query);
            return Ok(res);
        }
    }
}
