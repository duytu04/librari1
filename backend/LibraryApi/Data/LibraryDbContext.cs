using LibraryApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Data;

public class LibraryDbContext : DbContext
{
    public LibraryDbContext(DbContextOptions<LibraryDbContext> options) : base(options) {}

    public DbSet<Author> Authors => Set<Author>();
    public DbSet<Book> Books => Set<Book>();
    public DbSet<Publisher> Publishers => Set<Publisher>();
    public DbSet<AuthorBook> AuthorBooks => Set<AuthorBook>();
    public DbSet<AppUser> Users => Set<AppUser>();

    protected override void OnModelCreating(ModelBuilder mb)
    {
        // Bảng nối N-N
        mb.Entity<AuthorBook>().HasKey(x => new { x.AuthorId, x.BookId });

        mb.Entity<AuthorBook>()
          .HasOne(x => x.Author)
          .WithMany(a => a.AuthorBooks)
          .HasForeignKey(x => x.AuthorId);

        mb.Entity<AuthorBook>()
          .HasOne(x => x.Book)
          .WithMany(b => b.AuthorBooks)
          .HasForeignKey(x => x.BookId);

        // Publisher 1 - N Book, khi xóa publisher thì set null ở Book
        mb.Entity<Book>()
          .HasOne(b => b.Publisher)
          .WithMany(p => p.Books)
          .HasForeignKey(b => b.PublisherId)
          .OnDelete(DeleteBehavior.SetNull);
    }
}
