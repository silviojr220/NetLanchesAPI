using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetLanchesAPI.Constants;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuarioController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Lista todos os usuários cadastrados.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM}")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var usuarios = await _usuarioService.GetAllAsync();

        return Ok(usuarios);
    }

    /// <summary>
    /// Seleciona um usuário específico pelo ID.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM}")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var usuario = await _usuarioService.GetByIdAsync(id);

        if (usuario == null)
            return NotFound("Usuário não encontrado.");

        return Ok(usuario);
    }

    /// <summary>
    /// Deleta um usuário específico pelo ID.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM}")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool removido = await _usuarioService.DeleteAsync(id);

        if (!removido)
            return NotFound("Usuário não encontrado.");

        return NoContent();
    }
}