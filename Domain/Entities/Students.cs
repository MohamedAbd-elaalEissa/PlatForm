using DomainShared.SharedData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Students : BaseEntity
    {
        public int StudentID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int Age { get; set; }
        [Phone]
        public string PhoneNumber { get; set; }
        public string StudySubject { get; set; }
        [EmailAddress]
        public string Email { get; set; }
        //public int TeacherID { get; set; }
        public ICollection<Teachers> Teacher { get; set; }

    }
}
