using ApplicationContract.IStudent;
using Domain.Entities;
using Infrastructure.Presistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class StudentRepository : GenericRepository<Students>, IStudentRepository
    {
        private readonly PlatFormDbContext _dbContext;

        public StudentRepository(PlatFormDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<IEnumerable<Students>> GetAllStudentWithInclude()
         => await _dbContext.Students.AsNoTracking().Include(t => t.Teacher).ToListAsync();

    }
}
