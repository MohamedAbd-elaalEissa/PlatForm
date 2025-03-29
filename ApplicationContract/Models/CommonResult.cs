using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class CommonResult
    {
        public bool? IsValidTransaction { get; set; }
        public int? TransactionStatusID { get; set; }
        public int? RecordID { get; set; }
        public string? TransactionHeaderMessage { get; set; }
        public string? TransactionDetails { get; set; }
    }
}
