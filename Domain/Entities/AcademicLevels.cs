using DomainShared.SharedData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class AcademicLevels : BaseEntity
    {
        [Key]
        public int AcademicLevelID { get; set; }
        public string AcademicLevelName { get; set; }
        public int? ParentID { get; set; }
    }
}
