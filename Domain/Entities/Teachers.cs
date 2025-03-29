using DomainShared.SharedData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Teachers : BaseEntity
    {
        public int TeacherID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Brief { get; set; }
        public int Age { get; set; }
        [Phone]
        public string PhoneNumber { get; set; }
        public string StudySubject { get; set; }
        public string ImagesUrl { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        //public int StudentID { get; set; }
        public ICollection<Students> Student { get; set; }
        public ICollection<Files> Files { get; set; }

    }
}
