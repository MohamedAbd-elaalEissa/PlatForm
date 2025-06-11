using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class FileAnswers
    {
        public int FileAnswersID { get; set; }
        public string AnswerName { get; set; }
        public int? StudentID { get; set; }
        public int FilesID { get; set; }
        public Files Files { get; set; }
        public Students Student { get; set; }
    }
}
