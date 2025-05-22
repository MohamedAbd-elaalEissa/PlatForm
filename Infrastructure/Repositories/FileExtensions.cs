namespace Infrastructure.Repositories
{
    public static class FileExtensions
    {
        public static string GetContentType(this string fileName)
        {
            var extension = Path.GetExtension(fileName).ToLowerInvariant();
            return extension switch
            {
                ".mp4" => "video/mp4",
                ".mov" => "video/quicktime",
                ".avi" => "video/x-msvideo",
                ".wmv" => "video/x-ms-wmv",
                _ => "application/octet-stream"
            };
        }
    }

}
