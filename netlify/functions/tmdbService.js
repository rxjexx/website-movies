const axios = require('axios');

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    timeout: 10000
});

// Simple in-memory cache for fast data retrieval
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

function getCacheKey(endpoint, params = {}) {
    return `${endpoint}:${JSON.stringify(params)}`;
}

function getFromCache(key) {
    const cached = cache.get(key);
    if (cached && cached.expiry > Date.now()) {
        console.log('Cache hit:', key);
        return cached.data;
    }
    if (cached) {
        cache.delete(key);
    }
    return null;
}

function setCache(key, data) {
    cache.set(key, {
        data,
        expiry: Date.now() + CACHE_DURATION
    });
}

class TMDBService {
    /**
     * Get trending movies
     */
    async getTrendingMovies(timeWindow = 'week') {
        try {
            const cacheKey = getCacheKey(`trending-movie-${timeWindow}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get(`/trending/movie/${timeWindow}`, {
                params: {
                    api_key: TMDB_API_KEY
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching trending movies:', error.message);
            throw new Error('Failed to fetch trending movies');
        }
    }

    /**
     * Get popular movies
     */
    async getPopularMovies(page = 1) {
        try {
            const cacheKey = getCacheKey(`popular-movie-${page}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get('/movie/popular', {
                params: {
                    api_key: TMDB_API_KEY,
                    page: page
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular movies:', error.message);
            throw new Error('Failed to fetch popular movies');
        }
    }

    /**
     * Get top rated movies
     */
    async getTopRatedMovies(page = 1) {
        try {
            const cacheKey = getCacheKey(`top-rated-movie-${page}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get('/movie/top_rated', {
                params: {
                    api_key: TMDB_API_KEY,
                    page: page
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching top rated movies:', error.message);
            throw new Error('Failed to fetch top rated movies');
        }
    }

    /**
     * Get upcoming movies
     */
    async getUpcomingMovies(page = 1) {
        try {
            const cacheKey = getCacheKey(`upcoming-movie-${page}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get('/movie/upcoming', {
                params: {
                    api_key: TMDB_API_KEY,
                    page: page
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching upcoming movies:', error.message);
            throw new Error('Failed to fetch upcoming movies');
        }
    }

    /**
     * Get trending TV shows
     */
    async getTrendingShows(timeWindow = 'week') {
        try {
            const cacheKey = getCacheKey(`trending-show-${timeWindow}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get(`/trending/tv/${timeWindow}`, {
                params: {
                    api_key: TMDB_API_KEY
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching trending shows:', error.message);
            throw new Error('Failed to fetch trending shows');
        }
    }

    /**
     * Get popular TV shows
     */
    async getPopularShows(page = 1) {
        try {
            const cacheKey = getCacheKey(`popular-show-${page}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get('/tv/popular', {
                params: {
                    api_key: TMDB_API_KEY,
                    page: page
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching popular shows:', error.message);
            throw new Error('Failed to fetch popular shows');
        }
    }

    /**
     * Search movies and shows
     */
    async search(query, page = 1) {
        try {
            const cacheKey = getCacheKey(`search-${query}-${page}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get('/search/multi', {
                params: {
                    api_key: TMDB_API_KEY,
                    query: query,
                    page: page
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error searching:', error.message);
            throw new Error('Failed to search');
        }
    }

    /**
     * Get movie details
     */
    async getMovieDetails(movieId) {
        try {
            const cacheKey = getCacheKey(`movie-details-${movieId}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get(`/movie/${movieId}`, {
                params: {
                    api_key: TMDB_API_KEY
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie details:', error.message);
            throw new Error('Failed to fetch movie details');
        }
    }

    /**
     * Get TV show details
     */
    async getShowDetails(showId) {
        try {
            const cacheKey = getCacheKey(`show-details-${showId}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get(`/tv/${showId}`, {
                params: {
                    api_key: TMDB_API_KEY
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching show details:', error.message);
            throw new Error('Failed to fetch show details');
        }
    }

    /**
     * Get movies by genre
     */
    async getMoviesByGenre(genreId, page = 1) {
        try {
            const cacheKey = getCacheKey(`genre-movie-${genreId}-${page}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get('/discover/movie', {
                params: {
                    api_key: TMDB_API_KEY,
                    with_genres: genreId,
                    page: page
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching movies by genre:', error.message);
            throw new Error('Failed to fetch movies by genre');
        }
    }

    /**
     * Get genres
     */
    async getGenres(type = 'movie') {
        try {
            const cacheKey = getCacheKey(`genres-${type}`);
            const cached = getFromCache(cacheKey);
            if (cached) return cached;

            const response = await tmdbClient.get(`/genre/${type}/list`, {
                params: {
                    api_key: TMDB_API_KEY
                }
            });
            setCache(cacheKey, response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching genres:', error.message);
            throw new Error('Failed to fetch genres');
        }
    }
}

module.exports = new TMDBService();
