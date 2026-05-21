using NetLanchesAPI.DTOs.Pedido;
using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;
using NetLanchesAPI.Repositories.Interfaces;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Services;

public class PedidoService : IPedidoService
{
    private readonly IPedidoRepository _pedidoRepository;

    private readonly IProdutoRepository _produtoRepository;

    public PedidoService(
        IPedidoRepository pedidoRepository,
        IProdutoRepository produtoRepository
    )
    {
        _pedidoRepository = pedidoRepository;

        _produtoRepository = produtoRepository;
    }

    public async Task<List<Pedido>> GetAllAsync()
    {
        return await _pedidoRepository
            .GetAllAsync();
    }

    public async Task<Pedido?> GetByIdAsync(int id)
    {
        return await _pedidoRepository
            .GetByIdAsync(id);
    }

    public async Task<
        (bool Sucesso, string? Mensagem, Pedido? Pedido)
    > CreateAsync(
        PedidoDTO dto,
        int usuarioId
    )
    {
        if (dto.Itens == null || !dto.Itens.Any())
        {
            return (
                false,
                "Pedido deve possuir ao menos 1 item.",
                null
            );
        }

        Pedido pedido = new Pedido
        {
            UsuarioId = usuarioId
        };

        decimal total = 0;

        foreach (var itemDto in dto.Itens)
        {
            var produto =
                await _produtoRepository
                    .GetByIdAsync(itemDto.ProdutoId);

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

                Quantidade = itemDto.Quantidade,

                PrecoUnitario = produto.Preco
            };

            pedido.Itens.Add(item);

            total +=
                produto.Preco *
                itemDto.Quantidade;
        }

        pedido.Total = total;

        await _pedidoRepository
            .AddAsync(pedido);

        return (
            true,
            null,
            pedido
        );
    }

    public async Task<Pedido?> AtualizarStatusAsync(
        int id,
        StatusPedido status
    )
    {
        return await _pedidoRepository
            .AtualizarStatusAsync(id, status);
    }

    public async Task<List<Pedido>>
    GetByUsuarioIdAsync(int usuarioId)
    {
        return await _pedidoRepository
            .GetByUsuarioIdAsync(usuarioId);
    }
}