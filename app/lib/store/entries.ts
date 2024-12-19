import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';

export interface ImageContext {
  url: string;
  description: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  imageContexts: ImageContext[];
}

interface EntriesState {
  entries: JournalEntry[];
  currentEntry: JournalEntry | null;
  isHydrated: boolean; // Add this to the interface
  createEntry: () => JournalEntry;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  setCurrentEntry: (entry: JournalEntry | null) => void;
  setHydrated: (state: boolean) => void; // Add this action
}

export const useEntriesStore = create<EntriesState>()(
  persist(
    (set) => ({
      entries: [],
      currentEntry: null,
      isHydrated: false,
      setHydrated: (state: boolean) => set({ isHydrated: state }),
      createEntry: () => {
        const newEntry: JournalEntry = {
          id: crypto.randomUUID(),
          title: 'Untitled Entry',
          content: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          imageContexts: [],
        };
        set((state) => ({
          entries: [newEntry, ...state.entries],
          currentEntry: newEntry,
        }));
        return newEntry;
      },
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry.id === id
              ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
              : entry
          ),
          currentEntry:
            state.currentEntry?.id === id
              ? {
                  ...state.currentEntry,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : state.currentEntry,
        })),
      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((entry) => entry.id !== id),
          currentEntry:
            state.currentEntry?.id === id ? null : state.currentEntry,
        })),
      setCurrentEntry: (entry) => set({ currentEntry: entry }),
    }),
    {
      name: 'journal-entries',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        entries: state.entries,
      }),
      onRehydrateStorage: () => (state) => {
        // After rehydration completes, set hydrated state to true
        state?.setHydrated(true);
      },
    }
  )
);
