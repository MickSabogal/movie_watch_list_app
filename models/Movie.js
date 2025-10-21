// Definição do estrutura almacenados no MongoDB, vai usar os controladores em server.js

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: Number },
    genre: { type: String },
    watched: { type: Boolean, default: false },
    rating: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);