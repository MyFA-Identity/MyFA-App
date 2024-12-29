import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export function storeContacts(contacts: any[]): void {
  storage.set('contacts', JSON.stringify(contacts));
}

export function getContacts(): any[] {
  const data = storage.getString('contacts');
  return data ? JSON.parse(data) : [];
}
