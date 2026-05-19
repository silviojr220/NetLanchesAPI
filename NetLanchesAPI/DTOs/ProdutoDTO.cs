using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.DTOs;

public class ProdutoDTO
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public string Tipo { get; set; } = string.Empty;

    [Range(0.01, 1000)]
    public decimal Preco { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public string? ImagemUrl { get; set; }
}