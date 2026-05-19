using NetLanchesAPI.DTOs;
using NetLanchesAPI.Models;

namespace NetLanchesAPI.Services.Interfaces;

public interface IPedidoService
{
    Task<List<Pedido>> GetAllAsync();

    Task<Pedido?> GetByIdAsync(int id);

    Task<(bool Sucesso, string? Mensagem, Pedido? Pedido)>
        CreateAsync(PedidoDTO dto);

    Task<Pedido?> AtualizarStatusAsync(int id, string status);
}