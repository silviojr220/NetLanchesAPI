using Microsoft.IdentityModel.Tokens;
using NetLanchesAPI.Models;
using NetLanchesAPI.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NetLanchesAPI.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GerarToken(Usuario usuario)
    {
        var key = Encoding.ASCII.GetBytes(
            _configuration["Jwt:Key"]!
        );

        var tokenHandler = new JwtSecurityTokenHandler();

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    usuario.Id.ToString()
                ),

                new Claim(
                    ClaimTypes.Email,
                    usuario.Email
                ),

                new Claim(
                    ClaimTypes.Role,
                    usuario.Perfil.ToString()
                )
            }),

            Expires = DateTime.UtcNow.AddHours(2),

            Issuer = _configuration["Jwt:Issuer"],

            Audience = _configuration["Jwt:Audience"],

            SigningCredentials =
                new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}