using Application.Exceptions;
using Application.Features.Chaptes.validators;
using ApplicationContract.IChapter;
using ApplicationContract.Models;
using Mapster;
using MediatR;

namespace Application.Features.Chapters.Commands
{

    public record CreateChapterCommand(ChapterDto chapter) : IRequest<Unit>;
    public class CreateChapterCommandHandler : IRequestHandler<CreateChapterCommand, Unit>
    {
        private readonly IChapterRepository _repository;

        public CreateChapterCommandHandler(IChapterRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(CreateChapterCommand request, CancellationToken cancellationToken)
        {

            var validator = new CreateChapterValidator();
            var validationResult = await validator.ValidateAsync(request);
            if (!validationResult.IsValid) throw new ValidaionException(validationResult);

            var newChapter = request.chapter.Adapt<Domain.Entities.Chapters>();
            await _repository.CreateAsync(newChapter);

            return Unit.Value;
        }
    }

}

