const api = "/api";

const STATUS = {
    PENDENTE: "PENDENTE",
    EM_PREPARO: "EM_PREPARO",
    PRONTO: "PRONTO",
    ENTREGUE: "ENTREGUE",
    CANCELADO: "CANCELADO"
};

function verificarFuncionario() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const payload =
            JSON.parse(atob(token.split(".")[1]));

        const role =
            payload.role ||
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (role !== "FUNCIONARIO") {

            alert("Acesso negado!");
            window.location.href = "login.html";
        }

    } catch {

        window.location.href = "login.html";
    }
}

async function carregarPedidos() {

    const token =
        localStorage.getItem("token");

    try {

        const res = await fetch(`${api}/pedido`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (res.status === 401) {

            localStorage.removeItem("token");

            window.location.href = "login.html";

            return;
        }

        if (!res.ok) {

            alert("Erro ao carregar pedidos");

            return;
        }

        const response = await res.json();

        const pedidos = response.dados || [];

        renderizarPedidosRecentes(pedidos);

        atualizarEstatisticas(pedidos);

    } catch (erro) {

        console.error(erro);
    }
}

function atualizarEstatisticas(pedidos) {

    document.getElementById("totalPedidos")
        .textContent = pedidos.length;

    const emPreparo =
        pedidos.filter(
            p => p.status === STATUS.EM_PREPARO
        ).length;

    document.getElementById("emPreparo")
        .textContent = emPreparo;

    const entregues =
        pedidos.filter(
            p => p.status === STATUS.ENTREGUE
        ).length;

    document.getElementById("entregues")
        .textContent = entregues;

    const prontos =
        pedidos.filter(
            p => p.status === STATUS.PRONTO
        ).length;

    document.getElementById("prontos")
        .textContent = prontos;
}

function badgePorStatus(status) {

    switch (status) {

        case STATUS.PENDENTE:
            return `<span class="badge bg-danger">⏳ Pendente</span>`;

        case STATUS.EM_PREPARO:
            return `<span class="badge bg-warning text-dark">🔥 Em Preparo</span>`;

        case STATUS.PRONTO:
            return `<span class="badge bg-info text-dark">🍽️ Pronto</span>`;

        case STATUS.ENTREGUE:
            return `<span class="badge bg-success">✅ Entregue</span>`;

        case STATUS.CANCELADO:
            return `<span class="badge bg-dark">❌ Cancelado</span>`;

        default:
            return `<span class="badge bg-secondary">${status}</span>`;
    }
}

function renderizarPedidosRecentes(pedidos) {

    const div =
        document.getElementById("pedidos");

    div.innerHTML = "";

    if (pedidos.length === 0) {

        div.innerHTML = `
            <div class="col-12">
                <div class="alert alert-warning text-center p-4 rounded-4">
                    Nenhum pedido encontrado
                </div>
            </div>
        `;

        return;
    }

    pedidos
        .slice(0, 4)
        .forEach(p => {

            let itensHTML = "";

            (p.itens || []).forEach(i => {

                itensHTML += `
                    <div class="item d-flex justify-content-between">
                        <div>
                            <strong>${i.produto.nome}</strong><br>
                            <small class="text-muted">
                                Quantidade: ${i.quantidade}
                            </small>
                        </div>

                        <div>
                            R$ ${(i.produto.preco * i.quantidade).toFixed(2)}
                        </div>
                    </div>
                `;
            });

            div.innerHTML += `
                <div class="col-lg-6">
                    <div class="card pedido-card p-4">

                        <div class="pedido-header mb-3 d-flex justify-content-between align-items-center">
                            <h4 class="mb-0">
                                Pedido #${p.id}
                            </h4>

                            ${badgePorStatus(p.status)}
                        </div>

                        ${itensHTML}

                        <div class="d-flex justify-content-between align-items-center mt-4">

                            <span class="text-muted">
                                ${p.dataCriacao
                    ? new Date(p.dataCriacao).toLocaleString("pt-BR")
                    : new Date().toLocaleDateString("pt-BR")}
                            </span>

                            <div class="total">
                                R$ ${Number(p.total).toFixed(2)}
                            </div>

                        </div>

                    </div>
                </div>
            `;
        });
}

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}

verificarFuncionario();

document.addEventListener("DOMContentLoaded", () => {

    carregarPedidos();

    setInterval(
        carregarPedidos,
        30000
    );
});