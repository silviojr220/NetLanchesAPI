using NetLanchesAPI.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace NetLanchesAPI.DTOs.Pedido;

public class AtualizarStatusPedidoDTO
{
    [Required]
    public StatusPedido Status { get; set; }
}