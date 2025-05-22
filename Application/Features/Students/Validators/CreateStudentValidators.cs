using Application.Features.Students.Commands;
using FluentValidation;

namespace Application.Features.Students.Validators
{
    public class CreateStudentValidators : AbstractValidator<CreateStudentCommand>
    {
        public CreateStudentValidators()
        {

            //{PropertyName} =>mean getthe name of the property u focus on 
            RuleFor(n => n.Student.FirstName)
                .NotEmpty()
                .MinimumLength(3).WithMessage("For {PropertyName} At Least 3 Char")
                .MaximumLength(20).WithMessage("For {PropertyName} Max Char 20");

            RuleFor(n => n.Student.LastName)
                .NotEmpty()
                .MinimumLength(3).WithMessage("For {PropertyName} At Least 3 Char")
                .MaximumLength(20).WithMessage("For {PropertyName} Max Char 20");

            RuleFor(n => n.Student.Email)
               .NotEmpty().WithMessage("{PropertyName} is required")
               .EmailAddress().WithMessage("{PropertyName} must be a valid email address")
               .MaximumLength(100).WithMessage("{PropertyName} must not exceed 100 characters");

            RuleFor(n => n.Student.PhoneNumber)
            .NotEmpty().WithMessage("{PropertyName} is required")
            .Matches(@"^01[0-2,5]{1}[0-9]{8}$").WithMessage("{PropertyName} must be a valid phone number (e.g., +1234567890)")
            .Length(7, 15).WithMessage("{PropertyName} must be between 7 and 15 characters");

            //RuleFor(n => n.Student.Brief)
            //    .NotEmpty();

            //RuleFor(n => n.Student.StudySubject)
            //    .NotEmpty();

            //we need to descus ages of Teacher in our app
            //RuleFor(n => n.Student.Age)
            //        .InclusiveBetween(10, 25)
            //        .When(n => n.Student.Age != null)  // or n.Student.Age.HasValue if Age is nullable
            //        .WithMessage("{PropertyName} must be between 10 and 25 years old");
        }

    }
}
