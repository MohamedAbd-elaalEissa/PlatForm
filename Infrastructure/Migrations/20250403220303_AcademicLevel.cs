using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AcademicLevel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "AcademicLevels",
                schema: "Relation",
                columns: table => new
                {
                    AcademicLevelID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AcademicLevelName = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    ParentID = table.Column<int>(type: "int", nullable: true),
                    CreateBy = table.Column<int>(type: "int", nullable: false),
                    UpdateBy = table.Column<int>(type: "int", nullable: true),
                    CreateDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AcademicLevels", x => x.AcademicLevelID);
                });

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

            migrationBuilder.CreateIndex(
                name: "IX_AcademicLevels_AcademicLevelName",
                schema: "Relation",
                table: "AcademicLevels",
                column: "AcademicLevelName",
                unique: true,
                filter: "[AcademicLevelName] IS NOT NULL");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Files_AcademicLevels_AcademicLevelID",
                schema: "Relation",
                table: "Files");

            migrationBuilder.DropForeignKey(
                name: "FK_Videos_AcademicLevels_AcademicLevelID",
                schema: "Relation",
                table: "Videos");

            migrationBuilder.DropTable(
                name: "AcademicLevels",
                schema: "Relation");

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
    }
}
