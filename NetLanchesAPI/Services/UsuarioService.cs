using Microsoft.EntityFrameworkCore;
using NetLanchesAPI.Data;
using NetLanchesAPI.DTOs.Usuario;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Services;

public class UsuarioService : IUsuarioService
{
    private readonly AppDbContext _context;

    public UsuarioService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UsuarioDTO>> GetAllAsync()
    {
        return await _context.Usuarios
            .Select(u => new UsuarioDTO
            {
                Id = u.Id,
                Email = u.Email,
                Perfil = u.Perfil,
                Telefone = u.Telefone
            })
            .ToListAsync();
    }

    public async Task<UsuarioDTO?> GetByIdAsync(int id)
    {
        return await _context.Usuarios
            .Where(u => u.Id == id)
            .Select(u => new UsuarioDTO
            {
                Id = u.Id,
                Email = u.Email,
                Perfil = u.Perfil,
                Telefone = u.Telefone
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario == null)
            return false;

        _context.Usuarios.Remove(usuario);

        await _context.SaveChangesAsync();

        return true;
    }
}