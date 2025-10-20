// ===== CONSTANTES FIXAS =====
const express = require('express');
const next = require('next');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDB = require('./lib/mongodb'); // Função de conexão ao MongoDB
const Movie = require('./models/Movie'); // Modelo Movie

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ===== LOGIN SIMPLES =====
const LOGIN_USER = { username: 'admin', password: '1234' };

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === LOGIN_USER.username && password === LOGIN_USER.password) {
        res.cookie('loggedIn', true, { httpOnly: true, maxAge: 3600000 }); // 1 hora
        return res.json({ message: 'Login bem-sucedido' });
    } else {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('loggedIn');
    res.json({ message: 'Logout bem-sucedido' });
});

// ===== MIDDLEWARE PARA PROTEGER ROTAS =====
function checkLogin(req, res, nextMiddleware) {
    if (req.cookies.loggedIn) {
        nextMiddleware();
    } else {
        res.status(401).json({ error: 'Não autorizado' });
    }
}

// ===== ENDPOINTS DOS FILMES =====
// 🔹 Ordem é MUITO IMPORTANTE: as rotas específicas vêm ANTES de /:id

// GET /api/movies/watched - retorna apenas filmes VISTOS
app.get('/api/movies/watched', checkLogin, async (req, res) => {
    try {
        const movies = await Movie.find({ watched: true });
        res.json(movies);
    } catch (error) {
        console.error('Erro ao carregar filmes vistos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// GET /api/movies/notwatched - retorna apenas filmes NÃO VISTOS
app.get('/api/movies/notwatched', checkLogin, async (req, res) => {
    try {
        const movies = await Movie.find({ watched: false });
        res.json(movies);
    } catch (error) {
        console.error('Erro ao carregar filmes não vistos:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// GET /api/movies/sorted - retorna filmes ordenados por rating
app.get('/api/movies/sorted', checkLogin, async (req, res) => {
    try {
        const movies = await Movie.find().sort({ rating: -1 });
        res.json(movies);
    } catch (error) {
        console.error('Erro ao carregar filmes ordenados:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// GET /api/movies/:id - obter UMA película específica
app.get('/api/movies/:id', checkLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findById(id);
        if (!movie) return res.status(404).json({ erro: 'Filme não encontrado' });
        res.json(movie);
    } catch (error) {
        console.error('Erro ao carregar filme:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// GET /api/movies - retorna todos os filmes
app.get('/api/movies', checkLogin, async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (error) {
        console.error('Erro ao carregar filmes:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// POST /api/movies - adicionar um filme novo
app.post('/api/movies', checkLogin, async (req, res) => {
    try {
        const { title, year, genre, rating, watched } = req.body;
        if (!title) return res.status(400).json({ erro: 'Título é obrigatório' });

        const newMovie = new Movie({
            title,
            year,
            genre,
            rating,
            watched: watched === true || watched === 'true', // força booleano
        });

        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (error) {
        console.error('Erro ao criar filme:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// PUT /api/movies/:id - editar um filme existente
app.put('/api/movies/:id', checkLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, year, genre, rating, watched } = req.body;

        const updatedMovie = await Movie.findByIdAndUpdate(
            id,
            {
                title,
                year,
                genre,
                rating,
                watched: watched === true || watched === 'true', // força booleano
            },
            { new: true }
        );

        if (!updatedMovie) return res.status(404).json({ erro: 'Filme não encontrado' });

        res.json(updatedMovie);
    } catch (error) {
        console.error('Erro ao atualizar filme:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// DELETE /api/movies/:id - apagar filme
app.delete('/api/movies/:id', checkLogin, async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMovie = await Movie.findByIdAndDelete(id);
        if (!deletedMovie) return res.status(404).json({ erro: 'Filme não encontrado' });

        res.json(deletedMovie);
    } catch (error) {
        console.error('Erro ao deletar filme:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// ===== NEXT.JS HANDLER =====
app.use((req, res) => handle(req, res));

// ===== INICIALIZAÇÃO DO SERVIDOR =====
const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await connectDB(); // conecta MongoDB
        await nextApp.prepare(); // prepara Next.js
        app.listen(PORT, () => {
            console.log(`Servidor Next.js + Express a correr em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

iniciarServidor();
