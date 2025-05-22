using Application.Exceptions;
using Application.Features.Chaptes.validators;
using ApplicationContract.IChapter;
using ApplicationContract.Models;
using Mapster;
using MediatR;

namespace Application.Features.Chapters.Commands
{
    public record DeleteChapterCommand(int ChapterId) : IRequest<Unit>;

    public class DeleteChapterCommandHandler : IRequestHandler<DeleteChapterCommand, Unit>
    {
        private readonly IChapterRepository _repository;

        public DeleteChapterCommandHandler(IChapterRepository repository)
        {
            _repository = repository;
        }

        public async Task<Unit> Handle(DeleteChapterCommand request, CancellationToken cancellationToken)
        {
            var chapter = await _repository.GetAsync(request.ChapterId);
            if (chapter is null) throw new NotFoundException("Chapter not found");

            await _repository.DeleteAsync(request.ChapterId);
            return Unit.Value;
        }
    }
}

