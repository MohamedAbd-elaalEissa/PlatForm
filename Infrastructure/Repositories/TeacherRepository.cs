using ApplicationContract.ITeacher;
using Domain.Entities;
using Infrastructure.Presistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class TeacherRepository : GenericRepository<Teachers>, ITeacherRepository
    {
        private readonly PlatFormDbContext _dbContext;

        public TeacherRepository(PlatFormDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Teachers>> GetAllTeacherWithInclude()
        => await _dbContext.Teachers.AsNoTracking().Include(t => t.Student).ToListAsync();
    }
}
