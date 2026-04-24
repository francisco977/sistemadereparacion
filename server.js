require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares importantes
app.use(cors());
app.use(express.json()); // Crucial para captar los datos del formulario
app.use(express.static('public'));

// Conexión a MongoDB Atlas
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error de conexión:', err));

// Modelo de Datos
const ReparacionSchema = new mongoose.Schema({
    nombre: String,
    telefono: String,
    articulo: String,
    precio: Number,
    fecha: { type: Date, default: Date.now }
});

const Reparacion = mongoose.model('Reparacion', ReparacionSchema);

// --- RUTAS API ---

// 1. Obtener todos los registros
app.get('/api/reparaciones', async (req, res) => {
    try {
        const datos = await Reparacion.find().sort({ fecha: -1 }); // Ordena por los más nuevos
        res.json(datos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener datos' });
    }
});

// 2. Guardar un nuevo registro (Captura nombre, tel, articulo y precio)
app.post('/api/reparaciones', async (req, res) => {
    try {
        const nueva = new Reparacion(req.body);
        await nueva.save();
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ error: 'Error al guardar el registro' });
    }
});

// 3. Eliminar un registro por ID
app.delete('/api/reparaciones/:id', async (req, res) => {
    try {
        await Reparacion.findByIdAndDelete(req.params.id);
        res.json({ mensaje: 'Registro eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar' });
    }
});

// Puerto para Render o Local
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});