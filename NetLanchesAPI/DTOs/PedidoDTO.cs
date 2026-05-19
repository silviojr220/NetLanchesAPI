using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.DTOs;

public class PedidoDTO
{
    [Required]
    public List<ItemPedidoDTO> Itens { get; set; } = new();
}

public class ItemPedidoDTO
{
    [Required]
    public int ProdutoId { get; set; }

    [Range(1, 100)]
    public int Quantidade { get; set; }
}