using Microsoft.EntityFrameworkCore;
using NetLanchesAPI.Data;
using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;
using NetLanchesAPI.Repositories.Interfaces;

namespace NetLanchesAPI.Repositories;

public class PedidoRepository : IPedidoRepository
{
    private readonly AppDbContext _context;

    public PedidoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Pedido>> GetAllAsync()
    {
        return await _context.Pedidos
            .Include(p => p.Itens)
            .ThenInclude(i => i.Produto)
            .ToListAsync();
    }

    public async Task<Pedido?> GetByIdAsync(int id)
    {
        return await _context.Pedidos
            .Include(p => p.Itens)
            .ThenInclude(i => i.Produto)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task<List<Pedido>>
    GetByUsuarioIdAsync(int usuarioId)
    {
        return await _context.Pedidos
            .Where(p => p.UsuarioId == usuarioId)
            .Include(p => p.Itens)
            .ThenInclude(i => i.Produto)
            .ToListAsync();
    }

    public async Task<Pedido> AddAsync(Pedido pedido)
    {
        _context.Pedidos.Add(pedido);

        await _context.SaveChangesAsync();

        return pedido;
    }

    public async Task<Pedido?>
    AtualizarStatusAsync(
        int id,
        StatusPedido status
    )
    {
        var pedido =
            await _context.Pedidos.FindAsync(id);

        if (pedido == null)
            return null;

        pedido.Status = status;

        await _context.SaveChangesAsync();

        return pedido;
    }
}