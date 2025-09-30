namespace LibraryApi.Models;

public class Author
{
    public int AuthorId { get; set; }
    public string Name { get; set; } = null!;
    public int? BirthYear { get; set; }

    public ICollection<AuthorBook> AuthorBooks { get; set; } = new List<AuthorBook>();
}
