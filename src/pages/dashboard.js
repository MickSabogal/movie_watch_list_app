import { React, useState } from 'react';
import { useRouter } from 'next/router';
import AddMovie from '@/components/AddMovie';
import AllMovies from '@/components/AllMovies';
import EditMovie from '@/components/EditMovie';
import MoviesByRating from '@/components/MoviesByRating';
import WatchedMovies from '@/components/WatchedMovies';
import NotWatchedMovies from '@/components/NotWatchedMovies';

export default function Dashboard() {
    const router = useRouter();
    const [refresh, setRefresh] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null);
    const [filteredMovies, setFilteredMovies] = useState(null);
    const [activeFilter, setActiveFilter] = useState(null); // 🔹 Solo un filtro activo

    const handleLogout = () => router.push('/');
    const handleRefresh = () => setRefresh((prev) => !prev);
    const handleCloseEdit = () => setEditingMovie(null);

    // 🔹 Manejo de filtros (solo uno a la vez)
    const handleShowFiltered = (movies, filterName) => {
        if (activeFilter === filterName) {
            // Si el filtro ya está activo → vuelve a la lista normal
            setFilteredMovies(null);
            setActiveFilter(null);
        } else {
            setFilteredMovies(movies);
            setActiveFilter(filterName);
        }
    };

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-start px-4 py-8"
            style={{
                background: 'linear-gradient(300deg,#00bfff,#ff4c68,#ef8172)',
                backgroundSize: '180% 180%',
                animation: 'gradientAnimation 18s ease infinite',
                backgroundPosition: '0% 50%',
            }}
        >
            <div className="w-full max-w-6xl bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-yellow-500 flex flex-col">

                {/* 🔹 Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 text-center sm:text-left">
                        🎬 Dashboard de Filmes
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-6 rounded-xl transition-all duration-300 shadow-md hover:scale-105 w-full sm:w-auto"
                    >
                        Logout
                    </button>
                </div>

                {/* 🔹 Formulário */}
                <AddMovie onAdd={handleRefresh} />

                {/* 🔹 Filtros (solo uno puede estar activo) */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <MoviesByRating
                        onShow={(movies) => handleShowFiltered(movies, 'rating')}
                        isActive={activeFilter === 'rating'}
                    />
                    <WatchedMovies
                        onShow={(movies) => handleShowFiltered(movies, 'watched')}
                        isActive={activeFilter === 'watched'}
                    />
                    <NotWatchedMovies
                        onShow={(movies) => handleShowFiltered(movies, 'notWatched')}
                        isActive={activeFilter === 'notWatched'}
                    />
                </div>

                {/* 🔹 Lista (condicional) */}
                {filteredMovies ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {filteredMovies.map((m) => (
                            <li
                                key={m._id}
                                className="bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl p-5 border border-yellow-400/30 hover:scale-105 hover:border-yellow-400 transition-all duration-300"
                            >
                                <h2
                                    className="text-xl font-bold text-yellow-400 mb-2 truncate"
                                    title={m.title}
                                >
                                    {m.title}
                                </h2>
                                <div className="space-y-1 text-gray-300 mb-3">
                                    <p>🎬 Género: {m.genre || 'Não especificado'}</p>
                                    <p>📅 Ano: {m.year || 'Desconhecido'}</p>
                                    <p>⭐ Rating: {m.rating || 'N/A'}/10</p>
                                </div>
                                <p
                                    className={`mb-4 font-semibold text-sm ${m.watched ? 'text-green-400' : 'text-red-400'
                                        }`}
                                >
                                    {m.watched ? '✅ Visto' : '⏳ Por ver'}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <AllMovies refresh={refresh} onEdit={setEditingMovie} />
                )}
            </div>

            {/* 🔹 Modal de edição */}
            {editingMovie && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="w-full max-w-lg relative">
                        <button
                            onClick={handleCloseEdit}
                            className="absolute -top-6 -right-2 text-yellow-400 hover:text-yellow-300 text-3xl font-bold"
                        >
                            ×
                        </button>
                        <EditMovie
                            movie={editingMovie}
                            onClose={handleCloseEdit}
                            onUpdated={handleRefresh}
                        />
                    </div>
                </div>
            )}

            {/* 🔹 Fondo animado */}
            <style jsx>{`
                @keyframes gradientAnimation {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}</style>
        </div>
    );
}
