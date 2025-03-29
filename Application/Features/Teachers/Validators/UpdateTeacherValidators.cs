using Application.Features.Teachers.Commands;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Teacher.Features.Teachers.Validators
{
    public class UpdateTeacherValidators : AbstractValidator<UpdateTeacherCommand>
    {
        public UpdateTeacherValidators()
        {
            //{PropertyName} =>mean getthe name of the property u focus on 
            RuleFor(n => n.Teacher.FirstName)
                .NotEmpty()
                .MinimumLength(3).WithMessage("For {PropertyName} At Least 3 Char")
                .MaximumLength(20).WithMessage("For {PropertyName} Max Char 20");

            RuleFor(n => n.Teacher.LastName)
                .NotEmpty()
                .MinimumLength(3).WithMessage("For {PropertyName} At Least 3 Char")
                .MaximumLength(20).WithMessage("For {PropertyName} Max Char 20");

            RuleFor(n => n.Teacher.Email)
            .NotEmpty().WithMessage("{PropertyName} is required")
            .EmailAddress().WithMessage("{PropertyName} must be a valid email address")
            .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters");

            RuleFor(n => n.Teacher.PhoneNumber)
            .NotEmpty().WithMessage("{PropertyName} is required")
            .Matches(@"^01[0-2,5]{1}[0-9]{8}$").WithMessage("{PropertyName} must be a valid phone number (e.g., +1234567890)")
            .Length(7, 15).WithMessage("{PropertyName} must be between 7 and 15 characters");

            RuleFor(n => n.Teacher.Brief)
                .NotEmpty();

            RuleFor(n => n.Teacher.StudySubject)
                .NotEmpty();

            RuleFor(n => n.Teacher.Age)
               .NotEmpty();
        }
    }
}
