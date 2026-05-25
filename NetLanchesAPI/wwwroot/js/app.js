const api = "/api";

// ══════════════════════════════════════════════
// ⚙️ CONFIGURAÇÃO DO CHECKOUT — EDITE AQUI
// ══════════════════════════════════════════════
const CHECKOUT_URL = "https://s-istema-pagamento.vercel.app/";
const CALLBACK_URL = "https://sistema-de-processamento-netlanches.onrender.com/api/pagamentos/callback";
const RETURN_URL = window.location.origin + "/pedidos.html";
const STORE_NAME = "NetLanches";
// ══════════════════════════════════════════════

let produtosCache = [];
let carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;

/* INIT */

document.addEventListener("DOMContentLoaded", () => {
    carregarUsuario();
    carregarProdutos();
});

/* TOAST */

function mostrarToast(mensagem, tipo = "success") {

    const toast = document.getElementById("toast");
    const toastBody = document.getElementById("toastBody");

    toast.className = "toast border-0 text-white";

    if (tipo === "success") {

        toast.classList.add("bg-success");

    } else if (tipo === "error") {

        toast.classList.add("bg-danger");

    } else if (tipo === "warning") {

        toast.classList.add("bg-warning");
        toast.classList.remove("text-white");
        toast.classList.add("text-dark");

    } else {

        toast.classList.add("bg-primary");
    }

    toastBody.innerHTML = mensagem;

    const bsToast = new bootstrap.Toast(toast);

    bsToast.show();
}

/* SIDEBAR */

function toggleSidebar() {

    document
        .getElementById("sidebar")
        .classList
        .toggle("closed");
}

function renderSidebar() {

    const div = document.getElementById("menuProdutos");

    div.innerHTML = "";

    produtosCache.forEach(produto => {

        const item = document.createElement("div");

        item.className = "menu-item";

        item.innerHTML = `
            <span class="menu-icon">
                <i class="bi bi-bag-fill"></i>
            </span>

            <span class="menu-text">
                ${produto.nome}
            </span>
        `;

        item.addEventListener("click", () => {
            abrirProduto(produto.id);
        });

        div.appendChild(item);
    });
}

/* USUARIO */

function carregarUsuario() {

    const token = localStorage.getItem("token");

    if (!token) {

        window.location.href = "login.html";

        return;
    }

    try {

        const payload =
            JSON.parse(
                atob(token.split(".")[1])
            );

        document.getElementById("nomeUsuario")
            .innerText =
            payload.email || "Cliente";

    } catch {

        localStorage.removeItem("token");

        window.location.href = "login.html";
    }
}

/* PRODUTOS */

async function carregarProdutos() {

    try {

        const response =
            await fetch(`${api}/Produtos`);

        if (!response.ok) {

            mostrarToast(
                "Erro ao carregar produtos.",
                "error"
            );

            return;
        }

        produtosCache = await response.json();

        renderSidebar();

        renderCarousel();

    } catch {

        mostrarToast(
            "Erro de conexão com servidor.",
            "error"
        );
    }
}

/* CAROUSEL */

function renderCarousel() {

    const div =
        document.getElementById(
            "carouselProdutos"
        );

    div.innerHTML = "";

    produtosCache.forEach(produto => {

        const card =
            document.createElement("div");

        card.className = "carousel-card";

        card.addEventListener("click", () => {
            abrirProduto(produto.id);
        });

        card.innerHTML = `
            <img
                src="${produto.imagemUrl || "/img/default.png"}"
                alt="${produto.nome}"
            >

            <div class="carousel-info">

                <h5>
                    <i class="bi bi-bag-fill"></i>
                    ${produto.nome}
                </h5>

                <small>
                    ${produto.tipo}
                </small>

                <div class="preco">
                    R$ ${Number(produto.preco)
                .toFixed(2)
                .replace(".", ",")}
                </div>

            </div>
        `;

        div.appendChild(card);
    });
}

function scrollCarousel(direction) {

    document
        .getElementById("carouselProdutos")
        .scrollBy({
            left: 260 * direction,
            behavior: "smooth"
        });
}

/* PRODUTO */

function abrirProduto(id) {

    produtoAtual =
        produtosCache.find(p => p.id === id);

    if (!produtoAtual) {

        mostrarToast(
            "Produto não encontrado.",
            "error"
        );

        return;
    }

    quantidadeAtual = 1;

    renderProduto();
}

function renderProduto() {

    if (!produtoAtual)
        return;

    const div =
        document.getElementById(
            "produtoSelecionado"
        );

    div.innerHTML = `
        <div class="produto-card fade-in">

            <img
                src="${produtoAtual.imagemUrl || "/img/default.png"}"
                alt="${produtoAtual.nome}"
            >

            <div class="produto-info">

                <h2>
                    ${produtoAtual.nome}
                </h2>

                <p>
                    ${produtoAtual.descricao || "Sem descrição."}
                </p>

                <div class="preco">
                    R$ ${Number(produtoAtual.preco)
            .toFixed(2)
            .replace(".", ",")}
                </div>

                <div class="quantidade">

                    <button onclick="diminuirQtd()">
                        <i class="bi bi-dash-lg"></i>
                    </button>

                    <h4 id="qtdAtual">
                        ${quantidadeAtual}
                    </h4>

                    <button onclick="aumentarQtd()">
                        <i class="bi bi-plus-lg"></i>
                    </button>

                </div>

                <button
                    class="btn-finalizar"
                    onclick="adicionarCarrinho()"
                >

                    <i class="bi bi-cart-plus-fill"></i>

                    Adicionar ao Carrinho

                </button>

            </div>

        </div>
    `;
}

/* QUANTIDADE */

function aumentarQtd() {

    quantidadeAtual++;

    document.getElementById("qtdAtual")
        .innerText = quantidadeAtual;
}

function diminuirQtd() {

    if (quantidadeAtual <= 1)
        return;

    quantidadeAtual--;

    document.getElementById("qtdAtual")
        .innerText = quantidadeAtual;
}

/* CARRINHO */

function adicionarCarrinho() {

    if (!produtoAtual)
        return;

    const itemExistente =
        carrinho.find(item =>
            item.produtoId === produtoAtual.id
        );

    if (itemExistente) {

        itemExistente.quantidade += quantidadeAtual;

    } else {

        carrinho.push({
            produtoId: produtoAtual.id,
            nome: produtoAtual.nome,
            preco: produtoAtual.preco,
            quantidade: quantidadeAtual
        });
    }

    renderCarrinho();

    mostrarToast(
        "Produto adicionado ao carrinho."
    );
}

function renderCarrinho() {

    const div =
        document.getElementById("carrinho");

    const totalDiv =
        document.getElementById("total");

    div.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {

        const subtotal =
            item.preco * item.quantidade;

        total += subtotal;

        div.insertAdjacentHTML(
            "beforeend",
            `
            <div class="carrinho-item">

                <div>

                    <strong>
                        ${item.nome}
                    </strong>

                    <br>

                    <small>
                        ${item.quantidade}x
                    </small>

                </div>

                <div>

                    R$ ${subtotal
                .toFixed(2)
                .replace(".", ",")}

                    <br>

                    <button
                        class="btn btn-sm btn-danger mt-2"
                        onclick="removerItem(${index})"
                    >

                        <i class="bi bi-trash-fill"></i>

                    </button>

                </div>

            </div>
            `
        );
    });

    totalDiv.innerHTML =
        `Total: R$ ${total
            .toFixed(2)
            .replace(".", ",")}`;
}

function removerItem(index) {

    carrinho.splice(index, 1);

    renderCarrinho();
}

/* PEDIDO */

async function finalizarPedido() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        mostrarToast(
            "Usuário não autenticado.",
            "error"
        );

        return;
    }

    if (carrinho.length === 0) {

        mostrarToast(
            "Carrinho vazio.",
            "warning"
        );

        return;
    }

    try {

        const response =
            await fetch(`${api}/pedidos`, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    itens: carrinho.map(item => ({
                        produtoId: item.produtoId,
                        quantidade: item.quantidade
                    }))
                })
            });

        if (!response.ok) {

            const erro =
                await response.text();

            mostrarToast(
                erro || "Erro ao finalizar pedido.",
                "error"
            );

            return;
        }

        // ── Pedido criado — redireciona para o checkout ──
        const pedido = await response.json();

        const total = carrinho.reduce(
            (acc, item) => acc + item.preco * item.quantidade, 0
        );

        const descricao = carrinho
            .map(i => `${i.quantidade}x ${i.nome}`)
            .join(", ");

        const params = new URLSearchParams({
            orderId: pedido.pedidoId ?? pedido.id ?? "0",
            amount: total.toFixed(2),
            description: descricao,
            store: STORE_NAME,
            callbackUrl: CALLBACK_URL,
            returnUrl: RETURN_URL,
            token: token
        });

        mostrarToast("Redirecionando para o pagamento...");

        setTimeout(() => {
            window.location.href = `${CHECKOUT_URL}?${params.toString()}`;
        }, 1000);

    } catch {

        mostrarToast(
            "Erro de conexão com servidor.",
            "error"
        );
    }
}

/* LOGOUT */

function logout() {

    localStorage.removeItem("token");

    window.location.href = "login.html";
}