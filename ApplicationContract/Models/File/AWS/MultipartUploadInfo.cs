using Amazon.S3.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Models.File.AWS
{
    public class MultipartUploadInfo
    {
        public string UploadId { get; set; } = string.Empty;
        public string ObjectKey { get; set; } = string.Empty;
        public List<PartETag> PartETags { get; set; } = new List<PartETag>();
        public int UserId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string TeacherId { get; set; } = string.Empty;
        public int ChapterId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime LastActivity { get; set; }
        public int TotalChunks { get; set; }
    }
}
