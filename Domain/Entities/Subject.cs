using DomainShared.SharedData;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Subjects: BaseEntity
    {
        [Key]
        public int SubjectId { get; set; }
        public string Subject { get; set; }
    }
}
