using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using NetLanchesAPI.Data;
using NetLanchesAPI.Services;
using NetLanchesAPI.Services.Interfaces;
using System.Reflection;
using System.Text;
using BCrypt.Net;
using NetLanchesAPI.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IProdutoService, ProdutoService>();
builder.Services.AddScoped<IPedidoService, PedidoService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtService, JwtService>();

// =========================
// DATABASE MYSQL
// =========================

var connectionString =
    builder.Configuration.GetConnectionString("MySQL");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(
        connectionString,
        ServerVersion.AutoDetect(connectionString)
    )
);


// =========================
// CONTROLLERS
// =========================

builder.Services.AddControllers();


// =========================
// JWT AUTHENTICATION
// =========================

var key = Encoding.ASCII.GetBytes(
    builder.Configuration["Jwt:Key"]!
);

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

        options.SaveToken = true;

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,

                IssuerSigningKey =
                    new SymmetricSecurityKey(key),

                ValidateIssuer = true,

                ValidIssuer =
                    builder.Configuration["Jwt:Issuer"],

                ValidateAudience = true,

                ValidAudience =
                    builder.Configuration["Jwt:Audience"],

                ValidateLifetime = true,

                ClockSkew = TimeSpan.Zero
            };
    });


// =========================
// SWAGGER
// =========================

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    // XML COMMENTS

    var xmlFilename =
        $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

    options.IncludeXmlComments(
        Path.Combine(AppContext.BaseDirectory, xmlFilename)
    );

    // API INFO

    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "NetLanches API",
        Version = "v1",
        Description =
            "API para gerenciamento da lanchonete NetLanches."
    });

    // JWT AUTH NO SWAGGER

    options.AddSecurityDefinition("Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",

            Type = SecuritySchemeType.Http,

            Scheme = "Bearer",

            BearerFormat = "JWT",

            In = ParameterLocation.Header,

            Description =
                "Digite: Bearer {seu token}"
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                        new OpenApiReference
                        {
                            Type =
                                ReferenceType.SecurityScheme,

                            Id = "Bearer"
                        }
                },

                Array.Empty<string>()
            }
        });
});


// =========================
// CORS
// =========================

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});


var app = builder.Build();


// =========================
// MIDDLEWARES
// =========================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();

    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint(
            "/swagger/v1/swagger.json",
            "NetLanches API v1"
        );

        options.DocumentTitle =
            "NetLanches API";
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var context =
        scope.ServiceProvider
            .GetRequiredService<AppDbContext>();

    bool existeSuperAdm =
        context.Usuarios.Any(u =>
            u.Perfil == PerfilUsuario.SUPERADM
        );

    if (!existeSuperAdm)
    {
        Usuario superAdm = new Usuario
        {
            Email = "superadm@gmail.com",
            SenhaHash = BCrypt.Net.BCrypt.HashPassword(
                "adm123"
            ),
            Perfil = PerfilUsuario.SUPERADM,
            Telefone = "(71) 67676-7676"
        };

        context.Usuarios.Add(superAdm);

        context.SaveChanges();

        Console.WriteLine(
            "SUPERADM criado com sucesso."
        );
    }
}

app.Run();