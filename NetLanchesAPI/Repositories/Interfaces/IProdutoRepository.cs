using NetLanchesAPI.Models;

namespace NetLanchesAPI.Repositories.Interfaces;

public interface IProdutoRepository
{
    Task<List<Produto>> GetAllAsync();

    Task<Produto?> GetByIdAsync(int id);

    Task<Produto> AddAsync(Produto produto);

    Task<Produto?> UpdateAsync(Produto produto);

    Task<bool> DeleteAsync(int id);
}