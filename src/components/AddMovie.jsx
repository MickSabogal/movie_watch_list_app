// Importações necessárias: Hook e chamada ao API

import { useState } from 'react';
import { addMovieAPI } from '@/services/api';

export default function AddMovie({ onAdd }) {
    // Estado do formulário
    const [form, setForm] = useState({
        title: '',
        year: '',
        genre: '',
        rating: null,
        watched: false,
    });
    // Estado de carregamento e erros
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title.trim()) {
            setError('O título é obrigatório!');
            return;
        }

        setLoading(true);
        try {
            // Chamada ao API para adicionar o filme
            await addMovieAPI({
                title: form.title,
                year: form.year ? Number(form.year) : undefined,
                genre: form.genre,
                rating: form.rating !== null ? Number(form.rating) : undefined,
                watched: form.watched,
            });

            // Limpia formulario y refresca lista
            setForm({
                title: '',
                year: '',
                genre: '',
                rating: null,
                watched: false,
            });
            // notifica ao dashboard para fazer refresh
            if (onAdd) onAdd();
        } catch (err) {
            console.error(err);
            setError('Erro ao adicionar o filme');
        } finally {
            setLoading(false);
        }
    };

    // Renderização do formulário
    return (
        <form
            onSubmit={handleSubmit}
            className="bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-yellow-500 mb-6 w-full max-w-md mx-auto"
        >
            <h2 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center">
                🎥 Adicionar Filme
            </h2>

            {/* ⚠️ Mensaje de error */}
            {error && (
                <p className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center animate-pulse">
                    {error}
                </p>
            )}

            <div className="space-y-4">
                {/* 🔸 Título */}
                <input
                    type="text"
                    placeholder="Título *"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                    required
                />

                {/* 🔸 Ano (corregido: no contador) */}
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="\d{4}"
                    placeholder="Ano (ex: 2024)"
                    value={form.year}
                    onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setForm({ ...form, year: val });
                    }}
                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                />

                {/* 🔸 Género */}
                <input
                    type="text"
                    placeholder="Género"
                    value={form.genre}
                    onChange={(e) => setForm({ ...form, genre: e.target.value })}
                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all duration-300"
                />

                {/* 🔸 Rating con botones 0–10 */}
                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                        ⭐ Avaliação (0–10)
                    </label>
                    <div className="grid grid-cols-11 gap-1">
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => setForm({ ...form, rating: num })}
                                className={`py-2 px-1 rounded-lg font-bold text-xs transition-all duration-200 ${form.rating === num
                                        ? 'bg-yellow-400 text-gray-900 scale-110 shadow-lg'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 🔹 Checkbox */}
                <label className="flex items-center gap-3 text-gray-200">
                    <input
                        type="checkbox"
                        checked={form.watched}
                        onChange={(e) =>
                            setForm({ ...form, watched: e.target.checked })
                        }
                        className="w-5 h-5 text-yellow-400 rounded focus:ring-2 focus:ring-yellow-400"
                    />
                    Já assistido
                </label>

                {/* 🔹 Botón enviar */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-lg font-bold text-gray-900 transition-all duration-300 ${loading
                            ? 'bg-yellow-300 cursor-not-allowed animate-pulse'
                            : 'bg-yellow-400 hover:bg-yellow-500 shadow-lg hover:scale-105'
                        }`}
                >
                    {loading ? 'A adicionar...' : 'Adicionar Filme'}
                </button>
            </div>

            <p className="text-gray-400 mt-6 text-center text-sm">
                Todos os campos são importantes para melhor catalogação 🎬
            </p>
        </form>
    );
}
