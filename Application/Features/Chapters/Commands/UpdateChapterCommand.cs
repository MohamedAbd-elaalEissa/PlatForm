using Application.Exceptions;
using Application.Features.Chaptes.validators;
using ApplicationContract.IChapter;
using ApplicationContract.Models;
using Mapster;
using MediatR;

namespace Application.Features.Chapters.Commands
{
    public record UpdateChapterCommand(ChapterUpdateDTO Chapter) : IRequest<Unit>;

    public class UpdateChapterCommandHandler : IRequestHandler<UpdateChapterCommand, Unit>
    {
        private readonly IChapterRepository _repository;

        public UpdateChapterCommandHandler(IChapterRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(UpdateChapterCommand request, CancellationToken cancellationToken)
        {
            var validator = new UpdateChapterValidator(); 
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid) throw new ValidaionException(validationResult);

            var existingChapter = await _repository.GetAsync(request.Chapter.ChapterID);
            if (existingChapter is null) throw new NotFoundException("Chapter not found");

            var teacher = request.Chapter.Adapt(existingChapter);
            await _repository.UpdateAsync(teacher);
            return Unit.Value;
        }
    }
}
