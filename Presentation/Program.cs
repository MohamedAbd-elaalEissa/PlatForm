using Application.Shared;
using Infrastructure.Repositories.AzureConfigurationTime;
using Infrastructure.Repositories.RabbitMQ;
using Infrastructure.Repositories.SignalR;
using Infrastructure.Shared;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.FileProviders;
using Presentation.Shared;
using System.Net;
using System.Security.Authentication;
using Microsoft.AspNetCore.Http.Features;
namespace Presentation
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.Limits.MaxRequestBodySize = 5L * 1024L * 1024L * 1024L; // 5 GB
                serverOptions.Limits.MinRequestBodyDataRate = null; // Disable minimum data rate
                serverOptions.Limits.MinResponseDataRate = null;
                serverOptions.Limits.KeepAliveTimeout = TimeSpan.FromMinutes(60); // Increased keep-alive
                serverOptions.Limits.RequestHeadersTimeout = TimeSpan.FromMinutes(60); // Increased header timeout
                serverOptions.Limits.Http2.KeepAlivePingDelay = TimeSpan.FromMinutes(30);
                serverOptions.Limits.Http2.KeepAlivePingTimeout = TimeSpan.FromMinutes(10);
            });

            // Add services to the container.  
            builder.Services.AddOpenApi();
            builder.Services.AddApplicationServices();
            builder.Services.AddInfrastructureServices(builder.Configuration);
            builder.Services.AddPresentationServices();
            builder.Services.AddDataProtection()
                .PersistKeysToFileSystem(new DirectoryInfo(Path.Combine(builder.Environment.ContentRootPath, "DataProtectionKeys")));

            // Configure Kestrel server options (if necessary)  
            builder.WebHost.ConfigureKestrel(serverOptions =>
            {
                serverOptions.Limits.MaxRequestBodySize = 3221225472; // 3GB  
            });

            var app = builder.Build();
            app.UseRequestTimeouts();
            // Configure the HTTP request pipeline.  
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "browser")),
                RequestPath = ""
            });


            app.UseHttpsRedirection();
            app.UseRouting();
            app.UseCors("AllowAllOrigins");
            app.UseAuthentication();
            app.UseAuthorization();
            app.MapControllers();

            app.MapHub<NotificationHub>("/notificationHub");
            app.MapFallbackToController("Index", "Angular"); // Angular routing  
            app.UseCustomRequestTimeout(TimeSpan.FromMinutes(20));
            app.UseResponseCompression();
            // Replace the obsolete ServicePointManager code with HttpClientHandler configuration  
            var handler = new HttpClientHandler
            {
                SslProtocols = SslProtocols.Tls12
            };
            using var httpClient = new HttpClient(handler);
            app.Use(async (context, next) =>
            {
                // Set unlimited request body size for upload endpoints  
                var maxRequestBodySizeFeature = context.Features.Get<IHttpMaxRequestBodySizeFeature>();
                if (maxRequestBodySizeFeature != null && !maxRequestBodySizeFeature.IsReadOnly)
                {
                    maxRequestBodySizeFeature.MaxRequestBodySize = null;
                }

                // Set custom timeout header for client awareness  
                if (context.Request.Path.StartsWithSegments("/api/file") ||
                    context.Request.Path.StartsWithSegments("/api/upload"))
                {
                    context.Response.Headers.Add("X-Upload-Timeout", "3600"); // 60 minutes  
                }

                await next();
            });

            // Add request logging middleware for debugging
            app.Use(async (context, next) =>
            {
                var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

                if (context.Request.ContentType?.Contains("multipart/form-data") == true)
                {
                    logger.LogInformation($"Processing multipart upload: {context.Request.Path}");
                    logger.LogInformation($"Content-Length: {context.Request.ContentLength}");
                }

                await next();
            });
            app.Run();
        }
    }
}
