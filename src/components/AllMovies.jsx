import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { handleDeleteAPI, fetchMoviesAPI } from '@/services/api.js';


export default function AllMovies({ refresh }) {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    async function fetchMovies() {
        try {
            setLoading(true);
            const res = await fetchMoviesAPI();
            setMovies(res);
        } catch (err) {
            setError(err.message);
        }}
    useEffect(() => {
        fetchMovies();
    }, [refresh]);

    if (loading) {
        return (
            <p className="text-yellow-300 text-center animate-pulse text-lg">
                A carregar o filmes...
            </p>
        );
    }

    if (error) {
        return (
            <p className="bg-red-600 text-white px-4 py-2 rounded text-center">
                {error}
            </p>
        );
    }

    if (movies.length === 0) {
        return (
            <p className="text-gray-300 text-center text-lg">
                Não tem filmes para mostrar. ¡Adiciona o teu primeiro filme!
            </p>
        );
    }

    return (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((m) => (
                <li
                    key={m._id}
                    className="bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-yellow-400/30 hover:scale-105 hover:border-yellow-400 transition-all duration-300"
                >
                    <h2 className="text-xl font-bold text-yellow-400 mb-2 truncate" title={m.title}>
                        {m.title}
                    </h2>
                    <div className="space-y-1 text-gray-300 mb-3">
                        <p>🎬 Género: {m.genre || 'Não especificado'}</p>
                        <p>📅 Ano: {m.year || 'Desconhecido'}</p>
                        <p>⭐ Rating: {m.rating || 'N/A'}/10</p>
                    </div>
                    <p className={`mb-4 font-semibold text-sm ${m.watched ? 'text-green-400' : 'text-red-400'}`}>
                        {m.watched ? '✅ Visto' : '⏳ Por ver'}
                    </p>
                    <div className="flex justify-between gap-2">
                        <button
                            onClick={() => router.push(`/edit/${m._id}`)}
                            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-3 rounded-xl text-sm transition-all duration-300 hover:scale-105"
                        >
                            ✏️ Editar
                        </button>
                        <button
                            onClick={() => handleDeleteAPI(m._id)}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-xl text-sm transition-all duration-300 hover:scale-105"
                        >
                            🗑️ Apagar
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
}