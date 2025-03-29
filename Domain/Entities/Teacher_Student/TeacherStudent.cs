using DomainShared.SharedData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities.Teacher_Student
{
    public class TeacherStudent : BaseEntity
    {
        [ForeignKey("Teacher1")]
        public int TeacherID { get; set; }
        [ForeignKey("Student")]
        public int StudentID { get; set; }

        public Teachers Teacher { get; set; }
        public Students Student { get; set; }

    }
}
