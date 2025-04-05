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
    public class FileAnswersTypeConfiguration : IEntityTypeConfiguration<FileAnswers>
    {
        public void Configure(EntityTypeBuilder<FileAnswers> builder)
        {
            builder.HasKey( x => x.FileAnswersID);
            builder.HasIndex(f => f.AnswerName).IsUnique();
            builder.ToTable("FileAnswers", "Relation");
        }
    }
}
