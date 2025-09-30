namespace LibraryApi.Dtos;
public record CreateAuthorDto(string Name, int? BirthYear);
public record AuthorResponse(int AuthorId, string Name, int? BirthYear);
