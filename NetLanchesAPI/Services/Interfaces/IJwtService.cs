using NetLanchesAPI.Models;

namespace NetLanchesAPI.Services.Interfaces;

public interface IJwtService
{
    string GerarToken(Usuario usuario);
}