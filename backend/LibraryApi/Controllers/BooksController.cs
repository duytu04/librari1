using LibraryApi.Data;
using LibraryApi.Dtos;
using LibraryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BooksController(LibraryDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<BookResponse>> Create(CreateBookDto dto)
    {
        var b = new Book { Title = dto.Title, PublishedYear = dto.PublishedYear };
        db.Books.Add(b);
        await db.SaveChangesAsync();
        return await GetById(b.BookId);
    }

    [HttpPost("assign-author")]
    public async Task<IActionResult> AssignAuthor(AssignAuthorDto dto)
    {
        var book = await db.Books.FindAsync(dto.BookId);
        var author = await db.Authors.FindAsync(dto.AuthorId);
        if (book is null || author is null) return NotFound("Book/Author not found");
        var exists = await db.AuthorBooks.AnyAsync(x => x.BookId == dto.BookId && x.AuthorId == dto.AuthorId);
        if (!exists)
        {
            db.AuthorBooks.Add(new AuthorBook { BookId = dto.BookId, AuthorId = dto.AuthorId });
            await db.SaveChangesAsync();
        }
        return NoContent();
    }

    [HttpPost("assign-publisher")]
    public async Task<IActionResult> AssignPublisher(AssignPublisherDto dto)
    {
        var book = await db.Books.FindAsync(dto.BookId);
        if (book is null) return NotFound("Book not found");
        var pub = await db.Publishers.FindAsync(dto.PublisherId);
        if (pub is null) return NotFound("Publisher not found");
        book.PublisherId = pub.PublisherId;
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<BookResponse>> GetById(int id)
    {
        var q = await db.Books
            .Where(b => b.BookId == id)
            .Select(b => new BookResponse(
                b.BookId,
                b.Title,
                b.PublishedYear,
                b.Publisher != null ? b.Publisher.Name : null,
                b.AuthorBooks.Select(ab => ab.Author.Name)))
            .FirstOrDefaultAsync();

        return q is null ? NotFound() : q;
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<BookResponse>>> List()
    {
        var list = await db.Books
            .OrderBy(b => b.BookId)
            .Select(b => new BookResponse(
                b.BookId,
                b.Title,
                b.PublishedYear,
                b.Publisher != null ? b.Publisher.Name : null,
                b.AuthorBooks.Select(ab => ab.Author.Name)))
            .ToListAsync();

        return list;
    }
}
