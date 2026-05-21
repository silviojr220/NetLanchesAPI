/* LOGIN */

async function login() {

    const email =
        document.getElementById("email")
            .value
            .trim();

    const senha =
        document.getElementById("senha")
            .value;

    /* VALIDAÇÃO */

    if (!email || !senha) {

        mostrarToast(
            '<i class="bi bi-exclamation-triangle-fill"></i> Preencha os campos',
            'warning'
        );

        return;
    }

    try {

        const res = await fetch(
            "/api/Auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    senha: senha
                })
            }
        );

        if (!res.ok) {

            mostrarToast(
                '<i class="bi bi-x-circle-fill"></i> Login inválido',
                'error'
            );

            return;
        }

        const data = await res.json();

        if (!data.token) {

            mostrarToast(
                '<i class="bi bi-x-circle-fill"></i> Token inválido',
                'error'
            );

            return;
        }

        localStorage.setItem(
            "token",
            data.token
        );

        mostrarToast(
            '<i class="bi bi-check-circle-fill"></i> Login realizado!',
            'success'
        );

        setTimeout(() => {

            const payload = JSON.parse(
                atob(data.token.split(".")[1])
            );

            const perfil = payload.role;

            if (perfil === "SUPERADM") {

                window.location.href =
                    "superadmin.html";

            } else if (perfil === "ADM") {

                window.location.href =
                    "admin.html";

            } else if (perfil === "FUNCIONARIO") {

                window.location.href =
                    "funcionario.html";

            } else {

                window.location.href =
                    "index.html";
            }

        }, 1000);

    } catch {

        mostrarToast(
            '<i class="bi bi-wifi-off"></i> Erro na API',
            'error'
        );
    }
}

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
