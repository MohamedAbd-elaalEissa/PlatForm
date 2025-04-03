using Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Infrastructure.Migrations;

namespace Infrastructure.Config
{
    public class AcademicLevelTypeConfiguration : IEntityTypeConfiguration<AcademicLevels>
    {
        public void Configure(EntityTypeBuilder<AcademicLevels> builder)
        {
            builder.HasKey(c=>c.AcademicLevelID);
            builder.HasIndex(f => f.AcademicLevelName).IsUnique();
            builder.ToTable("AcademicLevels", "Relation");
        }
    }
}
