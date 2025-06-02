using Amazon.S3.Model;
using Amazon.S3;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

public interface IS3Service
{
    Task<InitiateMultipartUploadResponse> InitializeMultipartUploadAsync(string objectKey);
    Task<PartETag> UploadPartAsync(string objectKey, string uploadId, int partNumber, Stream inputStream, long partSize);
    Task CompleteMultipartUploadAsync(string objectKey, string uploadId, List<PartETag> partETags);
    Task AbortMultipartUploadAsync(string objectKey, string uploadId);
}

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;
    private readonly ILogger<S3Service> _logger;

    public S3Service(IAmazonS3 s3Client, IConfiguration configuration, ILogger<S3Service> logger)
    {
        _s3Client = s3Client;
        _bucketName = configuration["AWS:S3:BucketName"];
        _logger = logger;
    }

    public async Task<InitiateMultipartUploadResponse> InitializeMultipartUploadAsync(string objectKey)
    {
        try
        {
            var request = new InitiateMultipartUploadRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                ContentType = "video/mp4", // Adjust based on your needs
                ServerSideEncryptionMethod = ServerSideEncryptionMethod.AES256
            };

            var response = await _s3Client.InitiateMultipartUploadAsync(request);
            _logger.LogInformation($"Initialized multipart upload for {objectKey} with UploadId: {response.UploadId}");

            return response;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to initialize multipart upload for {objectKey}");
            throw;
        }
    }

    public async Task<PartETag> UploadPartAsync(string objectKey, string uploadId, int partNumber, Stream inputStream, long partSize)
    {
        try
        {
            var request = new UploadPartRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                UploadId = uploadId,
                PartNumber = partNumber,
                PartSize = partSize,
                InputStream = inputStream
            };

            var response = await _s3Client.UploadPartAsync(request);
            _logger.LogInformation($"Uploaded part {partNumber} for {objectKey}");

            return new PartETag(partNumber, response.ETag);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to upload part {partNumber} for {objectKey}");
            throw;
        }
    }

    public async Task CompleteMultipartUploadAsync(string objectKey, string uploadId, List<PartETag> partETags)
    {
        try
        {
            var request = new CompleteMultipartUploadRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                UploadId = uploadId
            };

            request.AddPartETags(partETags);

            var response = await _s3Client.CompleteMultipartUploadAsync(request);
            _logger.LogInformation($"Completed multipart upload for {objectKey}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to complete multipart upload for {objectKey}");
            throw;
        }
    }

    public async Task AbortMultipartUploadAsync(string objectKey, string uploadId)
    {
        try
        {
            var request = new AbortMultipartUploadRequest
            {
                BucketName = _bucketName,
                Key = objectKey,
                UploadId = uploadId
            };

            await _s3Client.AbortMultipartUploadAsync(request);
            _logger.LogInformation($"Aborted multipart upload for {objectKey}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Failed to abort multipart upload for {objectKey}");
            throw;
        }
    }
}