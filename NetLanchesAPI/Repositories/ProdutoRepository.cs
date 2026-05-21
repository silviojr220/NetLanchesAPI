using Microsoft.EntityFrameworkCore;
using NetLanchesAPI.Data;
using NetLanchesAPI.Models;
using NetLanchesAPI.Repositories.Interfaces;

namespace NetLanchesAPI.Repositories;

public class ProdutoRepository : IProdutoRepository
{
    private readonly AppDbContext _context;

    public ProdutoRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Produto>> GetAllAsync()
    {
        return await _context.Produtos.ToListAsync();
    }

    public async Task<Produto?> GetByIdAsync(int id)
    {
        return await _context.Produtos.FindAsync(id);
    }

    public async Task<Produto> AddAsync(Produto produto)
    {
        _context.Produtos.Add(produto);

        await _context.SaveChangesAsync();

        return produto;
    }

    public async Task<Produto?> UpdateAsync(Produto produto)
    {
        var produtoExistente =
            await _context.Produtos.FindAsync(produto.Id);

        if (produtoExistente == null)
            return null;

        produtoExistente.Nome = produto.Nome;
        produtoExistente.Tipo = produto.Tipo;
        produtoExistente.Preco = produto.Preco;
        produtoExistente.Descricao = produto.Descricao;
        produtoExistente.ImagemUrl = produto.ImagemUrl;

        await _context.SaveChangesAsync();

        return produtoExistente;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var produto =
            await _context.Produtos.FindAsync(id);

        if (produto == null)
            return false;

        _context.Produtos.Remove(produto);

        await _context.SaveChangesAsync();

        return true;
    }
}