using Domain.Entities;
using DomainShared.SharedData;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Infrastructure.Presistence
{
    public class PlatFormDbContext : DbContext
    {
        public PlatFormDbContext(DbContextOptions<PlatFormDbContext> options) : base(options)
        {

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
            base.OnModelCreating(modelBuilder);
        }
        public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var track in ChangeTracker.Entries<BaseEntity>())
            {
                if (track.State == EntityState.Added)
                {
                    track.Entity.CreateDate = DateTime.Now;

                }
                else if (track.State == EntityState.Modified)
                {
                    track.Entity.UpdateDate = DateTime.Now;
                }
            }
            return base.SaveChangesAsync(cancellationToken);
        }
        public DbSet<Teachers> Teachers { get; set; }
        public DbSet<Students> Students { get; set; }
        public DbSet<Files> Files { get; set; }
        public DbSet<Videos> Videos { get; set; }
    }
}
