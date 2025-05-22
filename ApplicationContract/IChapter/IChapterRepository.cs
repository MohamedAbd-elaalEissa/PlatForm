using ApplicationContract.Generic;
using ApplicationContract.Models;
using Domain.Entities;

namespace ApplicationContract.IChapter
{
    public interface IChapterRepository : IGenericRepository<Chapters>
    {
        Task<PaginatedResult<ChapterDto>> GetChaptersAsync(ChapterDto filter);
    }
}
