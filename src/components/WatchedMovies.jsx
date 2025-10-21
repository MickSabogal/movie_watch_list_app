// Importações necessarias: Hook e chamada ao API

import { useState } from 'react';
import { fetchWatchedMoviesAPI } from '@/services/api';

// Normaliza valor de 'watched' para booleano
const normalizeWatched = (v) => v === true || v === 'true';

// Exportação do componente WatchedMovies
export default function WatchedMovies({ onShow, isActive }) {
    // Estados de carregamento e erros
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Função para buscar filmes assistidos
    const handleFetch = async () => {
        setError('');

        // Se já está ativo, volta à lista normal
        if (isActive) {
            onShow(null); 
            return;
        }

        // Busca filmes assistidos
        setLoading(true);
        
        // Chamada ao API
        try {
            const data = await fetchWatchedMoviesAPI();
            // 🔒 Fallback defensivo por si vinieran registros mal tipados
            const safe = data.filter((m) => normalizeWatched(m.watched));
            onShow(safe);
        } catch (err) {
            console.error(err);
            setError('Erro ao carregar filmes assistidos');
        } finally {
            setLoading(false);
        }
    };

    // Renderização do componente
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
                {loading ? 'A carregar...' : isActive ? '🔙 Voltar à lista normal' : '🎬 Ver filmes assistidos'}
            </button>

            {error && (
                <p className="bg-red-600 text-white px-4 py-2 rounded mt-3 text-center">
                    {error}
                </p>
            )}
        </div>
    );
}
