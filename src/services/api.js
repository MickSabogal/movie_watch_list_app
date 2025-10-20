// ===============================
// 🎬 SERVICIOS DE API DE FILMES
// ===============================

// 🔹 OBTENER TODOS LOS FILMES
export async function fetchMoviesAPI() {
    try {
        const res = await fetch('/api/movies');
        if (!res.ok) throw new Error('Erro ao carregar os filmes');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Erro ao carregar os filmes');
    }
}

// 🔹 APAGAR UM FILME
export async function handleDeleteAPI(id) {
    try {
        const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao apagar o filme');
        return true;
    } catch (err) {
        console.error(err);
        throw new Error('Erro ao apagar o filme');
    }
}

// 🔹 ADICIONAR UM NOVO FILME
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
                watched: Boolean(movieData.watched),
            }),
        });

        if (!res.ok) throw new Error('Erro ao adicionar o filme');

        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Erro ao adicionar o filme');
    }
}

// 🔹 ATUALIZAR UM FILME EXISTENTE
export async function updateMovieAPI(id, movieData) {
    try {
        const res = await fetch(`/api/movies/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: movieData.title,
                year: movieData.year ? Number(movieData.year) : undefined,
                genre: movieData.genre,
                rating:
                    movieData.rating !== null && movieData.rating !== undefined
                        ? Number(movieData.rating)
                        : undefined,
                watched: Boolean(movieData.watched),
            }),
        });

        if (!res.ok) throw new Error('Erro ao atualizar o filme');

        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Erro ao atualizar o filme');
    }
}

// 🔹 FILMES ORDENADOS POR RATING (DESC)
export async function fetchMoviesByRatingAPI() {
    try {
        const res = await fetch('/api/movies/sorted');
        if (!res.ok) throw new Error('Erro ao carregar filmes ordenados por rating');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Erro ao carregar filmes por rating');
    }
}

// 🔹 FILMES NÃO ASSISTIDOS
export async function fetchNotWatchedMoviesAPI() {
    try {
        const res = await fetch('/api/movies/notwatched');
        if (!res.ok) throw new Error('Erro ao carregar filmes não assistidos');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Erro ao carregar filmes não assistidos');
    }
}

// 🔹 FILMES ASSISTIDOS
export async function fetchWatchedMoviesAPI() {
    try {
        const res = await fetch('/api/movies/watched');
        if (!res.ok) throw new Error('Erro ao carregar filmes assistidos');
        const data = await res.json();
        return data;
    } catch (err) {
        console.error(err);
        throw new Error('Erro ao carregar filmes assistidos');
    }
}
