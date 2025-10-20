import { React, useState } from 'react';
import { useRouter } from 'next/router';
import AddMovie from '@/components/AddMovie';
import AllMovies from '@/components/AllMovies';
import EditMovie from '@/components/EditMovie';

export default function Dashboard() {
    const router = useRouter();
    const [refresh, setRefresh] = useState(false);
    const [editingMovie, setEditingMovie] = useState(null); // 🔹 Nuevo estado para editar

    const handleLogout = () => {
        // lógica de logout 
        router.push('/');
    };

    // 🔹 Forzar recarga da lista após adicionar/editar
    const handleRefresh = () => setRefresh((prev) => !prev);

    // 🔹 Fechar o modal de edição
    const handleCloseEdit = () => setEditingMovie(null);

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
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-yellow-400 mb-4 sm:mb-0">
                        🎬 Dashboard filmes
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-5 rounded-xl transition-all duration-300 shadow-md hover:scale-105"
                    >
                        Logout
                    </button>
                </div>

                {/* Botão para adicionar filme */}
                <AddMovie onAdd={handleRefresh} />

                {/* Lista de filmes (agora com suporte à edição) */}
                <AllMovies refresh={refresh} onEdit={setEditingMovie} />
            </div>

            {/* 🔹 Modal de edição */}
            {editingMovie && (
                <EditMovie
                    movie={editingMovie}
                    onClose={handleCloseEdit}
                    onUpdated={handleRefresh}
                />
            )}

            {/* Animação do fundo */}
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
