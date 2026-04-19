const form = document.getElementById('formReparacion');
const tabla = document.getElementById('tablaReparaciones');

// Función para cargar la lista desde el servidor
async function cargarReparaciones() {
    const res = await fetch('/api/reparaciones');
    const datos = await res.json();
    tabla.innerHTML = '';
    
    datos.forEach(item => {
        const mensaje = `Hola ${item.nombre}, tu ${item.articulo} ya está registrado. Tienes de 5 a 10 días para retirar. Total: $${item.precio}`;
        const urlWsp = `https://wa.me/${item.telefono}?text=${encodeURIComponent(mensaje)}`;
        
        tabla.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.articulo}</td>
                <td>$${item.precio}</td>
                <td><a href="${urlWsp}" target="_blank" class="btn-wsp">Enviar WhatsApp</a></td>
            </tr>
        `;
    });
}

// Evento para guardar datos
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nueva = {
        nombre: document.getElementById('nombre').value,
        telefono: document.getElementById('telefono').value,
        articulo: document.getElementById('articulo').value,
        precio: document.getElementById('precio').value
    };

    await fetch('/api/reparaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva)
    });

    form.reset();
    cargarReparaciones();
});

cargarReparaciones();