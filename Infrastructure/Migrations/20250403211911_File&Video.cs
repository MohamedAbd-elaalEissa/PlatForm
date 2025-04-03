using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FileVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                schema: "Relation",
                table: "Files",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "AnswerName",
                schema: "Relation",
                table: "Files",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAnswer",
                schema: "Relation",
                table: "Files",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "StudentID",
                schema: "Relation",
                table: "Files",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TaskName",
                schema: "Relation",
                table: "Files",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Videos",
                schema: "Relation",
                columns: table => new
                {
                    VideoID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<int>(type: "int", nullable: true),
                    VideoName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TeacherID = table.Column<int>(type: "int", nullable: false),
                    CreateBy = table.Column<int>(type: "int", nullable: false),
                    UpdateBy = table.Column<int>(type: "int", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Videos", x => x.VideoID);
                    table.ForeignKey(
                        name: "FK_Videos_Teachers_TeacherID",
                        column: x => x.TeacherID,
                        principalSchema: "Relation",
                        principalTable: "Teachers",
                        principalColumn: "TeacherID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Files_AnswerName",
                schema: "Relation",
                table: "Files",
                column: "AnswerName",
                unique: true,
                filter: "[AnswerName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Files_FileName",
                schema: "Relation",
                table: "Files",
                column: "FileName",
                unique: true,
                filter: "[FileName] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Videos_TeacherID",
                schema: "Relation",
                table: "Videos",
                column: "TeacherID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Videos",
                schema: "Relation");

            migrationBuilder.DropIndex(
                name: "IX_Files_AnswerName",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropIndex(
                name: "IX_Files_FileName",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "AnswerName",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "IsAnswer",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "StudentID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "TaskName",
                schema: "Relation",
                table: "Files");

            migrationBuilder.AlterColumn<string>(
                name: "FileName",
                schema: "Relation",
                table: "Files",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);
        }
    }
}
