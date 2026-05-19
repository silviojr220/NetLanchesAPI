using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.Models;

public class Produto
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Nome é obrigatório")]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [Required(ErrorMessage = "Tipo é obrigatório")]
    public string Tipo { get; set; } = string.Empty; // Lanche ou Bebida

    [Range(0.01, 1000, ErrorMessage = "Preço inválido")]
    public decimal Preco { get; set; }

    [MaxLength(500)]
    public string Descricao { get; set; } = string.Empty;

    public string? ImagemUrl { get; set; }
}