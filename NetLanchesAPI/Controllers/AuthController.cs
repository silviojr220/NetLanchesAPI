using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetLanchesAPI.Constants;
using NetLanchesAPI.DTOs.Auth;
using NetLanchesAPI.Services.Interfaces;


namespace NetLanchesAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    /// <summary>
    /// Registra os usuários.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("registro")]
    public async Task<IActionResult> Registro(RegistroDTO dto)
    {
        var resultado = await _authService
            .RegistroAsync(dto);

        if (!resultado.Sucesso)
            return BadRequest(resultado.Mensagem);

        return Ok(resultado.Mensagem);
    }

    /// <summary>
    /// Faz login dos usuários.
    /// </summary>
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDTO dto)
    {
        var resultado = await _authService
            .LoginAsync(dto);

        if (!resultado.Sucesso)
            return Unauthorized(
                "Email ou senha inválidos."
            );

        return Ok(resultado.Dados);
    }
}