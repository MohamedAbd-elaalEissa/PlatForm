using Domain.Entities;
using Infrastructure.Presistence;
using ApplicationContract.Models;
using Microsoft.EntityFrameworkCore;

using Infrastructure.Repositories;
using ApplicationContract.IChapter;

public class ChapterRepository : GenericRepository<Chapters>, IChapterRepository
{
    private readonly PlatFormDbContext _dbContext;

    public ChapterRepository(PlatFormDbContext dbContext) : base(dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<PaginatedResult<ChapterDto>> GetChaptersAsync(ChapterDto filter)
    {
        var query = _dbContext.Chapters
       .AsNoTracking()
       .Include(c => c.AcademicLevel)
       .Where(c => c.TeacherId == filter.TeacherId);

        if (filter.AcademicLevelId.HasValue)
            query = query.Where(c => c.AcademicLevelId == filter.AcademicLevelId.Value);

        if (!string.IsNullOrWhiteSpace(filter.ChapterName))
            query = query.Where(c => c.ChapterName.Contains(filter.ChapterName));

        query = query.OrderBy(c => c.ChapterName);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((filter.PageNumber - 1) * filter.PageSize)
            .Take(filter.PageSize)
            .Select(c => new ChapterDto
            {
                ChapterID = c.ChapterID,
                ChapterName = c.ChapterName,
                AcademicLevelId = c.AcademicLevelId,
                AcademicLevelName = c.AcademicLevel.AcademicLevelName,
                TeacherId = c.TeacherId
            })
            .ToListAsync();

        return new PaginatedResult<ChapterDto>
        {
            Items = items,
            TotalCount = totalCount,
            PageNumber = filter.PageNumber,
            PageSize = filter.PageSize
        };
    }

}
