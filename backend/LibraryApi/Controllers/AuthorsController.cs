using LibraryApi.Data;
using LibraryApi.Dtos;
using LibraryApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // bảo vệ bằng JWT
public class AuthorsController(LibraryDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<AuthorResponse>> Create(CreateAuthorDto dto)
    {
        var entity = new Author { Name = dto.Name, BirthYear = dto.BirthYear };
        db.Authors.Add(entity);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById),
            new { id = entity.AuthorId },
            new AuthorResponse(entity.AuthorId, entity.Name, entity.BirthYear));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous] // xem công khai cho tiện test
    public async Task<ActionResult<AuthorResponse>> GetById(int id)
    {
        var a = await db.Authors.FindAsync(id);
        if (a is null) return NotFound();
        return new AuthorResponse(a.AuthorId, a.Name, a.BirthYear);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<AuthorResponse>>> List()
    {
        var items = await db.Authors
            .Select(a => new AuthorResponse(a.AuthorId, a.Name, a.BirthYear))
            .ToListAsync();
        return items;
    }
}
