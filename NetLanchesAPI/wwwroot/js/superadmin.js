const api = "/api";

// ==================== AUTH ====================

function verificarSuperAdm() {

    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return false; // ✅ FIX: retorna false para interromper o fluxo
    }

    try {

        const payload = JSON.parse(atob(token.split(".")[1]));

        const perfil =
            payload.role ||
            payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

        if (perfil !== "SUPERADM") {
            alert("Acesso negado!");
            window.location.href = "login.html";
            return false; // ✅ FIX: retorna false para interromper o fluxo
        }

    } catch (erro) {

        console.error(erro);
        localStorage.removeItem("token");
        window.location.href = "login.html";
        return false; // ✅ FIX: retorna false para interromper o fluxo
    }

    return true;
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

// ==================== UTIL ====================

function formatarTelefone(input) {

    let valor = input.value.replace(/\D/g, "");

    valor = valor.substring(0, 11);

    if (valor.length <= 2) {
        valor = valor.replace(/^(\d*)/, "($1");
    } else if (valor.length <= 6) {
        valor = valor.replace(/^(\d{2})(\d+)/, "($1) $2");
    } else if (valor.length <= 10) {
        valor = valor.replace(/^(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    } else {
        valor = valor.replace(/^(\d{2})(\d{5})(\d+)/, "($1) $2-$3");
    }

    input.value = valor;
}

function aplicarMascaraTelefone(id) {

    const input = document.getElementById(id);

    if (!input) return;

    // ✅ FIX: remove listener antigo antes de adicionar novo (evita duplicatas em re-renders)
    input.removeEventListener("input", input._maskHandler);

    input._maskHandler = function () {
        formatarTelefone(this);
    };

    input.addEventListener("input", input._maskHandler);
}

function getHeaders() {

    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
    };
}

async function obterJson(res) {

    try {
        return await res.json();
    } catch {
        return {};
    }
}

// ==================== ADMS ====================

async function carregarAdms() {

    try {

        const res = await fetch(`${api}/usuario/adms`, {
            headers: getHeaders()
        });

        const data = await obterJson(res);

        const adms = data.dados || [];

        const div = document.getElementById("listaAdms");

        div.innerHTML = "";

        if (adms.length === 0) {
            div.innerHTML = `<div class="text-muted">Nenhum administrador encontrado.</div>`;
            return;
        }

        // ✅ FIX: insertAdjacentHTML em vez de innerHTML += (mais eficiente e seguro)
        adms.forEach(a => {
            div.insertAdjacentHTML("beforeend", `
                <div class="admin-item" id="adm-${a.id}">
                    <div>
                        <strong>${a.email}</strong><br>
                        <small class="text-muted">${a.telefone || "Sem telefone"}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-sm btn-outline-warning"
                            onclick='abrirEdicaoAdm(${a.id}, ${JSON.stringify(a.email)}, ${JSON.stringify(a.telefone || "")})'>
                            Editar
                        </button>
                        <button
                            class="btn btn-sm btn-outline-danger"
                            onclick="removerAdm(${a.id})">
                            Remover
                        </button>
                    </div>
                </div>
            `);
        });

    } catch (erro) {
        console.error("Erro ao carregar ADMs:", erro);
    }
}

function abrirEdicaoAdm(id, email, telefone) {

    const item = document.getElementById(`adm-${id}`);

    item.innerHTML = `
        <div class="w-100">
            <input type="email" id="edit-adm-email-${id}" class="form-control mb-2" value="${email}" placeholder="Email">
            <input type="tel"   id="edit-adm-tel-${id}"   class="form-control mb-2" value="${telefone}" placeholder="Telefone" maxlength="15">
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-success"   onclick="salvarEdicaoAdm(${id})">Salvar</button>
                <button class="btn btn-sm btn-secondary" onclick="carregarAdms()">Cancelar</button>
            </div>
        </div>
    `;

    aplicarMascaraTelefone(`edit-adm-tel-${id}`);
}

async function salvarEdicaoAdm(id) {

    const email = document.getElementById(`edit-adm-email-${id}`).value.trim();
    const telefone = document.getElementById(`edit-adm-tel-${id}`).value.trim();

    const res = await fetch(`${api}/usuario/adm/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ email, telefone })
    });

    const data = await obterJson(res);

    if (res.ok) {
        alert("ADM atualizado com sucesso!");
        carregarAdms();
    } else {
        alert(data.mensagem || "Erro ao atualizar ADM.");
    }
}

async function removerAdm(id) {

    if (!confirm("Tem certeza que deseja remover este ADM?")) return;

    const res = await fetch(`${api}/usuario/adm/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (res.ok) {
        alert("ADM removido com sucesso!");
        carregarAdms();
    } else {
        alert("Erro ao remover ADM.");
    }
}

async function criarAdm() {

    try {

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const telefone = document.getElementById("telefone").value.trim();

        if (!email || !senha) {
            alert("Preencha email e senha.");
            return;
        }

        const res = await fetch(`${api}/usuario/criar-adm`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email, senha, telefone })
        });

        const data = await obterJson(res);

        if (!res.ok) {
            alert(data.mensagem || "Erro ao criar administrador.");
            return;
        }

        alert("Administrador criado com sucesso!");

        document.getElementById("email").value = "";
        document.getElementById("senha").value = "";
        document.getElementById("telefone").value = "";

        carregarAdms();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com API.");
    }
}

// ==================== CLIENTES ====================

async function carregarClientes() {

    try {

        const res = await fetch(`${api}/usuario/clientes`, {
            headers: getHeaders()
        });

        const data = await obterJson(res);

        const clientes = data.dados || [];

        const div = document.getElementById("listaClientes");

        div.innerHTML = "";

        if (clientes.length === 0) {
            div.innerHTML = `<div class="text-muted">Nenhum cliente encontrado.</div>`;
            return;
        }

        clientes.forEach(c => {
            div.insertAdjacentHTML("beforeend", `
                <div class="admin-item" id="cliente-${c.id}">
                    <div>
                        <strong>${c.email}</strong><br>
                        <small class="text-muted">${c.telefone || "Sem telefone"}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-sm btn-outline-warning"
                            onclick='abrirEdicaoCliente(${c.id}, ${JSON.stringify(c.email)}, ${JSON.stringify(c.telefone || "")})'>
                            Editar
                        </button>
                        <button
                            class="btn btn-sm btn-outline-danger"
                            onclick="removerCliente(${c.id})">
                            Remover
                        </button>
                    </div>
                </div>
            `);
        });

    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
    }
}

function abrirEdicaoCliente(id, email, telefone) {

    const item = document.getElementById(`cliente-${id}`);

    item.innerHTML = `
        <div class="w-100">
            <input type="email" id="edit-cli-email-${id}" class="form-control mb-2" value="${email}" placeholder="Email">
            <input type="tel"   id="edit-cli-tel-${id}"   class="form-control mb-2" value="${telefone}" placeholder="Telefone" maxlength="15">
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-success"   onclick="salvarEdicaoCliente(${id})">Salvar</button>
                <button class="btn btn-sm btn-secondary" onclick="carregarClientes()">Cancelar</button>
            </div>
        </div>
    `;

    aplicarMascaraTelefone(`edit-cli-tel-${id}`);
}

async function salvarEdicaoCliente(id) {

    const email = document.getElementById(`edit-cli-email-${id}`).value.trim();
    const telefone = document.getElementById(`edit-cli-tel-${id}`).value.trim();

    const res = await fetch(`${api}/usuario/cliente/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ email, telefone })
    });

    const data = await obterJson(res);

    if (res.ok) {
        alert("Cliente atualizado com sucesso!");
        carregarClientes();
    } else {
        alert(data.mensagem || "Erro ao atualizar cliente.");
    }
}

async function removerCliente(id) {

    if (!confirm("Tem certeza que deseja remover este cliente?")) return;

    const res = await fetch(`${api}/usuario/cliente/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (res.ok) {
        alert("Cliente removido com sucesso!");
        carregarClientes();
    } else {
        alert("Erro ao remover cliente.");
    }
}

// ==================== FUNCIONÁRIOS ====================

async function carregarFuncionarios() {

    try {

        const res = await fetch(`${api}/usuario/funcionarios`, {
            headers: getHeaders()
        });

        const data = await obterJson(res);

        const funcionarios = data.dados || [];

        const div = document.getElementById("listaFuncionarios");

        div.innerHTML = "";

        if (funcionarios.length === 0) {
            div.innerHTML = `<div class="text-muted">Nenhum funcionário encontrado.</div>`;
            return;
        }

        funcionarios.forEach(f => {
            div.insertAdjacentHTML("beforeend", `
                <div class="admin-item" id="func-${f.id}">
                    <div>
                        <strong>${f.email}</strong><br>
                        <small class="text-muted">${f.telefone || "Sem telefone"}</small>
                    </div>
                    <div class="d-flex gap-2">
                        <button
                            class="btn btn-sm btn-outline-warning"
                            onclick='abrirEdicaoFuncionario(${f.id}, ${JSON.stringify(f.email)}, ${JSON.stringify(f.telefone || "")})'>
                            Editar
                        </button>
                        <button
                            class="btn btn-sm btn-outline-danger"
                            onclick="removerFuncionario(${f.id})">
                            Remover
                        </button>
                    </div>
                </div>
            `);
        });

    } catch (erro) {
        console.error("Erro ao carregar funcionários:", erro);
    }
}

function abrirEdicaoFuncionario(id, email, telefone) {

    const item = document.getElementById(`func-${id}`);

    item.innerHTML = `
        <div class="w-100">
            <input type="email" id="edit-func-email-${id}" class="form-control mb-2" value="${email}" placeholder="Email">
            <input type="tel"   id="edit-func-tel-${id}"   class="form-control mb-2" value="${telefone}" placeholder="Telefone" maxlength="15">
            <div class="d-flex gap-2">
                <button class="btn btn-sm btn-success"   onclick="salvarEdicaoFuncionario(${id})">Salvar</button>
                <button class="btn btn-sm btn-secondary" onclick="carregarFuncionarios()">Cancelar</button>
            </div>
        </div>
    `;

    aplicarMascaraTelefone(`edit-func-tel-${id}`);
}

async function salvarEdicaoFuncionario(id) {

    const email = document.getElementById(`edit-func-email-${id}`).value.trim();
    const telefone = document.getElementById(`edit-func-tel-${id}`).value.trim();

    const res = await fetch(`${api}/usuario/funcionario/${id}`, {
        method: "PUT",
        headers: getHeaders(),
        body: JSON.stringify({ email, telefone })
    });

    const data = await obterJson(res);

    if (res.ok) {
        alert("Funcionário atualizado com sucesso!");
        carregarFuncionarios();
    } else {
        alert(data.mensagem || "Erro ao atualizar funcionário.");
    }
}

async function removerFuncionario(id) {

    if (!confirm("Tem certeza que deseja remover este funcionário?")) return;

    const res = await fetch(`${api}/usuario/funcionario/${id}`, {
        method: "DELETE",
        headers: getHeaders()
    });

    if (res.ok) {
        alert("Funcionário removido com sucesso!");
        carregarFuncionarios();
    } else {
        alert("Erro ao remover funcionário.");
    }
}

// ✅ FIX PRINCIPAL: função estava definida corretamente no JS original,
// mas o erro ocorria porque o script falhava antes de chegar aqui.
// Agora com o fluxo de auth corrigido + return false, o problema é eliminado.
async function criarFuncionario() {

    try {

        const email = document.getElementById("func-email").value.trim();
        const senha = document.getElementById("func-senha").value.trim();
        const telefone = document.getElementById("func-telefone").value.trim();

        if (!email || !senha) {
            alert("Preencha email e senha.");
            return;
        }

        const res = await fetch(`${api}/usuario/criar-funcionario`, {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({ email, senha, telefone })
        });

        const data = await obterJson(res);

        if (!res.ok) {
            alert(data.mensagem || "Erro ao criar funcionário.");
            return;
        }

        alert("Funcionário criado com sucesso!");

        document.getElementById("func-email").value = "";
        document.getElementById("func-senha").value = "";
        document.getElementById("func-telefone").value = "";

        carregarFuncionarios();

    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com API.");
    }
}

// ==================== INIT ====================

document.addEventListener("DOMContentLoaded", () => {

    // ✅ FIX: só continua se o usuário for SUPERADM
    if (!verificarSuperAdm()) return;

    aplicarMascaraTelefone("telefone");
    aplicarMascaraTelefone("func-telefone");

    carregarAdms();
    carregarClientes();
    carregarFuncionarios();
});