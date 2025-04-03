using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models
{
    public class FileChunkDto
    {
        public int ChunkNumber { get; set; } // Which chunk this is (e.g., 1, 2, 3...)
        public int TotalChunks { get; set; } // Total number of chunks
        public string FileName { get; set; } // Original file name
        public IFormFile Chunk { get; set; } // The chunk data
        public int UserId { get; set; }
        public int TeacherId { get; set; }
        public int AcademicLevelID { get; set; }

    }
}
