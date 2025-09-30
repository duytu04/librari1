namespace LibraryApi.Models;

public class AuthorBook
{
    public int AuthorId { get; set; }
    public Author Author { get; set; } = null!;
    public int BookId { get; set; }
    public Book Book { get; set; } = null!;
}
