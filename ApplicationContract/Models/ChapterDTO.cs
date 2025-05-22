using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class ChapterDto
    {
        public int? ChapterID { get; set; }
        public int TeacherId { get; set; }
        public int? AcademicLevelId { get; set; }
        public string AcademicLevelName { get; set; }
        public string ChapterName { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
    }
}
