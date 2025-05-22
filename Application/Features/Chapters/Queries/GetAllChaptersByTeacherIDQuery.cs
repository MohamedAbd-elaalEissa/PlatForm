using ApplicationContract.IChapter;
using ApplicationContract.Models;
using Domain.Entities;
using MediatR;

namespace Application.Features.Chapters.Queries
{
    public record GetAllChaptersByTeacherIDQuery(ChapterDto filter) : IRequest<PaginatedResult<ChapterDto>>;

    public class GetAllChaptersByTeacherIDQueryHandler : IRequestHandler<GetAllChaptersByTeacherIDQuery, PaginatedResult<ChapterDto>>
    {
        private readonly IChapterRepository _repository;

        public GetAllChaptersByTeacherIDQueryHandler(IChapterRepository repository)
        {
            _repository = repository;
        }

        public async Task<PaginatedResult<ChapterDto>> Handle(GetAllChaptersByTeacherIDQuery request, CancellationToken cancellationToken)
        {
            return await _repository.GetChaptersAsync(request.filter);
        }
    }
}

