using DomainShared.SharedData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Videos:BaseEntity
    {
        [Key]
        public int VideoID { get; set; }
        public int? UserID { get; set; }
        public string VideoName { get; set; }
        public int TeacherID { get; set; }
        public int? ChapterID { get; set; }
        public Teachers Teacher { get; set; }
        public Chapters Chapter { get; set; }
    }
}
