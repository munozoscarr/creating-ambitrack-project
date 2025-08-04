window.login = function () {
    const usuario = document.getElementById("usuario").value;
    const clave = document.getElementById("clave").value;

    if (usuario === "admin" && clave === "1234") {
        localStorage.setItem("logueado", "true");
        window.location.href = "/reportes-verificados";
    } else {
        alert("Usuario o contraseña incorrectos");
    }
};
