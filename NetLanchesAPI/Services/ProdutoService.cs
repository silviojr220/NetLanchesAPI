using Microsoft.EntityFrameworkCore;
using NetLanchesAPI.Data;
using NetLanchesAPI.DTOs;
using NetLanchesAPI.Models;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Services;

public class ProdutoService : IProdutoService
{
    private readonly AppDbContext _context;

    public ProdutoService(AppDbContext context)
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

    public async Task<Produto> CreateAsync(ProdutoDTO dto)
    {
        Produto produto = new Produto
        {
            Nome = dto.Nome,
            Tipo = dto.Tipo,
            Preco = dto.Preco,
            Descricao = dto.Descricao,
            ImagemUrl = dto.ImagemUrl
        };

        _context.Produtos.Add(produto);

        await _context.SaveChangesAsync();

        return produto;
    }

    public async Task<Produto?> UpdateAsync(int id, ProdutoDTO dto)
    {
        var produto = await _context.Produtos.FindAsync(id);

        if (produto == null)
            return null;

        produto.Nome = dto.Nome;
        produto.Tipo = dto.Tipo;
        produto.Preco = dto.Preco;
        produto.Descricao = dto.Descricao;
        produto.ImagemUrl = dto.ImagemUrl;

        await _context.SaveChangesAsync();

        return produto;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var produto = await _context.Produtos.FindAsync(id);

        if (produto == null)
            return false;

        _context.Produtos.Remove(produto);

        await _context.SaveChangesAsync();

        return true;
    }
}