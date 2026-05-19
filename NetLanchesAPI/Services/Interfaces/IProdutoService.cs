using NetLanchesAPI.DTOs;
using NetLanchesAPI.Models;

namespace NetLanchesAPI.Services.Interfaces;

public interface IProdutoService
{
    Task<List<Produto>> GetAllAsync();

    Task<Produto?> GetByIdAsync(int id);

    Task<Produto> CreateAsync(ProdutoDTO dto);

    Task<Produto?> UpdateAsync(int id, ProdutoDTO dto);

    Task<bool> DeleteAsync(int id);
}