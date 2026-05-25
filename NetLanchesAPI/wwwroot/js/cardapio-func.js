// ============================================================
// ⚙️  CONFIGURAÇÃO
// ============================================================
const api = "/api";
// ============================================================

let todosProdutos = [];

function getHeaders() {
    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("token")
    };
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function verificarFuncionario() {
    const token = localStorage.getItem("token");
    if (!token) { window.location.href = "login.html"; return false; }
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload.role ||
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if (role !== "FUNCIONARIO") {
            alert("Acesso negado!");
            window.location.href = "login.html";
            return false;
        }
    } catch { window.location.href = "login.html"; return false; }
    return true;
}

async function carregarProdutos() {
    try {
        const res = await fetch(`${api}/produto`, { headers: getHeaders() });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        todosProdutos = data.dados || [];
        renderizar(todosProdutos);

    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        document.getElementById("produtos").innerHTML =
            `<div class="col-12"><div class="alert alert-danger">Erro ao conectar com a API.</div></div>`;
    }
}

function buscar(termo) {
    const filtrado = todosProdutos.filter(p =>
        p.nome.toLowerCase().includes(termo.toLowerCase()) ||
        (p.descricao || "").toLowerCase().includes(termo.toLowerCase())
    );
    renderizar(filtrado);
}

function renderizar(lista) {
    const div = document.getElementById("produtos");
    div.innerHTML = "";

    if (lista.length === 0) {
        div.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center p-4 rounded-4">
                    Nenhum produto encontrado.
                </div>
            </div>`;
        return;
    }

    lista.forEach(p => {
        const disponivel = p.disponivel !== false; // true por padrão se o campo não existir

        const imgHTML = p.imagemUrl
            ? `<img src="${p.imagemUrl}" alt="${p.nome}" class="produto-img">`
            : `<div class="produto-img">🍽️</div>`;

        div.insertAdjacentHTML("beforeend", `
            <div class="col-lg-4 col-md-6">
                <div class="produto-card">
                    ${imgHTML}
                    <div class="produto-body">
                        <div class="d-flex justify-content-between align-items-start mb-1">
                            <div class="produto-nome">${p.nome}</div>
                            <span class="${disponivel ? 'badge-disponivel' : 'badge-indisponivel'}">
                                ${disponivel ? '✅ Disponível' : '❌ Indisponível'}
                            </span>
                        </div>
                        <div class="produto-desc">${p.descricao || "Sem descrição."}</div>
                        <div class="produto-preco">R$ ${Number(p.preco).toFixed(2)}</div>
                    </div>
                </div>
            </div>
        `);
    });
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    if (!verificarFuncionario()) return;
    carregarProdutos();
});