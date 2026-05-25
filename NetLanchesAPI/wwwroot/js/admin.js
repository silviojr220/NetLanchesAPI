let produtoEditandoId = null;

const api = "/api";

function getHeaders() {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
}

// Verifica se é ADM ao carregar a página
function verificarAdm() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return false;
    }

    try {

        const payload =
            JSON.parse(atob(token.split(".")[1]));

        const perfil =
            payload.role ||
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (
            perfil !== "ADM" &&
            perfil !== "SUPERADM"
        ) {
            mostrarToast("Acesso negado!");
            window.location.href = "index.html";
            return false;
        }

        return true;

    } catch (erro) {

        console.error(erro);

        localStorage.removeItem("token");

        window.location.href = "login.html";

        return false;
    }
}

async function carregarProdutos() {

    try {

        const res = await fetch(`${api}/produtos`, {
            headers: getHeaders()
        });

        if (res.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const produtos = await res.json();

        const tbody =
            document.getElementById("listaProdutos");

        tbody.innerHTML = "";

        produtos.forEach(p => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>
                    <strong>${p.nome}</strong>
                </td>

                <td>
                    <span class="badge bg-dark">
                        ${p.tipo}
                    </span>
                </td>

                <td>
                    R$ ${Number(p.preco).toFixed(2)}
                </td>

                <td>
                    ${p.descricao || "-"}
                </td>

                <td class="text-center">

                    <button
                        class="btn btn-sm btn-warning me-2"
                        onclick="editarProduto(${p.id})">

                        ✏️
                    </button>

                    <button
                        class="btn btn-sm btn-danger"
                        onclick="deletar(${p.id})">

                        🗑
                    </button>

                </td>
            `;

            tbody.appendChild(tr);
        });

    } catch (erro) {

        console.error(erro);

        mostrarToast("Erro ao carregar produtos");
    }
}

async function criarProduto() {

    const nome =
        document.getElementById("nome").value.trim();

    const tipo =
        document.getElementById("tipo").value;

    const preco =
        parseFloat(
            document.getElementById("preco").value
        );

    const descricao =
        document.getElementById("descricao").value.trim();

    const imagemUrl = await uploadImagem();

    if (!nome || !tipo || isNaN(preco)) {

        mostrarToast("Preencha os campos obrigatórios.");

        return;
    }

    const body = {
        nome: nome,
        tipo: tipo,
        preco: preco,
        descricao: descricao,
        imagemUrl: imagemUrl
    };

    console.log(body);

    try {

        let res;

        if (produtoEditandoId == null) {

            res = await fetch(`${api}/produtos`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(body)
            });

        } else {

            res = await fetch(
                `${api}/produtos/${produtoEditandoId}`,
                {
                    method: "PUT",
                    headers: getHeaders(),
                    body: JSON.stringify(body)
                }
            );
        }

        if (!res.ok) {

            const erro = await res.text();

            console.log(erro);

            mostrarToast("Erro ao salvar produto.");

            return;
        }

        mostrarToast(
            produtoEditandoId == null
                ? "Produto criado!"
                : "Produto atualizado!"
        );

        limparFormulario();

        carregarProdutos();

    } catch (erro) {

        console.error(erro);

        mostrarToast("Erro ao conectar com API.");
    }
}

async function uploadImagem() {

    const input =
        document.getElementById("imagem");

    const arquivo = input.files[0];

    if (!arquivo)
        return "";

    const formData = new FormData();

    formData.append("imagem", arquivo);

    try {

        const res = await fetch(
            `${api}/produtos/upload`,
            {
                method: "POST",
                headers: {
                    "Authorization":
                        "Bearer " +
                        localStorage.getItem("token")
                },
                body: formData
            }
        );

        if (!res.ok) {
            mostrarToast("Erro ao enviar imagem.");
            return "";
        }

        const data = await res.json();

        return data.imagemUrl;

    } catch (erro) {

        console.error(erro);

        mostrarToast("Erro no upload.");

        return "";
    }
}

async function editarProduto(id) {

    try {

        const res = await fetch(
            `${api}/produtos/${id}`,
            {
                headers: getHeaders()
            }
        );

        if (!res.ok) {
            mostrarToast("Produto não encontrado.");
            return;
        }

        const produto = await res.json();

        produtoEditandoId = produto.id;

        document.getElementById("nome").value =
            produto.nome;

        document.getElementById("tipo").value =
            produto.tipo;

        document.getElementById("preco").value =
            produto.preco;

        document.getElementById("descricao").value =
            produto.descricao || "";

        const btn =
            document.getElementById("btnProduto");

        btn.innerHTML = `
            <i class="bi bi-check-circle me-2"></i>
            Salvar Alterações
        `;

    } catch (erro) {

        console.error(erro);

        mostrarToast("Erro ao carregar produto.");
    }
}

function limparFormulario() {

    produtoEditandoId = null;

    document.getElementById("nome").value = "";
    document.getElementById("tipo").value = "";
    document.getElementById("preco").value = "";
    document.getElementById("descricao").value = "";

    document.getElementById("imagem").value = "";

    const btn =
        document.getElementById("btnProduto");

    btn.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        Cadastrar Produto
    `;
}

async function deletar(id) {

    if (!confirm("Deseja remover este produto?"))
        return;

    try {

        const res = await fetch(
            `${api}/produtos/${id}`,
            {
                method: "DELETE",
                headers: getHeaders()
            }
        );

        if (!res.ok) {
            mostrarToast("Erro ao deletar produto.");
            return;
        }

        mostrarToast("Produto removido!");

        carregarProdutos();

    } catch (erro) {

        console.error(erro);

        mostrarToast("Erro ao conectar com API.");
    }
}

function mostrarToast(msg) {
    const toastEl = document.getElementById("toast");

    toastEl.querySelector(".toast-body").innerText = msg;

    new bootstrap.Toast(toastEl).show();
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {

    if (!verificarAdm())
        return;

    carregarProdutos();
});