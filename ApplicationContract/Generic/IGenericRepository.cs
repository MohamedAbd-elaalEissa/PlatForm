using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApplicationContract.Generic
{
    public interface IGenericRepository<T> where T : class
    {
        Task<IReadOnlyList<T>> GetAllAsync();
        Task<T> GetAsync(int? ID);
        Task DeleteAsync(int ID);
        Task CreateAsync(T entity);
        Task UpdateAsync(T entity);
        Task<bool> Exist(int ID);
        //Task SaveChangesAsync();
    }
}
