using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models.File
{
    public class FilePdfDTO
    {
        public int? fileID { get; set; }
        public IFormFile file { get; set; } // The chunk data
        public int userId { get; set; }
        public int? studentId { get; set; }
        public int? teacherId { get; set; }
        public bool isAnswer { get; set; }
        public int? academicLevelID { get; set; }
        public string? taskName { get; set; }
        public string? answerName { get; set; }

    }
}
