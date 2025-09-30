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
public class PublishersController(LibraryDbContext db) : ControllerBase
{
    [HttpPost]
    public async Task<ActionResult<PublisherResponse>> Create(CreatePublisherDto dto)
    {
        var p = new Publisher { Name = dto.Name, Country = dto.Country };
        db.Publishers.Add(p);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById),
            new { id = p.PublisherId },
            new PublisherResponse(p.PublisherId, p.Name, p.Country));
    }

    [HttpGet("{id:int}")]
    [AllowAnonymous]
    public async Task<ActionResult<PublisherResponse>> GetById(int id)
    {
        var p = await db.Publishers.FindAsync(id);
        if (p is null) return NotFound();
        return new PublisherResponse(p.PublisherId, p.Name, p.Country);
    }

    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<PublisherResponse>>> List()
    {
        var items = await db.Publishers
            .Select(p => new PublisherResponse(p.PublisherId, p.Name, p.Country))
            .ToListAsync();
        return items;
    }
}
