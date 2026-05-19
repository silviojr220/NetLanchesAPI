using NetLanchesAPI.DTOs.Usuario;

namespace NetLanchesAPI.Services.Interfaces;

public interface IUsuarioService
{
    Task<List<UsuarioDTO>> GetAllAsync();

    Task<UsuarioDTO?> GetByIdAsync(int id);

    Task<bool> DeleteAsync(int id);
}