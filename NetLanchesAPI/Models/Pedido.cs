using NetLanchesAPI.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.Models;

public class Pedido
{
    public int Id { get; set; }

    public List<ItemPedido> Itens { get; set; } = new();

    public decimal Total { get; set; }

    [Required]
    public StatusPedido Status { get; set; } 
        = StatusPedido.PENDENTE;

    public int UsuarioId { get; set; }

    public Usuario Usuario { get; set; } = null!;

    public DateTime DataCriacao { get; set; }
    = DateTime.UtcNow;
}