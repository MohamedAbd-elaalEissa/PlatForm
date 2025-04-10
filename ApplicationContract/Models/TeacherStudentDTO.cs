using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class TeacherStudentDTO
    {
        public int TeacherID { get; set; }
        public List<StudentTeacherDto> Students { get; set; }

    }
    public class StudentTeacherDto
    {
        public int StudentID { get; set; }
        public string Email { get; set; }
    }
}
