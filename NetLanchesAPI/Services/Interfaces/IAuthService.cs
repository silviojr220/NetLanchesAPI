using NetLanchesAPI.DTOs.Auth;

namespace NetLanchesAPI.Services.Interfaces;

public interface IAuthService
{
    Task<(bool Sucesso, string Mensagem)>
        RegistroAsync(RegistroDTO dto);

    Task<(bool Sucesso, object? Dados)>
        LoginAsync(LoginDTO dto);
}