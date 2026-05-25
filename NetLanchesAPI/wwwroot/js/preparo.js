const api = "/api";
const ENDPOINT_STATUS = (id) => `${api}/pedido/${id}/status`; // ✏️ ajuste o endpoint
const STATUS = {
    EM_PREPARO: "EmPreparo",   // ✏️ ajuste para o valor que a API espera
    PRONTO: "Pronto",      // ✏️ ajuste para o valor que a API espera
    FINALIZADO: "Finalizado"   // ✏️ ajuste para o valor que a API espera
};


let todosPedidos = [];
let filtroAtual = "EmPreparo";

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
        const estaEmPreparo = p.status === STATUS.EM_PREPARO;
        const estaPronto = p.status === STATUS.PRONTO;

        const badgeHTML = estaEmPreparo
            ? `<span class="badge-preparo">🔥 Em Preparo</span>`
            : estaPronto
                ? `<span class="badge-pronto">✅ Pronto</span>`
                : `<span class="badge badge-secondary">${p.status}</span>`;

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

        const btnHTML = estaEmPreparo
            ? `<button class="btn-confirmar w-100 mt-3" onclick="confirmarPronto(${p.id}, this)">
                   ✅ Confirmar que está Pronto
               </button>`
            : `<button class="btn-confirmar w-100 mt-3" disabled>
                   ✅ Já Confirmado
               </button>`;

        div.insertAdjacentHTML("beforeend", `
            <div class="col-lg-6" id="card-preparo-${p.id}">
                <div class="pedido-card">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0">Pedido #${p.id}</h5>
                        <div id="badge-${p.id}">${badgeHTML}</div>
                    </div>
                    ${itensHTML}
                    <div class="d-flex justify-content-between align-items-center mt-3">
                        <small class="text-muted">
                            ${p.dataCriacao
                ? new Date(p.dataCriacao).toLocaleString("pt-BR")
                : new Date().toLocaleDateString("pt-BR")}
                        </small>
                        <strong class="text-success">R$ ${Number(p.total).toFixed(2)}</strong>
                    </div>
                    <div id="btn-area-${p.id}">${btnHTML}</div>
                </div>
            </div>
        `);
    });
}

async function confirmarPronto(id, btn) {
    if (!confirm(`Confirmar que o Pedido #${id} está pronto?`)) return;

    btn.disabled = true;
    btn.textContent = "Atualizando...";

    try {
        const res = await fetch(ENDPOINT_STATUS(id), {
            method: "PUT",            // ✏️ troque para PATCH se necessário
            headers: getHeaders(),
            body: JSON.stringify({ status: STATUS.PRONTO })
        });

        if (res.ok) {
            // Atualiza localmente sem recarregar tudo
            const pedido = todosPedidos.find(p => p.id === id);
            if (pedido) pedido.status = STATUS.PRONTO;

            document.getElementById(`badge-${id}`).innerHTML =
                `<span class="badge-pronto">✅ Pronto</span>`;

            document.getElementById(`btn-area-${id}`).innerHTML =
                `<button class="btn-confirmar w-100 mt-3" disabled>✅ Já Confirmado</button>`;

        } else {
            const data = await res.json().catch(() => ({}));
            alert(data.mensagem || "Erro ao atualizar status.");
            btn.disabled = false;
            btn.textContent = "✅ Confirmar que está Pronto";
        }

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com a API.");
        btn.disabled = false;
        btn.textContent = "✅ Confirmar que está Pronto";
    }
}

// ==================== INIT ====================
document.addEventListener("DOMContentLoaded", () => {
    if (!verificarFuncionario()) return;
    carregarPedidos();

    // ♻️ Auto-refresh a cada 30 segundos
    setInterval(carregarPedidos, 30000);
});