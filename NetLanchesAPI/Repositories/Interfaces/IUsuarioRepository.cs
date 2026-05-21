using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;

namespace NetLanchesAPI.Repositories.Interfaces;

public interface IUsuarioRepository
{
    Task<List<Usuario>> GetAllAsync();

    Task<Usuario?> GetByIdAsync(int id);

    Task<Usuario?> GetByEmailAsync(string email);

    Task<List<Usuario>> GetByPerfilAsync(
        PerfilUsuario perfil
    );

    Task<bool> EmailExistsAsync(string email);

    Task<Usuario> AddAsync(Usuario usuario);

    Task<Usuario?> UpdateAsync(Usuario usuario);

    Task<bool> DeleteAsync(int id);

    Task<Usuario?> GetByIdAndPerfilAsync(
        int id,
        PerfilUsuario perfil
    );

    Task<Usuario?> GetByIdEntityAsync(int id);

    Task<bool> EmailExisteAsync(
        string email,
        int? ignorarId = null
    );

}