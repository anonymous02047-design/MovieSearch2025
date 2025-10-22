/**
 * Data Export Utilities
 * Export user data in various formats (CSV, JSON, PDF-ready)
 */

import { StoredMovie } from '@/lib/storage';
import { MovieNote } from '@/hooks/useMovieNotes';
import { ViewingHistoryItem } from '@/hooks/useViewingHistory';

// Export to CSV
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Handle values with commas, quotes, or newlines
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    )
  ].join('\n');

  downloadFile(csvContent, filename, 'text/csv');
}

// Export to JSON
export function exportToJSON(data: any, filename: string) {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
}

// Download file helper
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Export favorites to CSV
export function exportFavoritesAsCSV(favorites: StoredMovie[]) {
  const data = favorites.map(movie => ({
    Title: movie.title,
    'Release Date': movie.release_date,
    Rating: movie.vote_average,
    'Added At': new Date(movie.addedAt).toLocaleDateString(),
  }));

  exportToCSV(data, `favorites_${new Date().toISOString().split('T')[0]}.csv`);
}

// Export watchlist to CSV
export function exportWatchlistAsCSV(watchlist: StoredMovie[]) {
  const data = watchlist.map(movie => ({
    Title: movie.title,
    'Release Date': movie.release_date,
    Rating: movie.vote_average,
    'Added At': new Date(movie.addedAt).toLocaleDateString(),
  }));

  exportToCSV(data, `watchlist_${new Date().toISOString().split('T')[0]}.csv`);
}

// Export notes to CSV
export function exportNotesAsCSV(notes: MovieNote[]) {
  const data = notes.map(note => ({
    Movie: note.movieTitle,
    Note: note.note,
    Tags: note.tags.join('; '),
    Rating: note.rating || 'N/A',
    'Created At': new Date(note.createdAt).toLocaleDateString(),
    'Updated At': new Date(note.updatedAt).toLocaleDateString(),
  }));

  exportToCSV(data, `movie_notes_${new Date().toISOString().split('T')[0]}.csv`);
}

// Export viewing history to CSV
export function exportHistoryAsCSV(history: ViewingHistoryItem[]) {
  const data = history.map(item => ({
    Movie: item.title,
    'Viewed At': new Date(item.viewedAt).toLocaleString(),
    'Duration (min)': item.duration ? Math.floor(item.duration / 60) : 'N/A',
    Completed: item.completed ? 'Yes' : 'No',
  }));

  exportToCSV(data, `viewing_history_${new Date().toISOString().split('T')[0]}.csv`);
}

// Export all data as comprehensive JSON
export function exportAllData(
  favorites: StoredMovie[],
  watchlist: StoredMovie[],
  notes: Record<number, MovieNote>,
  history: ViewingHistoryItem[]
) {
  const data = {
    exportDate: new Date().toISOString(),
    version: '1.0',
    data: {
      favorites,
      watchlist,
      notes: Object.values(notes),
      viewingHistory: history,
    },
    statistics: {
      totalFavorites: favorites.length,
      totalWatchlist: watchlist.length,
      totalNotes: Object.keys(notes).length,
      totalViewed: history.length,
    },
  };

  exportToJSON(data, `moviesearch_backup_${new Date().toISOString().split('T')[0]}.json`);
}

// Generate print-friendly HTML
export function generatePrintableHTML(movie: any): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <title>${movie.title} - Movie Details</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    .info { display: flex; gap: 20px; margin: 20px 0; }
    .poster { max-width: 300px; }
    .details { flex: 1; }
    .section { margin: 20px 0; }
    .label { font-weight: bold; color: #666; }
    @media print { .no-print { display: none; } }
  </style>
</head>
<body>
  <h1>${movie.title}</h1>
  <div class="info">
    <img class="poster" src="${getImageUrl(movie.poster_path, 'w500')}" alt="${movie.title}">
    <div class="details">
      <div class="section">
        <span class="label">Release Date:</span> ${movie.release_date}
      </div>
      <div class="section">
        <span class="label">Rating:</span> ${movie.vote_average}/10 (${movie.vote_count} votes)
      </div>
      <div class="section">
        <span class="label">Runtime:</span> ${movie.runtime} minutes
      </div>
      <div class="section">
        <span class="label">Genres:</span> ${movie.genres?.map((g: any) => g.name).join(', ')}
      </div>
    </div>
  </div>
  <div class="section">
    <h2>Overview</h2>
    <p>${movie.overview}</p>
  </div>
  <button class="no-print" onclick="window.print()">Print</button>
</body>
</html>
  `;
}

// Helper function for image URLs
function getImageUrl(path: string | null, size: string): string {
  if (!path) return '/placeholder-movie.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// Print movie details
export function printMovieDetails(movie: any) {
  const html = generatePrintableHTML(movie);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

