let datos = [];
let editando = -1;

function mostrarDatos() {
    const tabla = document.getElementById("listaNombres");
    tabla.innerHTML = "";
    datos.forEach((elemento, index) => {
        tabla.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${elemento.nombre}</td>
                <td>${elemento.rol}</td>
                <td>
                    <button onclick="editarNombre(${index})" class="btn">Editar</button>
                    <button onclick="eliminarNombre(${index})" class="btn" style="background:#dc2626;">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

function agregarNombre() {
    const inputNombre = document.getElementById("name");
    const inputRol = document.getElementById("rol");
    const msg = document.getElementById("msg");
    const nombre = inputNombre.value.trim();
    const rol = inputRol.value.trim();

    if (nombre === "" || rol === "") {
        msg.textContent = "Por favor, completa ambos campos.";
        return;
    }
    msg.textContent = "";

    const nuevoDato = { nombre, rol };

    if (editando === -1) {
        datos.push(nuevoDato);
    } else {
        datos[editando] = nuevoDato;
        editando = -1;
    }

    inputNombre.value = "";
    inputRol.value = "";
    mostrarDatos();
}

function editarNombre(index) {
    const inputNombre = document.getElementById("name");
    const inputRol = document.getElementById("rol");
    inputNombre.value = datos[index].nombre;
    inputRol.value = datos[index].rol;
    editando = index;
}

function eliminarNombre(index) {
    if (confirm("¿Deseas eliminar este registro?")) {
        datos.splice(index, 1);
        mostrarDatos();
    }
}

// Hacer globales las funciones para los botones
window.agregarNombre = agregarNombre;
window.editarNombre = editarNombre;
window.eliminarNombre = eliminarNombre;
window.onload = mostrarDatos;