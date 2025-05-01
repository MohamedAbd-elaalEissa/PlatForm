using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models.RabbitMQ
{
    public class MessageDto
    {
        public string userName { get; set; }
        public string email { get; set; }
        public string phoneNumber { get; set; }

    }
}
