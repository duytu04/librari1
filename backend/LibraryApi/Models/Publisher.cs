namespace LibraryApi.Models;

public class Publisher
{
    public int PublisherId { get; set; }
    public string Name { get; set; } = null!;
    public string? Country { get; set; }

    public ICollection<Book> Books { get; set; } = new List<Book>();
}
