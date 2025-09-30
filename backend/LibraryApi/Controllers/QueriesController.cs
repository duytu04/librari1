using LibraryApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous] // mở public cho tiện test
public class QueriesController(LibraryDbContext db) : ControllerBase
{
    // 1) Tìm tất cả sách của một Author (Where + Select)
    [HttpGet("books-by-author/{authorId:int}")]
    public async Task<IActionResult> BooksByAuthor(int authorId)
    {
        var books = await db.AuthorBooks
            .Where(ab => ab.AuthorId == authorId)
            .Select(ab => new { ab.Book.BookId, ab.Book.Title, ab.Book.PublishedYear })
            .Distinct()
            .ToListAsync();

        return Ok(books);
    }

    // 2) Liệt kê tất cả Author có trên 2 cuốn sách (GroupBy, Count)
    [HttpGet("authors-over-2-books")]
    public async Task<IActionResult> AuthorsOver2Books()
    {
        var q = await db.AuthorBooks
            .GroupBy(ab => new { ab.AuthorId, ab.Author.Name })
            .Select(g => new { g.Key.AuthorId, g.Key.Name, BookCount = g.Count() })
            .Where(x => x.BookCount > 2)
            .OrderByDescending(x => x.BookCount)
            .ToListAsync();

        return Ok(q);
    }

    // 3) Tìm các sách xuất bản sau năm N (Where) — mặc định sau 2015
    [HttpGet("books-after/{year:int?}")]
    public async Task<IActionResult> BooksAfter(int year = 2015)
    {
        var q = await db.Books
            .Where(b => (b.PublishedYear ?? int.MinValue) > year)
            .Select(b => new { b.BookId, b.Title, b.PublishedYear })
            .ToListAsync();

        return Ok(q);
    }

    // 4) Liệt kê các Publisher có ít nhất N cuốn sách — mặc định 3
    [HttpGet("publishers-min-books/{min:int?}")]
    public async Task<IActionResult> PublishersMinBooks(int min = 3)
    {
        var q = await db.Books
            .Where(b => b.PublisherId != null)
            .GroupBy(b => new { b.PublisherId, PublisherName = b.Publisher!.Name })
            .Select(g => new { g.Key.PublisherId, g.Key.PublisherName, BookCount = g.Count() })
            .Where(x => x.BookCount >= min)
            .OrderByDescending(x => x.BookCount)
            .ToListAsync();

        return Ok(q);
    }

    // 5) Join Author – Book – Publisher: Tên tác giả – Tên sách – Nhà xuất bản
    [HttpGet("author-book-publisher")]
    public async Task<IActionResult> AuthorBookPublisher()
    {
        var q = await (
            from ab in db.AuthorBooks
            join a in db.Authors on ab.AuthorId equals a.AuthorId
            join b in db.Books on ab.BookId equals b.BookId
            join p in db.Publishers on b.PublisherId equals p.PublisherId into pp
            from p in pp.DefaultIfEmpty()
            select new
            {
                Author = a.Name,
                Book = b.Title,
                Publisher = p != null ? p.Name : null
            })
            .OrderBy(r => r.Author).ThenBy(r => r.Book)
            .ToListAsync();

        return Ok(q);
    }
}
