using ApplicationContract.Generic;
using Infrastructure.Presistence;
using Infrastructure.Repositories;
using Infrastructure.Repositories.RabbitMQ;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Shared
{
    public static class InfrastructureServiceExtensions
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services,IConfiguration confegeration)
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
            //services.AddSingleton<TeacherConsumer>(); // For the First Solution For RabbitMq Consumer
            //services.AddHostedService<TeacherConsumerHostedService>();// For the Second Solution For RabbitMq Consumer
            //services.AddHostedService<StudentConsumerHostedService>();// For the Second Solution For RabbitMq Consumer
            return services;
        }
    }
}
