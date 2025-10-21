// Importações necessárias: Hook e chamada ao API

import { useState } from 'react';
import { updateMovieAPI } from '@/services/api';

// Exportação do componente EditMovie
export default function EditMovie({ movie, onClose, onUpdated }) {
    // Estado do formulário inicializado com os dados do filme
    const [form, setForm] = useState({
        title: movie.title || '',
        year: movie.year || '',
        genre: movie.genre || '',
        rating: movie.rating ?? '',
        watched: Boolean(movie.watched), // ✅ asegura valor booleano real
    });

    // Estado de carregamento e erros
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Manejo de cambios en el formulario
    const handleChange = (field, value) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Manejo del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await updateMovieAPI(movie._id, form);
            if (onUpdated) onUpdated(); // ✅ refresca lista
            onClose(); // ✅ cierra modal
        } catch (err) {
            console.error(err);
            setError('Erro ao atualizar o filme');
        } finally {
            setLoading(false);
        }
    };

    // Renderização do formulário de edição
    return (
        <div className="bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-yellow-500 w-full">
            <h2 className="text-3xl font-extrabold text-yellow-400 mb-6 text-center">
                ✏️ Editar Filme
            </h2>

            {error && (
                <p className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center">
                    {error}
                </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Título"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400"
                    required
                />

                <input
                    type="text"
                    placeholder="Ano"
                    value={form.year}
                    onChange={(e) => handleChange('year', e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400"
                />

                <input
                    type="text"
                    placeholder="Gênero"
                    value={form.genre}
                    onChange={(e) => handleChange('genre', e.target.value)}
                    className="w-full px-5 py-3 rounded-xl bg-gray-800 text-white focus:ring-2 focus:ring-yellow-400"
                />

                {/* Rating con botones del 0 al 10 */}
                <div>
                    <label className="block text-gray-300 mb-2 text-sm font-medium">
                        ⭐ Avaliação (0-10)
                    </label>
                    <div className="grid grid-cols-11 gap-1">
                        {[...Array(11).keys()].map((num) => (
                            <button
                                key={num}
                                type="button"
                                onClick={() => handleChange('rating', num)}
                                className={`py-2 px-1 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 ${form.rating === num
                                        ? 'bg-yellow-400 text-gray-900 scale-110 shadow-lg'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Checkbox "Já assistido" */}
                <label className="flex items-center gap-3 text-gray-200">
                    <input
                        type="checkbox"
                        checked={form.watched}
                        onChange={(e) => handleChange('watched', e.target.checked)}
                        className="w-5 h-5 text-yellow-400 rounded focus:ring-2 focus:ring-yellow-400"
                    />
                    Já assistido
                </label>

                {/* Botones */}
                <div className="flex justify-between gap-3 mt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`flex-1 py-3 rounded-xl text-lg font-bold text-gray-900 transition-all duration-300 ${loading
                                ? 'bg-yellow-300 cursor-not-allowed animate-pulse'
                                : 'bg-yellow-400 hover:bg-yellow-500 shadow-lg hover:scale-105'
                            }`}
                    >
                        {loading ? 'A guardar...' : 'Salvar Alterações'}
                    </button>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    );
}
