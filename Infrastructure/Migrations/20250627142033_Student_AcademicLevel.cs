using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Student_AcademicLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AcademicLevelId",
                schema: "Relation",
                table: "Students",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Students_AcademicLevelId",
                schema: "Relation",
                table: "Students",
                column: "AcademicLevelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_AcademicLevels_AcademicLevelId",
                schema: "Relation",
                table: "Students",
                column: "AcademicLevelId",
                principalSchema: "Relation",
                principalTable: "AcademicLevels",
                principalColumn: "AcademicLevelID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_AcademicLevels_AcademicLevelId",
                schema: "Relation",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_AcademicLevelId",
                schema: "Relation",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "AcademicLevelId",
                schema: "Relation",
                table: "Students");
        }
    }
}
