using DomainShared.SharedData;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class OfflineMessage : BaseEntity
    {
        public int OfflineMessageID { get; set; }
        public string UserEmail { get; set; }
        public string Message { get; set; }
    }
}
