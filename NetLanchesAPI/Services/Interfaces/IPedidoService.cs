using NetLanchesAPI.DTOs.Pedido;
using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;

namespace NetLanchesAPI.Services.Interfaces;

public interface IPedidoService
{
    Task<List<Pedido>> GetAllAsync();

    Task<Pedido?> GetByIdAsync(int id);

    Task<(bool Sucesso, string? Mensagem, Pedido? Pedido)>
    CreateAsync(
        PedidoDTO dto,
        int usuarioId
    );

    Task<Pedido?> AtualizarStatusAsync(
        int id,
        StatusPedido status
    );

    Task<List<Pedido>> GetByUsuarioIdAsync(
    int usuarioId
);
}