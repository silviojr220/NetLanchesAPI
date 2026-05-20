using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NetLanchesAPI.Constants;
using NetLanchesAPI.DTOs;
using NetLanchesAPI.Services.Interfaces;

namespace NetLanchesAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProdutosController : ControllerBase
{
    private readonly IProdutoService _produtoService;

    public ProdutosController(IProdutoService produtoService)
    {
        _produtoService = produtoService;
    }

    /// <summary>
    /// Lista todos os produtos.
    /// </summary>
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var produtos = await _produtoService.GetAllAsync();

        return Ok(produtos);
    }

    /// <summary>
    /// Seleciona um produto pelo ID.
    /// </summary>
    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var produto = await _produtoService.GetByIdAsync(id);

        if (produto == null)
            return NotFound("Produto não encontrado.");

        return Ok(produto);
    }

    /// <summary>
    /// Cria um novo produto.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM}, {Roles.ADM}")]
    [HttpPost]
    public async Task<IActionResult> Create(ProdutoDTO dto)
    {
        var produto = await _produtoService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = produto.Id },
            produto
        );
    }

    /// <summary>
    /// Atualiza um produto pelo ID.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM},{Roles.ADM}")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, ProdutoDTO dto)
    {
        var produto = await _produtoService.UpdateAsync(id, dto);

        if (produto == null)
            return NotFound("Produto não encontrado.");

        return Ok(produto);
    }

    /// <summary>
    /// Faz upload de imagens (uso para o frontend)
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM},{Roles.ADM}")]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadImagem(
    IFormFile imagem
)
    {
        if (imagem == null || imagem.Length == 0)
            return BadRequest("Imagem inválida.");

        string nomeArquivo =
            Guid.NewGuid().ToString() +
            Path.GetExtension(imagem.FileName);

        string pastaImagens =
            Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot/img"
            );

        if (!Directory.Exists(pastaImagens))
            Directory.CreateDirectory(pastaImagens);

        string caminhoCompleto =
            Path.Combine(pastaImagens, nomeArquivo);

        using (var stream =
            new FileStream(caminhoCompleto, FileMode.Create))
        {
            await imagem.CopyToAsync(stream);
        }

        string urlImagem =
            $"{Request.Scheme}://{Request.Host}/img/{nomeArquivo}";

        return Ok(new
        {
            imagemUrl = urlImagem
        });
    }

    /// <summary>
    /// Deleta um produto pelo ID.
    /// </summary>
    [Authorize(Roles = $"{Roles.SUPERADM},{Roles.ADM}")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool removido = await _produtoService.DeleteAsync(id);

        if (!removido)
            return NotFound("Produto não encontrado.");

        return NoContent();
    }
}