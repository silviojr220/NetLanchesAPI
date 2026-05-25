const api = "/api";

async function carregarPedidos() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {

        const res = await fetch(`${api}/pedidos`, {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!res.ok) {
            alert("Erro ao carregar pedidos");
            return;
        }

        const response = await res.json();
        const pedidos = Array.isArray(response)
            ? response
            : response.dados || [];

        const div = document.getElementById("pedidos");

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

        pedidos.forEach(p => {

            let itensHTML = "";

            (p.itens || []).forEach(i => {

                itensHTML += `
                    <div class="item d-flex justify-content-between">

                        <div>
                            <strong>${i.produto?.nome || "Produto removido"}</strong>
                            <br>
                            <small class="text-muted">
                                Quantidade: ${i.quantidade}
                            </small>
                        </div>

                        <div>
                            R$ ${((i.produto?.preco || 0) * i.quantidade).toFixed(2)}
                        </div>

                    </div>
                `;
            });

            div.innerHTML += `
                <div class="col-lg-6">

                    <div class="card pedido-card p-4">

                        <div class="pedido-header mb-3">

                            <h4>
                                Pedido #${p.id}
                            </h4>

                            ${badgeStatus(p.status)}

                        </div>

                        ${itensHTML}

                        <div class="d-flex justify-content-between align-items-center mt-4">

                            <span class="text-muted">
                                ${new Date(p.dataCriacao).toLocaleDateString("pt-BR")}
                            </span>

                            <div class="total">
                                R$ ${Number(p.total).toFixed(2)}
                            </div>

                        </div>

                    </div>

                </div>
            `;
        });

    } catch (erro) {

        console.error(erro);

    }
}

function badgeStatus(status) {

    switch (status) {

        case "Pendente":
            return `<span class="badge bg-danger">Pendente</span>`;

        case "EmPreparo":
            return `<span class="badge bg-warning text-dark">Em preparo</span>`;

        case "Pronto":
            return `<span class="badge bg-info text-dark">Pronto</span>`;

        case "Finalizado":
            return `<span class="badge bg-success">Finalizado</span>`;

        default:
            return `<span class="badge bg-secondary">${status}</span>`;
    }
}

function voltar() {

    const token = localStorage.getItem("token");

    const payload =
        JSON.parse(atob(token.split(".")[1]));

    const perfil =
        payload.role ||
        payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (perfil === "SUPERADM") {
        window.location.href = "superadmin.html";
    } else {
        window.location.href = "admin.html";
    }
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

carregarPedidos();