using DomainShared.SharedData;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Files : BaseEntity
    {
        [Key]
        public int FilesID { get; set; }
        public int? UserID { get; set; }
        public string FileName { get; set; }
        public string AnswerName { get; set; }
        public int? StudentID { get; set; }
        public string TaskName { get; set; }
        public bool IsAnswer { get; set; }
        public int TeacherID { get; set; }
        public Teachers Teacher { get; set; }
        public int AcademicLevelID { get; set; }
        public AcademicLevels AcademicLevel { get; set; }
    }
}
