import { useContactStore, Contact } from '../store/contactStore';

export function useContacts() {
  const { contacts, addContact: addContactToStore, removeContact: removeContactFromStore } = useContactStore();

  const addContact = (contact: Omit<Contact, 'id' | 'addedDate'>) => {
    addContactToStore(contact);
  };

  const removeContact = (id: string) => {
    removeContactFromStore(id);
  };

  return {
    contacts,
    addContact,
    removeContact,
  };
}
