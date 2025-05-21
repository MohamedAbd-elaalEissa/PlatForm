using Application.Features.Chapters.Commands;
using Application.Features.Files.Queries;
using FluentValidation;

public class UpdateChapterValidator : AbstractValidator<UpdateChapterCommand>
{
    public UpdateChapterValidator()
    {
        RuleFor(x => x.Chapter.ChapterID)
            .GreaterThan(0).WithMessage("ChaptersID must be Exist");

        RuleFor(x => x.Chapter.ChapterName)
            .NotEmpty().WithMessage("Chapter name is required")
            .MaximumLength(100).WithMessage("Chapter name must be less than 100 characters");

        RuleFor(x => x.Chapter.TeacherId)
            .GreaterThan(0).WithMessage("TeacherId is required and must be valid");

        RuleFor(x => x.Chapter.AcademicLevelId)
            .NotNull().WithMessage("AcademicLevelId is required");
    }
}
