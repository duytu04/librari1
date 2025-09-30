namespace LibraryApi.Dtos;
public record CreateBookDto(string Title, int? PublishedYear);
public record AssignAuthorDto(int BookId, int AuthorId);
public record AssignPublisherDto(int BookId, int PublisherId);
public record BookResponse(int BookId, string Title, int? PublishedYear,
                           string? PublisherName, IEnumerable<string> Authors);
