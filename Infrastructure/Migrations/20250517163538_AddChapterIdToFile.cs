using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChapterIdToFile : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ChaptersID",
                schema: "Relation",
                table: "Chapters",
                newName: "ChapterID");

            migrationBuilder.AddColumn<int>(
                name: "ChapterID",
                schema: "Relation",
                table: "Files",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Files_ChapterID",
                schema: "Relation",
                table: "Files",
                column: "ChapterID");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_Chapters_ChapterID",
                schema: "Relation",
                table: "Files",
                column: "ChapterID",
                principalSchema: "Relation",
                principalTable: "Chapters",
                principalColumn: "ChapterID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_Chapters_ChapterID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropIndex(
                name: "IX_Files_ChapterID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "ChapterID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.RenameColumn(
                name: "ChapterID",
                schema: "Relation",
                table: "Chapters",
                newName: "ChaptersID");
        }
    }
}
