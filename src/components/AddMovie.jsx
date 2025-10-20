import { useState } from 'react';

export default function AddMovie({ onAdd }) {
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        title: '',
        year: '',
        genre: '',
        rating: '',
        watched: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleOpen = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setForm({ title: '', year: '', genre: '', rating: '', watched: false });
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
            const res = await fetch('/api/movies', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: form.title,
                    year: form.year ? Number(form.year) : undefined,
                    genre: form.genre,
                    rating: form.rating ? Number(form.rating) : undefined,
                    watched: form.watched,
                }),
            });

            if (!res.ok) throw new Error('Error ao adicionar o filme');

            if (onAdd) onAdd();
            handleClose();
        } catch (err) {
            console.error(err);
            setError('Error ao adicionar o filme');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Botón para abrir modal */}
            <button
                onClick={handleOpen}
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-5 rounded-xl transition-all duration-300 shadow-md hover:scale-105 mb-6"
            >
                + Adicionar o filme
            </button>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl p-6 border border-yellow-500 w-full max-w-md mx-4">
                        <h2 className="text-2xl font-extrabold text-yellow-400 mb-4 text-center">
                            🎥 Adicionar o filme
                        </h2>

                        {error && (
                            <p className="bg-red-600 text-white px-4 py-2 rounded mb-4 text-center animate-pulse">
                                {error}
                            </p>
                        )}

                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <input
                                type="text"
                                placeholder="Título *"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Ano"
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <input
                                type="text"
                                placeholder="Género"
                                value={form.genre}
                                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <input
                                type="number"
                                placeholder="Rating (0-10)"
                                value={form.rating}
                                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                min="0"
                                max="10"
                                step="0.1"
                            />
                            <label className="flex items-center gap-2 text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={form.watched}
                                    onChange={(e) =>
                                        setForm({ ...form, watched: e.target.checked })
                                    }
                                    className="w-5 h-5 text-yellow-400 rounded focus:ring-2 focus:ring-yellow-400"
                                />
                                Vizualizado
                            </label>
                            <div className="flex justify-between mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-2 px-4 rounded-xl transition-all duration-300 ${loading ? 'bg-yellow-300 cursor-not-allowed animate-pulse' : ''
                                        }`}
                                >
                                    {loading ? 'A adicionar...' : 'Adicionar'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl transition-all duration-300"
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