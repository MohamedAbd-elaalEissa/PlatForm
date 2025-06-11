using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models.File
{
    public class StudentAnswerFilesDTO
    {
        public int TeacherId { get; set; }
        public int FilesId { get; set; }
        public int? StudentId { get; set; }
        public string StudentName { get; set; }
        public string TaskName { get; set; }
        public string AnswerName { get; set; }
        public string FileName { get; set; }
        public int FileAnswersID { get; set; }
        public int? AcademicLevelId { get; set; }
        public string AcademicLevelName { get; set; } 
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 25;
    }
}
