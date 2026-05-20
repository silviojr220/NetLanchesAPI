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

        toast(
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

            toast(
                '<i class="bi bi-x-circle-fill"></i> Login inválido',
                'error'
            );

            return;
        }

        const data = await res.json();

        if (!data.token) {

            toast(
                '<i class="bi bi-x-circle-fill"></i> Token inválido',
                'error'
            );

            return;
        }

        localStorage.setItem(
            "token",
            data.token
        );

        toast(
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

        toast(
            '<i class="bi bi-wifi-off"></i> Erro na API',
            'error'
        );
    }
}
