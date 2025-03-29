using ApplicationContract.Generic;
using Infrastructure.Presistence;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repositories
{
    public class GenericRepository<T> : IGenericRepository<T> where T : class
    {
        private readonly PlatFormDbContext _dbContext;

        public GenericRepository(PlatFormDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task CreateAsync(T entity)
        {
            await _dbContext.AddAsync(entity);
            await _dbContext.SaveChangesAsync();
        }

        public async Task DeleteAsync(int ID)
        {
            var _old = await GetAsync(ID);
            _dbContext.Set<T>().Remove(_old);
            await _dbContext.SaveChangesAsync();
        }

        public async Task<bool> Exist(int ID)
        {
            var enity = await GetAsync(ID);
            return enity != null;
        }

        public async Task<IReadOnlyList<T>> GetAllAsync()
            => await _dbContext.Set<T>().AsNoTracking().ToListAsync();

        public async Task<T> GetAsync(int? ID)
            => await _dbContext.Set<T>().FindAsync(ID);

        public async Task UpdateAsync(T entity)
        {
            _dbContext.Entry(entity).State = EntityState.Modified;
            //var existingEntity = await _dbContext.Set<T>().FindAsync(GetPrimaryKey(entity));

            //if (existingEntity == null)
            //    throw new Exception("Entity not found");

           // _dbContext.Entry(existingEntity).CurrentValues.SetValues(entity);
            await _dbContext.SaveChangesAsync();
        }
    }
}
