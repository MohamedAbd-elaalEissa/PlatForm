using Application.Shared;
using Infrastructure.Repositories.RabbitMQ;
using Infrastructure.Repositories.SignalR;
using Infrastructure.Shared;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.FileProviders;
using Presentation.Shared;
using System.Net;
using System.Security.Authentication;

namespace Presentation
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

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

            // Replace the obsolete ServicePointManager code with HttpClientHandler configuration  
            var handler = new HttpClientHandler
            {
                SslProtocols = SslProtocols.Tls12
            };
            using var httpClient = new HttpClient(handler);

            app.Run();
        }
    }
}
