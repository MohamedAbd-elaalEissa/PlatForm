using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SubjectLookUp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "StudySubject",
                schema: "Relation",
                table: "Teachers");

            migrationBuilder.DropColumn(
                name: "StudySubject",
                schema: "Relation",
                table: "Students");

            migrationBuilder.AddColumn<int>(
                name: "SubjectId",
                schema: "Relation",
                table: "Teachers",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    SubjectId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Subject = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreateBy = table.Column<int>(type: "int", nullable: false),
                    UpdateBy = table.Column<int>(type: "int", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.SubjectId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Teachers_SubjectId",
                schema: "Relation",
                table: "Teachers",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_FileAnswers_StudentID",
                schema: "Relation",
                table: "FileAnswers",
                column: "StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_FileAnswers_Students_StudentID",
                schema: "Relation",
                table: "FileAnswers",
                column: "StudentID",
                principalSchema: "Relation",
                principalTable: "Students",
                principalColumn: "StudentID");

            migrationBuilder.AddForeignKey(
                name: "FK_Teachers_Subjects_SubjectId",
                schema: "Relation",
                table: "Teachers",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_FileAnswers_Students_StudentID",
                schema: "Relation",
                table: "FileAnswers");

            migrationBuilder.DropForeignKey(
                name: "FK_Teachers_Subjects_SubjectId",
                schema: "Relation",
                table: "Teachers");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_Teachers_SubjectId",
                schema: "Relation",
                table: "Teachers");

            migrationBuilder.DropIndex(
                name: "IX_FileAnswers_StudentID",
                schema: "Relation",
                table: "FileAnswers");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                schema: "Relation",
                table: "Teachers");

            migrationBuilder.AddColumn<string>(
                name: "StudySubject",
                schema: "Relation",
                table: "Teachers",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StudySubject",
                schema: "Relation",
                table: "Students",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
