using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace Angular5Core2.Models
{
    public partial class DBEntities : DbContext
    {
        public virtual DbSet<TblConfigObject> TblConfigObject { get; set; }
        public virtual DbSet<TblConfigObjectConnections> TblConfigObjectConnections { get; set; }
        public virtual DbSet<TblSchematicPipeNodes> TblSchematicPipeNodes { get; set; }
        

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer(@"Server = tcp:azureprototypeserver.database.windows.net, 1433; Initial Catalog = azureTestDB; Persist Security Info = False; User ID = jhertel; Password = ThisIs1Password; MultipleActiveResultSets = False; Encrypt = True; TrustServerCertificate = False; Connection Timeout = 30; ");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TblConfigObject>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.LeftAssetFk)
                    .HasColumnName("left_asset_fk")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasColumnName("name")
                    .HasMaxLength(128);

                entity.Property(e => e.Scale)
                    .HasColumnName("scale")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Type)
                    .HasColumnName("type")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.X)
                    .HasColumnName("x")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Y)
                    .HasColumnName("y")
                    .HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<TblConfigObjectConnections>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Direction)
                    .HasColumnName("direction")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.LeftObjectFk)
                    .HasColumnName("leftObject_fk")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.RightObjectFk)
                    .HasColumnName("rightObject_fk")
                    .HasDefaultValueSql("((0))");
            });

            modelBuilder.Entity<TblSchematicPipeNodes>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.Nodeindex)
                    .HasColumnName("nodeindex")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.PipeFk)
                    .HasColumnName("pipe_fk")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.X)
                    .HasColumnName("x")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Y)
                    .HasColumnName("y")
                    .HasDefaultValueSql("((0))");
            });

            
        }
    }
}
