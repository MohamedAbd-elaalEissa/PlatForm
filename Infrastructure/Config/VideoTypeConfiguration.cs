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
    public class VideoTypeConfiguration : IEntityTypeConfiguration<Videos>
    {
        public void Configure(EntityTypeBuilder<Videos> builder)
        {
            builder.ToTable("Videos", "Relation");
        }
    }
}
