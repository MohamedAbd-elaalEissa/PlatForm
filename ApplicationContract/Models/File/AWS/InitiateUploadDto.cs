using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models.File.AWS
{
    public class InitiateUploadDto
    {
        public string FileName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string TeacherId { get; set; } = string.Empty;
        public int ChapterId { get; set; }
    }

    public class CompleteUploadDto
    {
        public string FileName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UploadId { get; set; } = string.Empty;
    }

    public class AbortUploadDto
    {
        public string FileName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public string UploadId { get; set; } = string.Empty;
    }

    public class UploadProgressDto
    {
        public string FileName { get; set; } = string.Empty;
        public int UserId { get; set; }
        public int TotalChunks { get; set; }
        public int UploadedChunks { get; set; }
        public double ProgressPercentage { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    // Add UploadId to existing FileChunkDto
   
}
