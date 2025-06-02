using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories.AzureConfigurationTime
{
    // Custom timeout middleware for .NET 6/7
    public class RequestTimeoutMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly TimeSpan _timeout;
        private readonly ILogger<RequestTimeoutMiddleware> _logger;

        public RequestTimeoutMiddleware(RequestDelegate next, TimeSpan timeout, ILogger<RequestTimeoutMiddleware> logger)
        {
            _next = next;
            _timeout = timeout;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            // Skip timeout for file upload endpoints
            if (context.Request.Path.StartsWithSegments("/api/File/UploadFileChunk"))
            {
                await _next(context);
                return;
            }

            using var cts = new CancellationTokenSource(_timeout);
            var originalToken = context.RequestAborted;

            try
            {
                // Combine the original cancellation token with our timeout
                using var combined = CancellationTokenSource.CreateLinkedTokenSource(originalToken, cts.Token);
                context.RequestAborted = combined.Token;

                await _next(context);
            }
            catch (OperationCanceledException) when (cts.Token.IsCancellationRequested && !originalToken.IsCancellationRequested)
            {
                _logger.LogWarning("Request timed out after {Timeout}ms for {Path}",
                    _timeout.TotalMilliseconds, context.Request.Path);

                context.Response.StatusCode = 408; // Request Timeout
                await context.Response.WriteAsync("Request timeout");
            }
            finally
            {
                context.RequestAborted = originalToken;
            }
        }
    }

    // Extension method to add the middleware
    public static class RequestTimeoutMiddlewareExtensions
    {
        public static IApplicationBuilder UseCustomRequestTimeout(this IApplicationBuilder builder, TimeSpan timeout)
        {
            return builder.UseMiddleware<RequestTimeoutMiddleware>(timeout);
        }
    }
}
