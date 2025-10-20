import { React, useState } from 'react';
import { useRouter } from 'next/router';
import AddMovie from '@/components/AddMovie';
import AllMovies from '@/components/AllMovies';

export default function Dashboard() {
    const router = useRouter();
    const [refresh, setRefresh] = useState(false);

    const handleLogout = () => {
        // lógica de logout 
        router.push('/');
    };

    const handleRefresh = () => setRefresh((prev) => !prev);

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
                        LogOut
                    </button>
                </div>

                {/* Botão para adicionar filme */}
                <AddMovie onAdd={handleRefresh} />

                {/* Lista de películas */}
                <AllMovies refresh={refresh} />
            </div>

            {/* Animación del fondo */}
            <style jsx>{`
        @keyframes gradientAnimation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
        </div>
    );
}
