using NetLanchesAPI.Data;
using Microsoft.EntityFrameworkCore;
using NetLanchesAPI.Models;
using NetLanchesAPI.Models.Enums;
using NetLanchesAPI.Repositories.Interfaces;

namespace NetLanchesAPI.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Usuario>> GetAllAsync()
    {
        return await _context.Usuarios.ToListAsync();
    }

    public async Task<Usuario?> GetByIdAsync(int id)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<Usuario?> GetByEmailAsync(
        string email
    )
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<Usuario?>
GetByIdAndPerfilAsync(
    int id,
    PerfilUsuario perfil
)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u =>
                u.Id == id &&
                u.Perfil == perfil
            );
    }

    public async Task<List<Usuario>>
    GetByPerfilAsync(PerfilUsuario perfil)
    {
        return await _context.Usuarios
            .Where(u => u.Perfil == perfil)
            .ToListAsync();
    }

    public async Task<bool>
    EmailExistsAsync(string email)
    {
        return await _context.Usuarios
            .AnyAsync(u => u.Email == email);
    }

    public async Task<Usuario>
    AddAsync(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);

        await _context.SaveChangesAsync();

        return usuario;
    }

    public async Task<Usuario?>
    UpdateAsync(Usuario usuario)
    {
        var usuarioExistente =
            await _context.Usuarios
                .FindAsync(usuario.Id);

        if (usuarioExistente == null)
            return null;

        usuarioExistente.Email = usuario.Email;

        usuarioExistente.Telefone =
            usuario.Telefone;

        await _context.SaveChangesAsync();

        return usuarioExistente;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var usuario =
            await _context.Usuarios
                .FindAsync(id);

        if (usuario == null)
            return false;

        _context.Usuarios.Remove(usuario);

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<Usuario?>
GetByIdEntityAsync(int id)
    {
        return await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<bool>
    EmailExisteAsync(
        string email,
        int? ignorarId = null
    )
    {
        return await _context.Usuarios
            .AnyAsync(u =>
                u.Email == email &&
                (!ignorarId.HasValue ||
                 u.Id != ignorarId.Value)
            );
    }

}