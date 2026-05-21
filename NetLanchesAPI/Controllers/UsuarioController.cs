using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetLanchesAPI.Constants;
using NetLanchesAPI.DTOs.Auth;
using NetLanchesAPI.DTOs.Usuario;
using NetLanchesAPI.Models.Enums;
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

    // =========================
    // GET
    // =========================

    /// <summary>
    /// Lista todos os clientes cadastrados.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpGet("clientes")]
    public async Task<IActionResult> ListarClientes()
    {
        var usuarios =
            await _usuarioService
                .GetByPerfilAsync(
                    PerfilUsuario.CLIENTE
                );

        return Ok(usuarios);
    }

    /// <summary>
    /// Lista todos os administradores cadastrados.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpGet("adms")]
    public async Task<IActionResult> ListarAdms()
    {
        var usuarios =
            await _usuarioService
                .GetByPerfilAsync(
                    PerfilUsuario.ADM
                );

        return Ok(usuarios);
    }

    /// <summary>
    /// Lista todos os funcionários cadastrados.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpGet("funcionarios")]
    public async Task<IActionResult> ListarFuncionarios()
    {
        var usuarios =
            await _usuarioService
                .GetByPerfilAsync(
                    PerfilUsuario.FUNCIONARIO
                );

        return Ok(usuarios);
    }

    /// <summary>
    /// Seleciona um usuário específico pelo ID.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var usuario =
            await _usuarioService
                .GetByIdAsync(id);

        if (usuario == null)
            return NotFound(
                "Usuário não encontrado."
            );

        return Ok(usuario);
    }

    // =========================
    // POST
    // =========================

    /// <summary>
    /// Cria um novo administrador.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpPost("adm")]
    public async Task<IActionResult>
    CriarAdm(RegistroDTO dto)
    {
        var resultado =
            await _usuarioService
                .CriarUsuarioAsync(
                    dto,
                    PerfilUsuario.ADM
                );

        if (!resultado.Sucesso)
            return Conflict(
                resultado.Mensagem
            );

        return Ok(
            resultado.Mensagem
        );
    }

    /// <summary>
    /// Cria um novo funcionário.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpPost("funcionario")]
    public async Task<IActionResult>
    CriarFuncionario(RegistroDTO dto)
    {
        var resultado =
            await _usuarioService
                .CriarUsuarioAsync(
                    dto,
                    PerfilUsuario.FUNCIONARIO
                );

        if (!resultado.Sucesso)
            return Conflict(
                resultado.Mensagem
            );

        return Ok(
            resultado.Mensagem
        );
    }

    // =========================
    // PUT
    // =========================

    /// <summary>
    /// Edita um usuário.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpPut("{id}")]
    public async Task<IActionResult>
    EditarUsuario(
        int id,
        EditarUsuarioDTO dto
    )
    {
        var resultado =
            await _usuarioService
                .EditarUsuarioAsync(id, dto);

        if (!resultado.Sucesso)
            return BadRequest(resultado.Mensagem);

        return Ok(resultado.Mensagem);
    }

    // =========================
    // DELETE
    // =========================

    /// <summary>
    /// Deleta um usuário específico pelo ID.
    /// </summary>
    [Authorize(Roles = Roles.SUPERADM)]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool removido =
            await _usuarioService
                .DeleteAsync(id);

        if (!removido)
            return NotFound(
                "Usuário não encontrado."
            );

        return NoContent();
    }
}