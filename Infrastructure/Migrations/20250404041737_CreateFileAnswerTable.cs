using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CreateFileAnswerTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Files_AnswerName",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "AnswerName",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "StudentID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.CreateTable(
                name: "FileAnswers",
                schema: "Relation",
                columns: table => new
                {
                    FileAnswersID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnswerName = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    StudentID = table.Column<int>(type: "int", nullable: true),
                    FilesID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FileAnswers", x => x.FileAnswersID);
                    table.ForeignKey(
                        name: "FK_FileAnswers_Files_FilesID",
                        column: x => x.FilesID,
                        principalSchema: "Relation",
                        principalTable: "Files",
                        principalColumn: "FilesID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FileAnswers_AnswerName",
                schema: "Relation",
                table: "FileAnswers",
                column: "AnswerName",
                unique: true,
                filter: "[AnswerName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_FileAnswers_FilesID",
                schema: "Relation",
                table: "FileAnswers",
                column: "FilesID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FileAnswers",
                schema: "Relation");

            migrationBuilder.AddColumn<string>(
                name: "AnswerName",
                schema: "Relation",
                table: "Files",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "StudentID",
                schema: "Relation",
                table: "Files",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Files_AnswerName",
                schema: "Relation",
                table: "Files",
                column: "AnswerName",
                unique: true,
                filter: "[AnswerName] IS NOT NULL");
        }
    }
}
