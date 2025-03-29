using ApplicationContract.Generic;
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

    }
}
