using ApplicationContract.ITeacher;
using ApplicationContract.Models;
using Domain.Entities;
using Infrastructure.Presistence;
using Microsoft.EntityFrameworkCore;
using Polly;

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
        => await _dbContext.Teachers.AsNoTracking().Include(t => t.Student).Include(t=>t.Subject).ToListAsync();

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

        public async Task<Teachers> GetTeacherWithStudentsByEmailAsync(string email)
        {
            return await _dbContext.Teachers.FirstOrDefaultAsync(t => t.Email == email);
        }

        public async Task<IEnumerable<Subjects>> GetAllStudySubjectsAsync()
        {
            return await _dbContext.Subjects.ToListAsync(); 
        }
    }
}
