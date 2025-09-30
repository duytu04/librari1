namespace LibraryApi.Models;

public class Book
{
    public int BookId { get; set; }
    public string Title { get; set; } = null!;
    public int? PublishedYear { get; set; }

    public int? PublisherId { get; set; }
    public Publisher? Publisher { get; set; }

    public ICollection<AuthorBook> AuthorBooks { get; set; } = new List<AuthorBook>();
}
