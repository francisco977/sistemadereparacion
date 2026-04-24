/// 1. Cargar los datos apenas abre la página
async function cargarReparaciones() {
    const res = await fetch('/api/reparaciones');
    const datos = await res.json();
    const tabla = document.getElementById('tablaReparaciones');
    
    // IMPORTANTE: Limpiar la tabla para que no se dupliquen los datos al recargar
    tabla.innerHTML = ''; 

    datos.forEach(item => {
        const mensaje = `Hola ${item.nombre}, el artículo "${item.articulo}" ya está registrado. Tiene de 5 a 10 días para retirar. Precio: $${item.precio}`;
        const urlWsp = `https://wa.me/${item.telefono}?text=${encodeURIComponent(mensaje)}`;
        
        tabla.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.articulo}</td>
                <td>$${item.precio}</td>
                <td>
                    <a href="${urlWsp}" target="_blank" class="btn-wsp">WhatsApp</a>
                    <button onclick="eliminarRegistro('${item._id}')" class="btn-delete">Eliminar</button>
                </td>
            </tr>
        `;
    });
}

// 2. Guardar un nuevo registro desde el formulario
document.getElementById('formReparacion').addEventListener('submit', async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const nueva = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        articulo: document.getElementById('articulo').value,
        precio: Number(document.getElementById('precio').value)
    };

    await fetch('/api/reparaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva)
    });

    document.getElementById('formReparacion').reset(); // Limpia los cuadritos de texto
    cargarReparaciones(); // Refresca la tabla automáticamente
});

// 3. Función para borrar (conecta con el botón rojo)
async function eliminarRegistro(id) {
    if (confirm('¿Deseas eliminar este registro de forma permanente?')) {
        await fetch(`/api/reparaciones/${id}`, { method: 'DELETE' });
        cargarReparaciones(); // Refresca la tabla
    }
}

// Llamada inicial para mostrar los datos guardados
cargarReparaciones();