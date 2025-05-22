using Microsoft.AspNetCore.Mvc;

namespace Presentation.Controllers.Angular
{
    public class AngularController : Controller
    {
        public ActionResult Index()
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser/index.html"), "text/HTML");
        }
    }
}
