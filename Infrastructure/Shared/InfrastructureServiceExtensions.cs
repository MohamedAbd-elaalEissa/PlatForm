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
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Http.Timeouts;
using Amazon.S3;
using Amazon;
using Amazon.Runtime;

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
            services.Configure<FormOptions>(options =>
            {
                options.ValueLengthLimit = int.MaxValue;
                options.MultipartBodyLengthLimit = 5L * 1024L * 1024L * 1024L; // 5 GB
                options.MultipartHeadersLengthLimit = int.MaxValue;
                options.BufferBody = false; // Don't buffer the entire body in memory
                options.BufferBodyLengthLimit = 1024 * 1024; // 1MB buffer
            });
            services.AddResponseCompression();
            services.AddHttpClient<IS3Service, S3Service>()
                .ConfigureHttpClient(client =>
                {
                    client.Timeout = TimeSpan.FromMinutes(60); // 60 minutes timeout
                });
            services.AddSingleton<IAmazonS3>(provider =>
            {
                var config = provider.GetRequiredService<IConfiguration>();
                var clientConfig = new AmazonS3Config
                {
                    RegionEndpoint = RegionEndpoint.GetBySystemName(config["AWS:Region"]),
                    Timeout = TimeSpan.FromMinutes(60), // 60 minutes timeout  
                    MaxErrorRetry = 3,
                    RetryMode = RequestRetryMode.Adaptive
                };

                return new AmazonS3Client(
                    config["AWS:AccessKey"],
                    config["AWS:SecretKey"],
                    clientConfig
                );
            });
            services.AddScoped<IS3Service, S3Service>();
            //services.AddDefaultAWSOptions(confegeration.GetAWSOptions());
            //services.AddAWSService<IAmazonS3>();

            services.AddRequestTimeouts(configure =>
            {
                configure.DefaultPolicy = new RequestTimeoutPolicy
                {
                    Timeout = TimeSpan.FromMinutes(45) // 45 minutes default timeout
                };

                configure.AddPolicy("FileUpload", TimeSpan.FromMinutes(60)); // 60 minutes for file uploads
            });

            return services;
        }
    }
}
