using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class ChapterUpdateDTO
    {
        public int ChapterID { get; set; }
        public int TeacherId { get; set; }
        public int AcademicLevelId { get; set; }
        public string ChapterName { get; set; }
        
    }
}
