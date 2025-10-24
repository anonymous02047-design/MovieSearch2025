/**
 * API Client for MongoDB-backed features
 * Centralized API call handling with error management
 */

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

async function fetchAPI(url: string, options: RequestInit = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(response.status, data.error || 'API request failed');
  }

  return data;
}

// Quick Ratings API
export const quickRatingAPI = {
  getAll: () => fetchAPI('/api/quick-rate'),
  create: (rating: any) => fetchAPI('/api/quick-rate', {
    method: 'POST',
    body: JSON.stringify(rating),
  }),
  delete: (movieId: number) => fetchAPI(`/api/quick-rate?movieId=${movieId}`, {
    method: 'DELETE',
  }),
};

// Movie Memory API
export const movieMemoryAPI = {
  getAll: () => fetchAPI('/api/movie-memory'),
  create: (memory: any) => fetchAPI('/api/movie-memory', {
    method: 'POST',
    body: JSON.stringify(memory),
  }),
  update: (id: string, memory: any) => fetchAPI('/api/movie-memory', {
    method: 'PUT',
    body: JSON.stringify({ id, ...memory }),
  }),
  delete: (id: string) => fetchAPI(`/api/movie-memory?id=${id}`, {
    method: 'DELETE',
  }),
};

// Movie Goal API
export const movieGoalAPI = {
  getAll: () => fetchAPI('/api/movie-goal'),
  createOrUpdate: (goal: any) => fetchAPI('/api/movie-goal', {
    method: 'POST',
    body: JSON.stringify(goal),
  }),
  updateProgress: (year: number, increment: number = 1) => fetchAPI('/api/movie-goal', {
    method: 'PUT',
    body: JSON.stringify({ year, increment }),
  }),
};

// Movie Diary API
export const movieDiaryAPI = {
  getAll: (movieId?: number) => 
    fetchAPI(`/api/movie-diary${movieId ? `?movieId=${movieId}` : ''}`),
  create: (entry: any) => fetchAPI('/api/movie-diary', {
    method: 'POST',
    body: JSON.stringify(entry),
  }),
  update: (id: string, entry: any) => fetchAPI('/api/movie-diary', {
    method: 'PUT',
    body: JSON.stringify({ id, ...entry }),
  }),
  delete: (id: string) => fetchAPI(`/api/movie-diary?id=${id}`, {
    method: 'DELETE',
  }),
};

// Movie Note API
export const movieNoteAPI = {
  getAll: (movieId?: number) => 
    fetchAPI(`/api/movie-note${movieId ? `?movieId=${movieId}` : ''}`),
  create: (note: any) => fetchAPI('/api/movie-note', {
    method: 'POST',
    body: JSON.stringify(note),
  }),
  update: (id: string, note: any) => fetchAPI('/api/movie-note', {
    method: 'PUT',
    body: JSON.stringify({ id, ...note }),
  }),
  delete: (id: string) => fetchAPI(`/api/movie-note?id=${id}`, {
    method: 'DELETE',
  }),
};

// Quick List API
export const quickListAPI = {
  getAll: () => fetchAPI('/api/quick-list'),
  create: (list: any) => fetchAPI('/api/quick-list', {
    method: 'POST',
    body: JSON.stringify(list),
  }),
  addMovie: (listId: string, movie: any) => fetchAPI('/api/quick-list', {
    method: 'POST',
    body: JSON.stringify({ listId, ...movie }),
  }),
  update: (id: string, list: any) => fetchAPI('/api/quick-list', {
    method: 'PUT',
    body: JSON.stringify({ id, ...list }),
  }),
  delete: (id: string, movieId?: number) => 
    fetchAPI(`/api/quick-list?id=${id}${movieId ? `&movieId=${movieId}` : ''}`, {
      method: 'DELETE',
    }),
};

// Movie Quote API
export const movieQuoteAPI = {
  getAll: (movieId?: number, favorites?: boolean) => {
    const params = new URLSearchParams();
    if (movieId) params.append('movieId', String(movieId));
    if (favorites) params.append('favorites', 'true');
    return fetchAPI(`/api/movie-quote${params.toString() ? `?${params}` : ''}`);
  },
  create: (quote: any) => fetchAPI('/api/movie-quote', {
    method: 'POST',
    body: JSON.stringify(quote),
  }),
  update: (id: string, quote: any) => fetchAPI('/api/movie-quote', {
    method: 'PUT',
    body: JSON.stringify({ id, ...quote }),
  }),
  delete: (id: string) => fetchAPI(`/api/movie-quote?id=${id}`, {
    method: 'DELETE',
  }),
};

// Cinema Visit API
export const cinemaVisitAPI = {
  getAll: () => fetchAPI('/api/cinema-visit'),
  create: (visit: any) => fetchAPI('/api/cinema-visit', {
    method: 'POST',
    body: JSON.stringify(visit),
  }),
  update: (id: string, visit: any) => fetchAPI('/api/cinema-visit', {
    method: 'PUT',
    body: JSON.stringify({ id, ...visit }),
  }),
  delete: (id: string) => fetchAPI(`/api/cinema-visit?id=${id}`, {
    method: 'DELETE',
  }),
};

export default {
  quickRatingAPI,
  movieMemoryAPI,
  movieGoalAPI,
  movieDiaryAPI,
  movieNoteAPI,
  quickListAPI,
  movieQuoteAPI,
  cinemaVisitAPI,
};

