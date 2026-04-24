// Función para borrar (llámala desde el botón)
async function eliminarRegistro(id) {
    if (confirm('¿Deseas eliminar este registro de forma permanente?')) {
        await fetch(`/api/reparaciones/${id}`, { method: 'DELETE' });
        cargarReparaciones(); // Refresca la tabla
    }
}

// Dentro de cargarReparaciones, en el datos.forEach:
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