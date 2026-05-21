using NetLanchesAPI.DTOs.Auth;
using NetLanchesAPI.DTOs.Usuario;
using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;
using NetLanchesAPI.Repositories.Interfaces;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;

    public UsuarioService(
        IUsuarioRepository usuarioRepository
    )
    {
        _usuarioRepository = usuarioRepository;
    }

    public async Task<List<UsuarioDTO>> GetAllAsync()
    {
        var usuarios =
            await _usuarioRepository.GetAllAsync();

        return usuarios.Select(u => new UsuarioDTO
        {
            Id = u.Id,
            Email = u.Email,
            Perfil = u.Perfil,
            Telefone = u.Telefone
        }).ToList();
    }

    public async Task<
(bool Sucesso, string Mensagem)
> DeleteByPerfilAsync(
    int id,
    PerfilUsuario perfil
)
    {
        var usuario =
            await _usuarioRepository
                .GetByIdAndPerfilAsync(
                    id,
                    perfil
                );

        if (usuario == null)
        {
            return (
                false,
                "Usuário não encontrado."
            );
        }

        await _usuarioRepository
            .DeleteAsync(usuario.Id);



        await _usuarioRepository.DeleteAsync(id);
        return (
            true,
            "Usuário removido com sucesso."
        );


    }

    public async Task<UsuarioDTO?> GetByIdAsync(int id)
    {
        var usuario =
            await _usuarioRepository.GetByIdAsync(id);

        if (usuario == null)
            return null;

        return new UsuarioDTO
        {
            Id = usuario.Id,
            Email = usuario.Email,
            Perfil = usuario.Perfil,
            Telefone = usuario.Telefone
        };
    }

    public async Task<
(bool Sucesso, string Mensagem)
> EditarUsuarioAsync(
    int id,
    PerfilUsuario perfil,
    EditarUsuarioDTO dto
)
    {
        var usuario =
            await _usuarioRepository
                .GetByIdAndPerfilAsync(
                    id,
                    perfil
                );

        if (usuario == null)
        {
            return (
                false,
                "Usuário não encontrado."
            );
        }

        bool emailEmUso =
            await _usuarioRepository
                .EmailExistsAsync(dto.Email);

        if (
            emailEmUso &&
            usuario.Email != dto.Email
        )
        {
            return (
                false,
                "Email já está em uso."
            );
        }

        usuario.Email = dto.Email;

        usuario.Telefone = dto.Telefone;

        await _usuarioRepository
            .UpdateAsync(usuario);

        return (
            true,
            "Usuário atualizado com sucesso."
        );
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _usuarioRepository
            .DeleteAsync(id);
    }

    public async Task<List<UsuarioDTO>>
GetByPerfilAsync(PerfilUsuario perfil)
    {
        var usuarios =
            await _usuarioRepository
                .GetByPerfilAsync(perfil);

        return usuarios.Select(u =>
            new UsuarioDTO
            {
                Id = u.Id,
                Email = u.Email,
                Perfil = u.Perfil,
                Telefone = u.Telefone
            }
        ).ToList();
    }

    public async Task<
(bool Sucesso, string Mensagem)
> CriarUsuarioAsync(
    RegistroDTO dto,
    PerfilUsuario perfil
)
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

            Perfil = perfil,

            Telefone = dto.Telefone
        };

        await _usuarioRepository
            .AddAsync(usuario);

        return (
            true,
            "Usuário criado com sucesso."
        );
    }

    public async Task<(bool Sucesso, string Mensagem)>
EditarUsuarioAsync(
    int id,
    EditarUsuarioDTO dto
)
    {
        var usuario =
            await _usuarioRepository
                .GetByIdEntityAsync(id);

        if (usuario == null)
        {
            return (
                false,
                "Usuário não encontrado."
            );
        }

        bool emailExiste =
            await _usuarioRepository
                .EmailExisteAsync(dto.Email, id);

        if (emailExiste)
        {
            return (
                false,
                "Email já está em uso."
            );
        }

        usuario.Email = dto.Email;
        usuario.Telefone = dto.Telefone;

        await _usuarioRepository.UpdateAsync(usuario);

        return (
            true,
            "Usuário atualizado com sucesso."
        );
    }


}