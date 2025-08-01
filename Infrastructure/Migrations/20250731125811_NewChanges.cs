using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class NewChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Brief",
                schema: "Relation",
                table: "Teachers",
                newName: "Education");

            migrationBuilder.AddColumn<int>(
                name: "NumOfExperience",
                schema: "Relation",
                table: "Teachers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumOfExperience",
                schema: "Relation",
                table: "Teachers");

            migrationBuilder.RenameColumn(
                name: "Education",
                schema: "Relation",
                table: "Teachers",
                newName: "Brief");
        }
    }
}
