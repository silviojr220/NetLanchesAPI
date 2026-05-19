using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.DTOs.Auth;

public class RegistroDTO
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Senha { get; set; } = string.Empty;

    public string? Telefone { get; set; }
}