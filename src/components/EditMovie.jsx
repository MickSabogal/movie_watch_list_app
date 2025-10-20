import { useState, useEffect } from 'react';
import { updateMovieAPI } from '@/services/api';

export default function EditMovie({ movie, onClose, onUpdated }) {
    const [form, setForm] = useState({
        title: '',
        year: '',
        genre: '',
        rating: null,
        watched: false,
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    // 🔹 Cargar datos del filme seleccionado
    useEffect(() => {
        if (movie) {
            setForm({
                title: movie.title || '',
                year: movie.year || '',
                genre: movie.genre || '',
                rating: movie.rating ?? null,
                watched: movie.watched || false,
            });
        }
    }, [movie]);

    // 🔹 Guardar cambios
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);

        try {
            await updateMovieAPI(movie._id, form);
            onUpdated(); // 🔄 refresca la lista
            onClose(); // ❌ cierra el modal
        } catch (err) {
            console.error(err);
            setError('Erro ao atualizar o filme.');
        } finally {
            setSaving(false);
        }
    };

    if (!movie) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900/95 border-2 border-yellow-500/40 rounded-3xl shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-extrabold text-yellow-400 mb-4 text-center">
                    ✏️ Editar Filme
                </h2>

                {error && (
                    <p className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center animate-pulse">
                        {error}
                    </p>
                )}

                <form className="space-y-3" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Título *"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        required
                    />

                    <input
                        type="text"
                        placeholder="Ano"
                        value={form.year}
                        onChange={(e) => setForm({ ...form, year: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    <input
                        type="text"
                        placeholder="Gênero"
                        value={form.genre}
                        onChange={(e) => setForm({ ...form, genre: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />

                    {/* ⭐ Rating */}
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
                                    className={`py-2 px-0.5 rounded-lg font-bold text-xs transition-all duration-200 ${form.rating === num
                                            ? 'bg-yellow-400 text-gray-900 scale-110 shadow-lg'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                                        }`}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Checkbox */}
                    <label className="flex items-center gap-2 text-gray-200">
                        <input
                            type="checkbox"
                            checked={form.watched}
                            onChange={(e) => setForm({ ...form, watched: e.target.checked })}
                            className="w-5 h-5 text-yellow-400 rounded focus:ring-2 focus:ring-yellow-400"
                        />
                        Já assistido
                    </label>

                    {/* 🔘 Botones */}
                    <div className="flex justify-between gap-3 mt-4 pt-2">
                        <button
                            type="submit"
                            disabled={saving}
                            className={`flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 ${saving ? 'bg-yellow-300 cursor-not-allowed animate-pulse' : ''
                                }`}
                        >
                            {saving ? 'A atualizar...' : 'Guardar'}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
