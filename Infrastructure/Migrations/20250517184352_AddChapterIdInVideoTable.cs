using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddChapterIdInVideoTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ChapterID",
                schema: "Relation",
                table: "Videos",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Videos_ChapterID",
                schema: "Relation",
                table: "Videos",
                column: "ChapterID");

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_Chapters_ChapterID",
                schema: "Relation",
                table: "Videos",
                column: "ChapterID",
                principalSchema: "Relation",
                principalTable: "Chapters",
                principalColumn: "ChapterID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Videos_Chapters_ChapterID",
                schema: "Relation",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_ChapterID",
                schema: "Relation",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "ChapterID",
                schema: "Relation",
                table: "Videos");
        }
    }
}
