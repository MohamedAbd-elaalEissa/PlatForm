using ApplicationContract.Generic;
using Azure.Core.Pipeline;
using Azure.Core;
using Azure.Storage.Blobs;
using Infrastructure.Presistence;
using Infrastructure.Repositories;
using Infrastructure.Repositories.RabbitMQ;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Shared
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration confegeration)
        {
            services.AddDbContext<PlatFormDbContext>(options =>
            {
                options.UseSqlServer(confegeration.GetConnectionString("PlatFormConnection"));
            });
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddAuthentication(opt =>
            {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

            }
            ).AddJwtBearer(option =>
            {
                option.RequireHttpsMetadata = false; //In Production (true) For more Secure
                option.SaveToken = true;
                option.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidIssuer = confegeration["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = confegeration["JWT:Audiences"],
                    ClockSkew = TimeSpan.Zero,// Ensure no time skew (tokens expire exactly on time)
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(confegeration["JWT:Key"]))

                };
            });
            // RabbitMQ
            //services.AddSingleton<TeacherConsumer>(); // For the First Solution For RabbitMq Consumer
            //services.AddHostedService<TeacherConsumerHostedService>();// For the Second Solution For RabbitMq Consumer
            //services.AddHostedService<StudentConsumerHostedService>();// For the Second Solution For RabbitMq Consumer
            //services.Configure<HostOptions>(opts =>
            //{
            //    // This makes your application continue running even if RabbitMQ connection fails
            //    opts.BackgroundServiceExceptionBehavior = BackgroundServiceExceptionBehavior.Ignore;
            //});


            // Add HttpClient for BackBlaze
            //services.AddHttpClient("BackblazeClient", client =>
            //{
            //    client.Timeout = TimeSpan.FromMinutes(30); // Set a longer timeout for large file uploads
            //});
            services.AddMemoryCache();
            services.AddSingleton(x =>
            {
                var config = x.GetRequiredService<IConfiguration>();
                return new BlobServiceClient(config["AzureStorage:ConnectionString"]);
            });

            services.Configure<AzureStorageSettings>(confegeration.GetSection("AzureStorage"));
            services.AddSingleton(x =>
            {
                var blobClientOptions = new BlobClientOptions
                {
                    Retry =
                    {
                        MaxRetries = 5,
                        Delay = TimeSpan.FromSeconds(3),
                        MaxDelay = TimeSpan.FromMinutes(5), // Increased max delay
                        NetworkTimeout = TimeSpan.FromMinutes(30), // Increased to 30 minutes
                        Mode = RetryMode.Exponential
                    },
                    Transport = new HttpClientTransport(new HttpClient(new HttpClientHandler
                    {
                        UseProxy = false,
                        MaxConnectionsPerServer = 50 // Increase connection pool for parallel uploads
                    })
                    {
                        Timeout = TimeSpan.FromMinutes(60) // Increased to 60 minutes
                    })
                };

                return new BlobServiceClient(confegeration["AzureStorage:ConnectionString"], blobClientOptions);
            });
            return services;
        }
    }
}
