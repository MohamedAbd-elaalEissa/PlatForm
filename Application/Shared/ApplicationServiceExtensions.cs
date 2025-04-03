using Application.Features.Files.Queries;
using ApplicationContract.IFiles;
using ApplicationContract.IStudent;
using ApplicationContract.ITeacher;
using FluentValidation;
using Infrastructure.Repositories;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Application.Shared
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            // Register MediatR from the Application layer assembly
            services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()));
            // Register FluentValidation validators from the Application layer assembly
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            // Register the validation pipeline behavior
            services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));
            services.AddScoped<ITeacherRepository, TeacherRepository>();
            services.AddScoped<IStudentRepository, StudentRepository>();
            services.AddScoped<IFilesRepository, FilesRepository>();
            return services;
        }
    }
}