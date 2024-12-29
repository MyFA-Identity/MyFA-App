import { useState, useEffect } from 'react';
import { getContacts, storeContacts } from '../services/storage';

interface Contact {
  id: string;
  name: string;
  secret: string;
  dateAdded: string;
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const loaded = getContacts();
    setContacts(loaded);
  }, []);

  const addContact = (contact: Contact) => {
    const updated = [...contacts, contact];
    setContacts(updated);
    storeContacts(updated);
  };

  const removeContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    storeContacts(updated);
  };

  return {
    contacts,
    addContact,
    removeContact,
  };
}
