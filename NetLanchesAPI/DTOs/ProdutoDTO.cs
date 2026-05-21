using NetLanchesAPI.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.DTOs;

public class ProdutoDTO
{
    [Required]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required]
    public TipoProduto Tipo { get; set; }

    [Range(0.01, 1000)]
    public decimal Preco { get; set; }

    public string Descricao { get; set; } = string.Empty;

    public string? ImagemUrl { get; set; }
}