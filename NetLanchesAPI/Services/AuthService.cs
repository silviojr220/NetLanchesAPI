using Microsoft.EntityFrameworkCore;
using NetLanchesAPI.Data;
using NetLanchesAPI.DTOs.Auth;
using NetLanchesAPI.Models;
using NetLanchesAPI.Services.Interfaces;
using NetLanchesAPI.Models.Enums;

namespace NetLanchesAPI.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IJwtService _jwtService;

    public AuthService(
        AppDbContext context,
        IJwtService jwtService
    )
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<(bool Sucesso, string Mensagem)>
        RegistroAsync(RegistroDTO dto)
    {
        bool emailExiste = await _context.Usuarios
            .AnyAsync(u => u.Email == dto.Email);

        if (emailExiste)
        {
            return (
                false,
                "Email já cadastrado."
            );
        }

        string senhaHash =
            BCrypt.Net.BCrypt.HashPassword(dto.Senha);

        Usuario usuario = new Usuario
        {
            Email = dto.Email,
            SenhaHash = senhaHash,
            Perfil = PerfilUsuario.CLIENTE,
            Telefone = dto.Telefone
        };

        _context.Usuarios.Add(usuario);

        await _context.SaveChangesAsync();

        return (
            true,
            "Usuário cadastrado com sucesso."
        );
    }

    public async Task<(bool Sucesso, object? Dados)>
        LoginAsync(LoginDTO dto)
    {
        var usuario = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (usuario == null)
        {
            return (
                false,
                null
            );
        }

        bool senhaValida =
            BCrypt.Net.BCrypt.Verify(
                dto.Senha,
                usuario.SenhaHash
            );

        if (!senhaValida)
        {
            return (
                false,
                null
            );
        }

        string token =
            _jwtService.GerarToken(usuario);

        return (
            true,
            new
            {
                mensagem = "Login realizado com sucesso.",
                token,
                usuario.Email,
                usuario.Perfil
            }
        );
    }
}