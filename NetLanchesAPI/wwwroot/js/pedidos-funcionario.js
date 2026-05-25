// ============================================================
// ⚙️  CONFIGURAÇÃO
// ============================================================
const api = "/api";
const STATUS = {
    PENDENTE: "Pendente",    
    EM_PREPARO: "EmPreparo",   
    PRONTO: "Pronto",    
    FINALIZADO: "Finalizado"  
};
// ============================================================

let todosPedidos = [];
let filtroAtual = "todos";

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

async function carregarPedidos() {
    try {
        const res = await fetch(`${api}/pedido`, { headers: getHeaders() });

        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "login.html";
            return;
        }

        const data = await res.json();
        todosPedidos = data.dados || [];
        renderizar();

    } catch (erro) {
        console.error("Erro ao carregar pedidos:", erro);
        document.getElementById("pedidos").innerHTML =
            `<div class="col-12"><div class="alert alert-danger">Erro ao conectar com a API.</div></div>`;
    }
}

function filtrar(status) {
    filtroAtual = status;
    renderizar();
}

function badgePorStatus(status) {
    switch (status) {
        case STATUS.PENDENTE:
            return `<span class="badge-nao-concluido">❌ Não Concluído</span>
                    <span class="badge-em-preparo ms-2">🔥 Aguardando Preparo</span>`;
        case STATUS.EM_PREPARO:
            return `<span class="badge-nao-concluido">❌ Não Concluído</span>
                    <span class="badge-em-preparo ms-2">🔥 Em Preparo</span>`;
        case STATUS.PRONTO:
            return `<span class="badge-pronto">🍽️ Pronto para Entrega</span>`;
        case STATUS.FINALIZADO:
            return `<span class="badge-finalizado">✅ Finalizado</span>`;
        default:
            return `<span class="badge bg-secondary">${status}</span>`;
    }
}

function renderizar() {
    const div = document.getElementById("pedidos");
    div.innerHTML = "";

    const lista = filtroAtual === "todos"
        ? todosPedidos
        : todosPedidos.filter(p => p.status === filtroAtual);

    if (lista.length === 0) {
        div.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center p-4 rounded-4">
                    Nenhum pedido encontrado para este filtro.
                </div>
            </div>`;
        return;
    }

    lista.forEach(p => {
        let itensHTML = "";
        (p.itens || []).forEach(i => {
            itensHTML += `
                <div class="item">
                    <div>
                        <strong>${i.produto.nome}</strong>
                        <small class="text-muted d-block">Qtd: ${i.quantidade}</small>
                    </div>
                    <span>R$ ${(i.produto.preco * i.quantidade).toFixed(2)}</span>
                </div>`;
        });

        const data = p.dataCriacao
            ? new Date(p.dataCriacao).toLocaleString("pt-BR")
            : new Date().toLocaleDateString("pt-BR");

        div.insertAdjacentHTML("beforeend", `
            <div class="col-lg-6">
                <div class="pedido-card">
                    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                        <h5 class="mb-0">Pedido #${p.id}</h5>
                        <div>${badgePorStatus(p.status)}</div>
                    </div>
                    ${itensHTML}
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <small class="text-muted">${data}</small>
                        <strong class="text-success">R$ ${Number(p.total).toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        `);
    });
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    if (!verificarFuncionario()) return;
    carregarPedidos();

    // ♻️ Auto-refresh a cada 30 segundos
    setInterval(carregarPedidos, 30000);
});