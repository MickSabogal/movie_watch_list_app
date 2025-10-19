// ===== CONSTANTES FIXAS =====
const express = require('express');
const next = require('next');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./lib/mongodb');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const app = express();
app.use(cors());
app.use(express.json());

// Esta constante é relativa às coleções da tua base de dados e deves acrescentar mais se for o caso
const Movie = require('./models/Movie');

// ================= LOGIN SIMPLES =================

const LOGIN_USER = { username: 'admin', password: '1234'};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === LOGIN_USER.username && password === LOGIN_USER.password){
        // Cookies de sessão simples salvas (expiram em 1 hora)
        res.cookie('loggedIn', true, { httpOnly: true, maxAge: 3600000 });
        return res.json({ message: 'Login bem-sucedido' });
    }else {
        return res.status(401).json({ error: 'Credenciais inválidas' });
    }
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('loggedIn');
    res.json({ message: 'Logout bem-sucedido' });
});

// Middleware para proteger rotas da informação
function checkLogin(req, res, nextMiddleware) {
    if (req.cookies.loggedIn) {
        nextMiddleware();
    } else {
        res.status(401).json({ error: 'Não autorizado' });
    }
}

// ===== ENDPOINTS DA API =====

// GET /api/nomes - Retorna todos os 'movies' existentes
app.get('/api/movies', async (req, res) => {
    try {
        const movies = await Movie.find().sort({ movie: 1 });
        res.json(movies);
    } catch (error) {
        console.error('Erro ao carregar movies:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});

// POST /api/nomes - Adiciona um novo nome à coleção "nomes"
app.post('/api/nomes', async (req, res) => {
    try {
        const { nome } = req.body;

        if (!nome || !nome.trim()) {
            return res.status(400).json({ erro: 'Nome é obrigatório' });
        }

        const novoNome = new Nome({ nome: nome.trim() });
        const nomeSalvo = await novoNome.save();
        res.status(201).json(nomeSalvo);
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ erro: 'Este nome já existe' });
        }
        console.error('Erro ao criar nome:', error);
        res.status(500).json({ erro: 'Erro interno do servidor' });
    }
});



// ===== INICIALIZAÇÃO DO SERVIDOR (também não se deve mexer)=====

app.use((req, res) => {
    return handle(req, res);
});

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    try {
        await connectDB();
        await nextApp.prepare();
        app.listen(PORT, () => {
            console.log(`Servidor Next.js + Express a correr em http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Erro ao iniciar servidor:', error);
        process.exit(1);
    }
};

iniciarServidor();