using Microsoft.AspNetCore.Mvc;

namespace LibraryApi.Controllers;

[ApiController]
[Route("")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Root() => Ok(new { ok = true, service = "LibraryApi" });

    [HttpGet("api/health")]
    public IActionResult Health() => Ok(new { status = "healthy" });
}
