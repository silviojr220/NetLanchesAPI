using NetLanchesAPI.DTOs;
using NetLanchesAPI.Models;
using NetLanchesAPI.Repositories.Interfaces;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Services;

public class ProdutoService : IProdutoService
{
    private readonly IProdutoRepository _produtoRepository;

    public ProdutoService(
        IProdutoRepository produtoRepository
    )
    {
        _produtoRepository = produtoRepository;
    }

    public async Task<List<Produto>> GetAllAsync()
    {
        return await _produtoRepository
            .GetAllAsync();
    }

    public async Task<Produto?> GetByIdAsync(int id)
    {
        return await _produtoRepository
            .GetByIdAsync(id);
    }

    public async Task<Produto> CreateAsync(
        ProdutoDTO dto
    )
    {
        Produto produto = new Produto
        {
            Nome = dto.Nome,
            Tipo = dto.Tipo,
            Preco = dto.Preco,
            Descricao = dto.Descricao,
            ImagemUrl = dto.ImagemUrl
        };

        return await _produtoRepository
            .AddAsync(produto);
    }

    public async Task<Produto?> UpdateAsync(
        int id,
        ProdutoDTO dto
    )
    {
        var produto =
            await _produtoRepository
                .GetByIdAsync(id);

        if (produto == null)
            return null;

        produto.Nome = dto.Nome;
        produto.Tipo = dto.Tipo;
        produto.Preco = dto.Preco;
        produto.Descricao = dto.Descricao;
        produto.ImagemUrl = dto.ImagemUrl;

        return await _produtoRepository
            .UpdateAsync(produto);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _produtoRepository
            .DeleteAsync(id);
    }
}