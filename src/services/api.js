// GET /api/movies - lista todas (filtros + orden)
export async function fetchMoviesAPI() {
    try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Error ao carregar os filmes');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Error ao carregar os filmes');
    }
}

// DELETE /api/movies/:id - apagar um filme
export async function handleDeleteAPI(id) {
    try {
        const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Error ao apagar o filme');
        return true;
    } catch (err) {
        console.error(err);
        throw new Error('Error ao apagar o filme');
    }
}

// POST /api/movies - adicionar um filme
export async function addMovieAPI(movieData) {
    try {
        const res = await fetch('/api/movies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: movieData.title,
                year: movieData.year ? Number(movieData.year) : undefined,
                genre: movieData.genre,
                rating: movieData.rating ? Number(movieData.rating) : undefined,
                watched: movieData.watched,
            }),
        });

        if (!res.ok) throw new Error('Error ao adicionar o filme');

        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Error ao adicionar o filme');
    }
}

// PUT /api/movies/:id - atualizar um filme
export async function updateMovieAPI(id, movieData) {
    try {
        const res = await fetch(`/api/movies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: movieData.title,
                year: movieData.year ? Number(movieData.year) : undefined,
                genre: movieData.genre,
                rating: movieData.rating !== null ? Number(movieData.rating) : undefined,
                watched: movieData.watched,
            }),
        });

        if (!res.ok) throw new Error('Error ao atualizar o filme');

        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Error ao atualizar o filme');
    }
}
