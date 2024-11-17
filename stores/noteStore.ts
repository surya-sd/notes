import { create } from 'zustand';
import { storage } from '../lib/storage';

export type SortOption = 'name' | 'date' | 'size';
export type SortDirection = 'asc' | 'desc';

export interface Note {
  id: string;
  title: string;
  content: string;
  backgroundColor: string;
  headerImage?: string;
  createdAt: number;
  updatedAt: number;
}

interface NoteState {
  notes: Note[];
  sortOption: SortOption;
  sortDirection: SortDirection;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  getNoteById: (id: string) => Note | undefined;
  setSorting: (option: SortOption, direction: SortDirection) => void;
  getSortedNotes: () => Note[];
}

const STORAGE_KEYS = {
  NOTES: 'notes',
  SORT_OPTION: 'sortOption',
  SORT_DIRECTION: 'sortDirection',
};

const saveToStorage = async (key: string, data: any) => {
  await storage.set(key, JSON.stringify(data));
};

const getFromStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  const value = await storage.getString(key);
  return value ? JSON.parse(value) : defaultValue;
};

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  sortOption: 'date' as SortOption,
  sortDirection: 'desc' as SortDirection,

  addNote: async (noteData) => {
    try {
      const newNote: Note = {
        id: Date.now().toString(),
        ...noteData,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      const updatedNotes = [...get().notes, newNote];
      await saveToStorage(STORAGE_KEYS.NOTES, updatedNotes);
      set({ notes: updatedNotes });

      return newNote;
    } catch (error) {
      console.error('Error adding note:', error);
      throw new Error('Failed to add note');
    }
  },

  updateNote: async (id, noteData) => {
    try {
      const updatedNotes = get().notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...noteData,
              updatedAt: Date.now(),
            }
          : note
      );

      await saveToStorage(STORAGE_KEYS.NOTES, updatedNotes);
      set({ notes: updatedNotes });
    } catch (error) {
      console.error('Error updating note:', error);
      throw new Error('Failed to update note');
    }
  },

  deleteNote: async (id) => {
    try {
      const updatedNotes = get().notes.filter((note) => note.id !== id);
      await saveToStorage(STORAGE_KEYS.NOTES, updatedNotes);
      set({ notes: updatedNotes });
    } catch (error) {
      console.error('Error deleting note:', error);
      throw new Error('Failed to delete note');
    }
  },

  getNoteById: (id) => {
    return get().notes.find((note) => note.id === id);
  },

  setSorting: async (option: SortOption, direction: SortDirection) => {
    try {
      await Promise.all([
        saveToStorage(STORAGE_KEYS.SORT_OPTION, option),
        saveToStorage(STORAGE_KEYS.SORT_DIRECTION, direction),
      ]);
      set({ sortOption: option, sortDirection: direction });
    } catch (error) {
      console.error('Error saving sort preferences:', error);
      throw new Error('Failed to save sort preferences');
    }
  },

  getSortedNotes: () => {
    const { notes, sortOption, sortDirection } = get();
    return [...notes].sort((a, b) => {
      let comparison = 0;
      switch (sortOption) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'date':
          comparison = a.createdAt - b.createdAt;
          break;
        case 'size':
          comparison = (a.content.length + a.title.length) - 
                      (b.content.length + b.title.length);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  },
}));

const initializeStore = async () => {
  try {
    const [notes, sortOption, sortDirection] = await Promise.all([
      getFromStorage<Note[]>(STORAGE_KEYS.NOTES, []),
      getFromStorage<SortOption>(STORAGE_KEYS.SORT_OPTION, 'date'),
      getFromStorage<SortDirection>(STORAGE_KEYS.SORT_DIRECTION, 'desc'),
    ]);

    useNoteStore.setState({
      notes,
      sortOption,
      sortDirection,
    });
  } catch (error) {
    console.error('Error initializing store:', error);
  }
};

initializeStore(); 