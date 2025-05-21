using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Config
{
    public class ChapterTypeConfiguration : IEntityTypeConfiguration<Chapters>
    {
        public void Configure(EntityTypeBuilder<Chapters> builder)
        {
            builder.HasKey(c => c.ChapterID);

            builder.Property(c => c.ChapterName)
                .IsRequired()
                .HasMaxLength(20); 

            builder.HasOne(c => c.Teacher)
                .WithMany(t => t.Chapters)
                .HasForeignKey(c => c.TeacherId)
                .OnDelete(DeleteBehavior.Restrict); 

            builder.HasOne(c => c.AcademicLevel)
                .WithMany(a => a.Chapters)
                .HasForeignKey(c => c.AcademicLevelId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.ToTable("Chapters", "Relation");
        }
    }
}
