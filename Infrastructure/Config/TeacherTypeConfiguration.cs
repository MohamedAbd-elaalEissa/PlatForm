using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Config
{
    public class TeacherTypeConfiguration : IEntityTypeConfiguration<Teachers>
    {
        public void Configure(EntityTypeBuilder<Teachers> builder)
        {
            builder.HasMany(t => t.Student)
                .WithMany(s => s.Teacher);
            builder.HasKey(t => t.TeacherID);
            builder.Property(t => t.Email).IsRequired();
            //builder.Property(t => t.StudySubject).IsRequired();
            builder.Property(t => t.FirstName).IsRequired();
            //builder.Property(t => t.LastName).IsRequired();
            builder.Property(t => t.PhoneNumber).IsRequired();
            //builder.Property(t => t.Age).IsRequired();
            builder.ToTable("Teachers", "Relation");
        }
    }
}
