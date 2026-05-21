using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;

namespace NetLanchesAPI.Repositories.Interfaces;

public interface IPedidoRepository
{
    Task<List<Pedido>> GetAllAsync();

    Task<Pedido?> GetByIdAsync(int id);

    Task<List<Pedido>> GetByUsuarioIdAsync(
        int usuarioId
    );

    Task<Pedido> AddAsync(Pedido pedido);

    Task<Pedido?> AtualizarStatusAsync(
        int id,
        StatusPedido status
    );
}