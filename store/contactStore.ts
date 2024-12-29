import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";

export interface Contact {
  id: string;
  name: string;
  securePhrase: string; // Emoji sequence used as secure phrase
  addedDate: Date;
}

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'addedDate'>) => void;
  removeContact: (id: string) => void;
  getContact: (id: string) => Contact | undefined;
}

// Custom storage object for SecureStore
const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return await SecureStore.getItemAsync(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await SecureStore.deleteItemAsync(name);
  },
};

export const useContactStore = create<ContactState>()(
  persist(
    (set, get) => ({
      contacts: [],
      addContact: (contact) =>
        set((state) => ({
          contacts: [
            ...state.contacts,
            {
              ...contact,
              id: Math.random().toString(36).substring(7),
              addedDate: new Date(),
            },
          ],
        })),
      removeContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),
      getContact: (id) => get().contacts.find((contact) => contact.id === id),
    }),
    {
      name: 'contacts-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ contacts: state.contacts }),
    }
  )
);
