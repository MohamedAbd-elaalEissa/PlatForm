using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config
{
    public class StudentTypeConfiguration : IEntityTypeConfiguration<Students>
    {
        public void Configure(EntityTypeBuilder<Students> builder)
        {
            builder.HasMany(t => t.Teacher)
                .WithMany(s => s.Student);
            builder.HasKey(s => s.StudentID);
            builder.Property(s => s.Email).IsRequired();
            builder.Property(s => s.StudySubject).IsRequired();
            builder.Property(s => s.FirstName).IsRequired();
            builder.Property(s => s.LastName).IsRequired();
            builder.Property(s => s.PhoneNumber).IsRequired();
            builder.Property(s => s.Age).IsRequired();
            builder.ToTable("Students", "Relation");
        }
    }
}
