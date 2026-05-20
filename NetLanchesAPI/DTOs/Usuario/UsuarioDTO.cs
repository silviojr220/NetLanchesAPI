using NetLanchesAPI.Models.Enums;
namespace NetLanchesAPI.DTOs.Usuario;

public class UsuarioDTO
{
    public int Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public PerfilUsuario Perfil { get; set; }

    public string? Telefone { get; set; }
}