using ApplicationContract.Generic;
using ApplicationContract.Models;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.ITeacher
{
    public interface ITeacherRepository:IGenericRepository<Teachers>
    {
        Task<IEnumerable<Teachers>> GetAllTeacherWithInclude();
        Task<TeacherStudentDTO> GetTeacherWithInclude(int teacherID);

    }
}
