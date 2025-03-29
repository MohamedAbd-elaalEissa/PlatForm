using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class TeacherDTO
    {
        public int? TeacherID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Brief { get; set; }
        public int Age { get; set; }
        public string PhoneNumber { get; set; }
        public string StudySubject { get; set; }
        public string ImagesUrl { get; set; }
        public string Email { get; set; }
    }
}
