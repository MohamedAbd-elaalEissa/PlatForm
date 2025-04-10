using ApplicationContract.ITeacher;
using ApplicationContract.Models;
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

        public async Task<TeacherStudentDTO> GetTeacherWithInclude(int teacherID)
       => await _dbContext.Teachers.AsNoTracking().Where(t => t.TeacherID == teacherID)
            .Select(t => new TeacherStudentDTO
            {
                TeacherID = t.TeacherID,
                Students = t.Student.Select(s => new StudentTeacherDto
                {
                    StudentID = s.StudentID,
                    Email = s.Email
                }).ToList()
            }).FirstOrDefaultAsync();
    }
}
