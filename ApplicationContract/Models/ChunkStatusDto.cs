using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class ChunkStatusDto
    {
        public string FileName { get; set; }
        public int UserId { get; set; }
        public List<int> UploadedChunkNumbers { get; set; }
        public string ErrorMessage { get; set; }
    }
}
