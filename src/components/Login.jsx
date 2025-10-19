import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
    // Hooks e states
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Função para manejar o login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
                credentials: 'same-origin',
            });

            if (res.ok) {
                setTimeout(() => {
                    router.push('/dashboard');
                }, 500);
            } else {
                const data = await res.json();
                setError(data.error);
                setLoading(false);
            }
        } catch (err) {
            setError('Erro ao conectar ao servidor.');
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4"
            style={{
                background: "linear-gradient(300deg,#00bfff,#ff4c68,#ef8172)",
                backgroundSize: "180% 180%",
                animation: "gradientAnimation 18s ease infinite",
                backgroundPosition: "0% 50%",
            }}
        >
            <div className="relative z-10 w-full max-w-md bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-10 border border-yellow-500">
                <h1 className="text-4xl font-extrabold text-yellow-400 mb-6 text-center drop-shadow-lg">
                    MovieApp 🎬
                </h1>

                {error && (
                    <p className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center animate-pulse">
                        {error}
                    </p>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-gray-200 mb-2 font-medium" htmlFor="username">
                            Utilizador
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="O teu utilizador"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-inner"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-gray-200 mb-2 font-medium" htmlFor="password">
                            Palavra-passe
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="A tua palavra-passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300 shadow-inner"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-xl text-lg font-bold text-gray-900 transition-all duration-300 ${loading
                            ? 'bg-yellow-300 cursor-not-allowed animate-pulse'
                            : 'bg-yellow-400 hover:bg-yellow-500 shadow-lg hover:scale-105'
                            }`}
                    >
                        {loading ? 'Cargando...' : 'Fazer Login'}
                    </button>
                </form>

                <p className="text-gray-300 mt-6 text-center text-sm">
                    Bem-vindo a MovieApp 🎥
                </p>
                <p className="text-gray-400 mt-2 text-center text-xs">
                    Usuario teste: admin / Palavra-passe: 1234
                </p>
            </div>

            {/* Keyframes de animação para o gradiente */}
            <style jsx>{`
            @keyframes gradientAnimation {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
            }
        `}</style>
        </div >
    );
}

