using ApplicationContract.Generic;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.IStudent
{
    public interface IStudentRepository:IGenericRepository<Students>
    {
        Task<IEnumerable<Students>> GetAllStudentWithInclude();
        Task<Students> GetStudentWithEmail(string email);
    }
}
