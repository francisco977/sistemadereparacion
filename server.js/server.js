require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error:', err));

const Reparacion = mongoose.model('Reparacion', {
  cliente: String,
  equipo: String,
  problema: String,
  estado: String
});

app.get('/api/reparaciones', async (req, res) => {
  const data = await Reparacion.find();
  res.json(data);
});

app.post('/api/reparaciones', async (req, res) => {
  const nueva = new Reparacion(req.body);
  await nueva.save();
  res.status(201).json(nueva);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT);
});