const express = require('express');
const fs = require('fs'); // Módulo para manejar archivos
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const DATA_FILE = 'datos.json';

// Función para leer datos del archivo
const leerDatos = () => {
    if (!fs.existsSync(DATA_FILE)) return [];
    const contenido = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(contenido || '[]');
};

// Función para guardar datos en el archivo
const guardarDatos = (datos) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(datos, null, 2));
};

// Ruta para obtener reparaciones
app.get('/api/reparaciones', (req, res) => {
    res.json(leerDatos());
});

// Ruta para guardar una nueva reparación
app.post('/api/reparaciones', (req, res) => {
    const reparaciones = leerDatos();
    const nueva = { 
        id: Date.now(), // ID único para cada registro
        ...req.body 
    };
    reparaciones.push(nueva);
    guardarDatos(reparaciones);
    res.status(201).json(nueva);
});

// Importante para Render: usar el puerto que ellos asignen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en puerto ${PORT}`);
});