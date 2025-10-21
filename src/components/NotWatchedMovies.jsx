import { useState } from 'react';
import { fetchNotWatchedMoviesAPI } from '@/services/api';

const normalizeWatched = (v) => v === true || v === 'true';

export default function NotWatchedMovies({ onShow, isActive }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFetch = async () => {
        setError('');

        if (isActive) {
            onShow(null); 
            return;
        }

        setLoading(true);
        try {
            const data = await fetchNotWatchedMoviesAPI();
            // 🔒 Fallback defensivo
            const safe = data.filter((m) => !normalizeWatched(m.watched));
            onShow(safe);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar filmes não assistidos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handleFetch}
                disabled={loading}
                className={`${isActive
                        ? 'bg-gray-700 text-yellow-400'
                        : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                    } font-bold py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:scale-105`}
            >
                {loading ? 'A carregar...' : isActive ? '🔙 Voltar à lista normal' : '⏳ Ver filmes por ver'}
            </button>

            {error && (
                <p className="bg-red-600 text-white px-4 py-2 rounded mt-3 text-center">
                    {error}
                </p>
            )}
        </div>
    );
}
