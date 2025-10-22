'use client';

import { useState, useEffect, useCallback } from 'react';

export interface MovieNote {
  movieId: number;
  movieTitle: string;
  note: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  rating?: number; // personal rating 1-10
}

const STORAGE_KEY = 'movieSearch_notes';

export function useMovieNotes() {
  const [notes, setNotes] = useState<Record<number, MovieNote>>({});

  // Load notes from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setNotes(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading movie notes:', error);
      }
    }
  }, []);

  // Save notes to localStorage
  const saveNotes = useCallback((newNotes: Record<number, MovieNote>) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newNotes));
        setNotes(newNotes);
      } catch (error) {
        console.error('Error saving movie notes:', error);
      }
    }
  }, []);

  // Add or update note
  const saveNote = useCallback(
    (movieId: number, movieTitle: string, note: string, tags: string[] = [], rating?: number) => {
      const now = new Date().toISOString();
      const existing = notes[movieId];

      const newNote: MovieNote = {
        movieId,
        movieTitle,
        note,
        tags,
        rating,
        createdAt: existing?.createdAt || now,
        updatedAt: now,
      };

      const newNotes = {
        ...notes,
        [movieId]: newNote,
      };

      saveNotes(newNotes);
      return newNote;
    },
    [notes, saveNotes]
  );

  // Get note for a specific movie
  const getNote = useCallback(
    (movieId: number) => {
      return notes[movieId] || null;
    },
    [notes]
  );

  // Delete note
  const deleteNote = useCallback(
    (movieId: number) => {
      const newNotes = { ...notes };
      delete newNotes[movieId];
      saveNotes(newNotes);
    },
    [notes, saveNotes]
  );

  // Get all notes
  const getAllNotes = useCallback(() => {
    return Object.values(notes).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [notes]);

  // Search notes
  const searchNotes = useCallback(
    (query: string) => {
      const lowerQuery = query.toLowerCase();
      return Object.values(notes).filter(
        (note) =>
          note.movieTitle.toLowerCase().includes(lowerQuery) ||
          note.note.toLowerCase().includes(lowerQuery) ||
          note.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    },
    [notes]
  );

  // Get notes by tag
  const getNotesByTag = useCallback(
    (tag: string) => {
      return Object.values(notes).filter((note) =>
        note.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    },
    [notes]
  );

  // Get all unique tags
  const getAllTags = useCallback(() => {
    const tagSet = new Set<string>();
    Object.values(notes).forEach((note) => {
      note.tags.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [notes]);

  // Export notes as JSON
  const exportNotes = useCallback(() => {
    const data = {
      type: 'MovieSearch Notes',
      exportDate: new Date().toISOString(),
      count: Object.keys(notes).length,
      notes: Object.values(notes),
    };
    return JSON.stringify(data, null, 2);
  }, [notes]);

  // Import notes from JSON
  const importNotes = useCallback(
    (jsonData: string): { success: boolean; message: string } => {
      try {
        const data = JSON.parse(jsonData);

        if (data.type === 'MovieSearch Notes' && Array.isArray(data.notes)) {
          const importedNotes: Record<number, MovieNote> = {};
          data.notes.forEach((note: MovieNote) => {
            importedNotes[note.movieId] = note;
          });

          saveNotes({ ...notes, ...importedNotes });
          return { success: true, message: `Imported ${data.notes.length} notes` };
        }

        return { success: false, message: 'Invalid data format' };
      } catch {
        return { success: false, message: 'Invalid JSON data' };
      }
    },
    [notes, saveNotes]
  );

  return {
    notes,
    saveNote,
    getNote,
    deleteNote,
    getAllNotes,
    searchNotes,
    getNotesByTag,
    getAllTags,
    exportNotes,
    importNotes,
  };
}

