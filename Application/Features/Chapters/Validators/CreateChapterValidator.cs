using Application.Features.Chapters.Commands;
using Application.Features.Files.Queries;
using FluentValidation;

namespace Application.Features.Chaptes.validators
 {
    public class CreateChapterValidator : AbstractValidator<CreateChapterCommand>
    {
        public CreateChapterValidator()
        {
            RuleFor(x => x.chapter.TeacherId)
                .NotNull().WithMessage("TeacherId is required")
                .GreaterThan(0).WithMessage("TeacherId Can't be 0");

            RuleFor(x => x.chapter.AcademicLevelId)
                .NotNull().WithMessage("AcademicLevelId is required")
                .GreaterThan(0).WithMessage("AcademicLevelId Can't be 0 ");

            RuleFor(x => x.chapter.ChapterName)
                .NotEmpty().WithMessage("Chapter name is required")
                .MaximumLength(100).WithMessage("Chapter name must be less than 100 characters");
        }
    }


}
