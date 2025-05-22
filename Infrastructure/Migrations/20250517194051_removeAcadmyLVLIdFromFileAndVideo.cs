using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class removeAcadmyLVLIdFromFileAndVideo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_AcademicLevels_AcademicLevelID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_AcademicLevels_AcademicLevelID",
                schema: "Relation",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Videos_AcademicLevelID",
                schema: "Relation",
                table: "Videos");

            migrationBuilder.DropIndex(
                name: "IX_Files_AcademicLevelID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropColumn(
                name: "AcademicLevelID",
                schema: "Relation",
                table: "Videos");

            migrationBuilder.DropColumn(
                name: "AcademicLevelID",
                schema: "Relation",
                table: "Files");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AcademicLevelID",
                schema: "Relation",
                table: "Videos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "AcademicLevelID",
                schema: "Relation",
                table: "Files",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Videos_AcademicLevelID",
                schema: "Relation",
                table: "Videos",
                column: "AcademicLevelID");

            migrationBuilder.CreateIndex(
                name: "IX_Files_AcademicLevelID",
                schema: "Relation",
                table: "Files",
                column: "AcademicLevelID");

            migrationBuilder.AddForeignKey(
                name: "FK_Files_AcademicLevels_AcademicLevelID",
                schema: "Relation",
                table: "Files",
                column: "AcademicLevelID",
                principalSchema: "Relation",
                principalTable: "AcademicLevels",
                principalColumn: "AcademicLevelID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Videos_AcademicLevels_AcademicLevelID",
                schema: "Relation",
                table: "Videos",
                column: "AcademicLevelID",
                principalSchema: "Relation",
                principalTable: "AcademicLevels",
                principalColumn: "AcademicLevelID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
