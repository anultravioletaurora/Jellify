import { MMKV } from "react-native-mmkv";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

export const storage = new MMKV();

const clientStorage = {
  setItem: (key: string, value: string | number | boolean | Uint8Array) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};
  
export const clientPersister = createSyncStoragePersister({ 
  storage: clientStorage,
});