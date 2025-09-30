namespace LibraryApi.Dtos;
public record CreatePublisherDto(string Name, string? Country);
public record PublisherResponse(int PublisherId, string Name, string? Country);
