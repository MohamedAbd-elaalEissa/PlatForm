using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class FilePdfDTO
    {
        public int? fileID { get; set; }
        public IFormFile file { get; set; } // The chunk data
        public int userId { get; set; }
        public int teacherId { get; set; }
        public bool isAnswer { get; set; }
        public int AcademicLevelID { get; set; }
    }
}
