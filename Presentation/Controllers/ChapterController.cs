using Application.Features.Chapters.Commands;
using Application.Features.Chapters.Queries;
using Application.Features.Teachers.Commands;
using ApplicationContract.Models;
using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers
{
    public class ChapterController : GeneralController
    {
        [HttpPost]
        [Route("GetAllChapters")]
        public async Task<IActionResult> GetAllChapters(ChapterDto filter)
        {
            var result = await Mediator.Send(new GetAllChaptersByTeacherIDQuery(filter));
            return Ok(result);
        }

        [HttpPost]
        [Route("CreateChapter")]
        public async Task<IActionResult> CreateChapter(CreateChapterCommand command)
        {
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpPost]
        [Route("UpdateChapter")]
        public async Task<IActionResult> UpdateChapter(UpdateChapterCommand command)
        {
            var res = await Mediator.Send(command);
            return Ok(res);
        }

        [HttpGet]
        [Route("DeleteChapter")]
        public async Task<IActionResult> DeleteChapter(int id)
        {
            await Mediator.Send(new DeleteChapterCommand(id));
            return NoContent();
        }
    }
}
