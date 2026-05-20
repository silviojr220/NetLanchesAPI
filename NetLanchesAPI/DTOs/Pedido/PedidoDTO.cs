using System.ComponentModel.DataAnnotations;
namespace NetLanchesAPI.DTOs.Pedido;

public class PedidoDTO
{
    [Required]
    public List<ItemPedidoDTO> Itens { get; set; } = new();
}

public class ItemPedidoDTO
{
    [Required]
    public int ProdutoId { get; set; }

    [Range(1, 100, ErrorMessage = "Quantidade deve ser entre 1 e 100")]
    public int Quantidade { get; set; }
}