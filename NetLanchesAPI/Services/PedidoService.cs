using Microsoft.EntityFrameworkCore;
using NetLanchesAPI.Data;
using NetLanchesAPI.DTOs;
using NetLanchesAPI.Models;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Services;

public class PedidoService : IPedidoService
{
    private readonly AppDbContext _context;

    public PedidoService(AppDbContext context)
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

    public async Task<(bool Sucesso, string? Mensagem, Pedido? Pedido)>
        CreateAsync(PedidoDTO dto)
    {
        Pedido pedido = new Pedido();

        decimal total = 0;

        foreach (var itemDto in dto.Itens)
        {
            var produto = await _context.Produtos
                .FindAsync(itemDto.ProdutoId);

            if (produto == null)
            {
                return (
                    false,
                    $"Produto ID {itemDto.ProdutoId} não encontrado.",
                    null
                );
            }

            ItemPedido item = new ItemPedido
            {
                ProdutoId = produto.Id,
                Quantidade = itemDto.Quantidade
            };

            pedido.Itens.Add(item);

            total += produto.Preco * itemDto.Quantidade;
        }

        pedido.Total = total;

        _context.Pedidos.Add(pedido);

        await _context.SaveChangesAsync();

        return (true, null, pedido);
    }

    public async Task<Pedido?> AtualizarStatusAsync(
        int id,
        string status
    )
    {
        var pedido = await _context.Pedidos.FindAsync(id);

        if (pedido == null)
            return null;

        pedido.Status = status;

        await _context.SaveChangesAsync();

        return pedido;
    }
}