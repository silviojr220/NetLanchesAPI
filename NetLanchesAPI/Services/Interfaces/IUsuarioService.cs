using NetLanchesAPI.DTOs.Auth;
using NetLanchesAPI.DTOs.Usuario;
using NetLanchesAPI.Models.Enums;

namespace NetLanchesAPI.Services.Interfaces;

public interface IUsuarioService
{
    Task<List<UsuarioDTO>> GetAllAsync();

    Task<UsuarioDTO?> GetByIdAsync(int id);

    Task<bool> DeleteAsync(int id);

    Task<(bool Sucesso, string Mensagem)>
CriarUsuarioAsync(
   RegistroDTO dto,
   PerfilUsuario perfil
);

    Task<List<UsuarioDTO>>
    GetByPerfilAsync(
        PerfilUsuario perfil
    );

    Task<(bool Sucesso, string Mensagem)>
    EditarUsuarioAsync(
        int id,
        PerfilUsuario perfil,
        EditarUsuarioDTO dto
    );

    Task<(bool Sucesso, string Mensagem)>
    DeleteByPerfilAsync(
        int id,
        PerfilUsuario perfil
    );

    Task<(bool Sucesso, string Mensagem)>
EditarUsuarioAsync(
    int id,
    EditarUsuarioDTO dto
);
}