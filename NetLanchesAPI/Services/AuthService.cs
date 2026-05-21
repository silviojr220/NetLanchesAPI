using NetLanchesAPI.DTOs.Auth;
using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;
using NetLanchesAPI.Repositories.Interfaces;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Services;

public class AuthService : IAuthService
{
    private readonly IUsuarioRepository _usuarioRepository;

    private readonly IJwtService _jwtService;

    public AuthService(
        IUsuarioRepository usuarioRepository,
        IJwtService jwtService
    )
    {
        _usuarioRepository = usuarioRepository;

        _jwtService = jwtService;
    }

    public async Task<
        (bool Sucesso, string Mensagem)
    > RegistroAsync(RegistroDTO dto)
    {
        bool emailExiste =
            await _usuarioRepository
                .EmailExistsAsync(dto.Email);

        if (emailExiste)
        {
            return (
                false,
                "Email já cadastrado."
            );
        }

        Usuario usuario = new Usuario
        {
            Email = dto.Email,

            SenhaHash =
                BCrypt.Net.BCrypt.HashPassword(dto.Senha),

            Perfil = PerfilUsuario.CLIENTE,

            Telefone = dto.Telefone
        };

        await _usuarioRepository
            .AddAsync(usuario);

        return (
            true,
            "Usuário cadastrado com sucesso."
        );
    }

    public async Task<
        (bool Sucesso, object? Dados)
    > LoginAsync(LoginDTO dto)
    {
        var usuario =
            await _usuarioRepository
                .GetByEmailAsync(dto.Email);

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
                mensagem =
                    "Login realizado com sucesso.",

                token,

                usuario.Email,

                usuario.Perfil
            }
        );
    }
}