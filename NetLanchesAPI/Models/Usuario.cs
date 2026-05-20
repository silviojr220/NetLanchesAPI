using System.ComponentModel.DataAnnotations;

using NetLanchesAPI.Models.Enums;

namespace NetLanchesAPI.Models;

public class Usuario
{
    public int Id { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string SenhaHash { get; set; } = string.Empty;

    [Required]
    public PerfilUsuario Perfil { get; set; }

    public string? Telefone { get; set; }
}