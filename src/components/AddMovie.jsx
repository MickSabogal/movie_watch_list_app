import { useState } from 'react';
import { addMovieAPI } from '@/services/api';

export default function AddMovie({ onAdd }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: '',
        year: '',
        genre: '',
        rating: null,
        watched: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOpen = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setForm({ title: '', year: '', genre: '', rating: null, watched: false });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!form.title.trim()) {
            setError('O título é obrigatório!');
            return;
        }

        setLoading(true);
        try {
            await addMovieAPI(form);
            if (onAdd) onAdd();
            handleClose();
        } catch (err) {
            console.error(err);
            setError('Erro ao adicionar o filme');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Botón que abre el modal */}
            <button
                onClick={handleOpen}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-5 rounded-xl transition-all duration-300 shadow-md hover:scale-105 mb-6"
            >
                + Adicionar Filme
            </button>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
                    style={{ paddingTop: '2rem' }} // evita que se pegue a la barra del navegador
                >
                    <div
                        className="relative bg-gray-900/95 rounded-3xl shadow-2xl border-2 border-yellow-500 w-full max-w-md mx-auto p-6 overflow-hidden animate-fadeIn"
                        style={{
                            maxHeight: '85vh',
                            overflowY: 'auto',
                        }}
                    >
                        <h2 className="text-2xl font-extrabold text-yellow-400 mb-4 text-center">
                            🎥 Adicionar Filme
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
                                placeholder="Género"
                                value={form.genre}
                                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />

                            {/* Rating */}
                            <div>
                                <label className="block text-gray-300 mb-2 text-sm font-medium">
                                    ⭐ Avaliação (0–10)
                                </label>
                                <div className="grid grid-cols-11 gap-1">
                                    {[...Array(11).keys()].map((num) => (
                                        <button
                                            key={num}
                                            type="button"
                                            onClick={() => setForm({ ...form, rating: num })}
                                            className={`py-2 rounded-lg font-bold text-xs transition-all duration-200 ${form.rating === num
                                                ? 'bg-yellow-400 text-gray-900 scale-110 shadow-lg'
                                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:scale-105'
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <label className="flex items-center gap-2 text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={form.watched}
                                    onChange={(e) => setForm({ ...form, watched: e.target.checked })}
                                    className="w-5 h-5 text-yellow-400 rounded focus:ring-2 focus:ring-yellow-400"
                                />
                                Visualizado
                            </label>

                            <div className="flex justify-between gap-3 mt-4 pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 ${loading ? 'bg-yellow-300 cursor-not-allowed animate-pulse' : ''
                                        }`}
                                >
                                    {loading ? 'Adicionando...' : 'Adicionar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
