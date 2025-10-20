// GET /api/movies - lista todas (filtros + orden)

export async function fetchMoviesAPI(){
    try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Error ao carregar os filmes');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Error ao carregar os filmes');
    }
};

//DELETE /api/movies/:id - apagar um filme

export async function handleDeleteAPI(id) {
    try {
        const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error ao apagar o filme');
        return true;
    } catch (err) {
        console.error(err);
        throw new Error('Error ao apagar o filme');
    }
};

