using DomainShared.SharedData;
using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class Chapters: BaseEntity
    {
        [Key]
        public int ChapterID { get; set; }
        [Required]
        public string ChapterName { get; set; }
        public int TeacherId { get; set; }
        public Teachers Teacher { get; set; }
        public int AcademicLevelId { get; set; }
        public AcademicLevels AcademicLevel { get; set; }
    }
}
