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

    const imagemUrl =
        document.getElementById("imagemUrl").value.trim();

    if (!nome || !tipo || isNaN(preco)) {

        mostrarToast("Preencha os campos obrigatórios.");

        return;
    }

    const body = {
        nome,
        tipo,
        preco,
        descricao,
        imagemUrl
    };

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

        document.getElementById("imagemUrl").value =
            produto.imagemUrl || "";

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
    document.getElementById("imagemUrl").value = "";

    const btn =
        document.getElementById("btnProduto");

    btn.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        Cadastrar Produto
    `;
}

async function salvarEdicao(id) {
    const nome = document.getElementById("nome").value;
    const tipo = document.getElementById("tipo").value;
    const preco = parseFloat(document.getElementById("preco").value);
    const descricao = document.getElementById("descricao").value;

    const token = localStorage.getItem("token");

    const res = await fetch(`${api}/produtos/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ nome, tipo, preco, descricao })
    });

    if (res.ok) {
        mostrarToast("Produto atualizado!");

        // Volta o botão para Cadastrar
        const btn = document.querySelector(`button[onclick='salvarEdicao(${id})']`);
        btn.textContent = "Cadastrar";
        btn.setAttribute("onclick", "criarProduto()");

        document.getElementById("nome").value = "";
        document.getElementById("tipo").value = "";
        document.getElementById("preco").value = "";
        document.getElementById("descricao").value = "";

        carregarProdutos();
    } else {
        mostrarToast("Erro ao atualizar produto");
    }
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