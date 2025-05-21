using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChaptersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Chapters",
                schema: "Relation",
                columns: table => new
                {
                    ChaptersID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChapterName = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TeacherId = table.Column<int>(type: "int", nullable: false),
                    AcademicLevelId = table.Column<int>(type: "int", nullable: false),
                    CreateBy = table.Column<int>(type: "int", nullable: false),
                    UpdateBy = table.Column<int>(type: "int", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Chapters", x => x.ChaptersID);
                    table.ForeignKey(
                        name: "FK_Chapters_AcademicLevels_AcademicLevelId",
                        column: x => x.AcademicLevelId,
                        principalSchema: "Relation",
                        principalTable: "AcademicLevels",
                        principalColumn: "AcademicLevelID",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Chapters_Teachers_TeacherId",
                        column: x => x.TeacherId,
                        principalSchema: "Relation",
                        principalTable: "Teachers",
                        principalColumn: "TeacherID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Chapters_AcademicLevelId",
                schema: "Relation",
                table: "Chapters",
                column: "AcademicLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_Chapters_TeacherId",
                schema: "Relation",
                table: "Chapters",
                column: "TeacherId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Chapters",
                schema: "Relation");
        }
    }
}
