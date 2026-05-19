using Microsoft.AspNetCore.Mvc;
using NetLanchesAPI.DTOs;
using NetLanchesAPI.Services.Interfaces;
using NetLanchesAPI.Constants;
using Microsoft.AspNetCore.Authorization;

namespace NetLanchesAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
    private readonly IPedidoService _pedidoService;

    public PedidosController(IPedidoService pedidoService)
    {
        _pedidoService = pedidoService;
    }

    /// <summary>
    /// Lista todos os pedidos.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM}, {Roles.ADM}, {Roles.FUNCIONARIO}")]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var pedidos = await _pedidoService.GetAllAsync();

        return Ok(pedidos);
    }

    /// <summary>
    /// Seleciona um pedido pelo ID.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM}, {Roles.ADM}, {Roles.FUNCIONARIO}")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var pedido = await _pedidoService.GetByIdAsync(id);

        if (pedido == null)
            return NotFound("Pedido não encontrado.");

        return Ok(pedido);
    }

    /// <summary>
    /// Cria um novo pedido.
    /// </summary>
    [Authorize(Roles = $"{Roles.CLIENTE}")]
    [HttpPost]
    public async Task<IActionResult> Create(PedidoDTO dto)
    {
        var resultado = await _pedidoService.CreateAsync(dto);

        if (!resultado.Sucesso)
            return BadRequest(resultado.Mensagem);

        return Ok(resultado.Pedido);
    }

    /// <summary>
    /// Atualiza o status do pedido.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM}, {Roles.ADM}, {Roles.FUNCIONARIO}")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> AtualizarStatus(
        int id,
        string status
    )
    {
        var pedido = await _pedidoService
            .AtualizarStatusAsync(id, status);

        if (pedido == null)
            return NotFound("Pedido não encontrado.");

        return Ok(pedido);
    }
}