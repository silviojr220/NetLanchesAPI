using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.Models;

public class Pedido
{
    public int Id { get; set; }

    public List<ItemPedido> Itens { get; set; } = new();

    public decimal Total { get; set; }

    [Required]
    public string Status { get; set; } = "Pendente";

    public DateTime DataCriacao { get; set; } = DateTime.Now;
}