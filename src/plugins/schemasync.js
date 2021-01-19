import { openDB } from 'idb';

export const SchemaSyncHandler = {
  sync() {
    if (!('indexedDB' in window)) {
      alert('Browser does not support IndexedDB')
      throw new Error('Browser does not support IndexedDB')
    }

    openDB('vue-pos', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('product')) {
          db.createObjectStore('product', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('category')) {
          db.createObjectStore('category', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('transaction')) {
          db.createObjectStore('transaction', { keyPath: 'id' });
        }
      },
    });
  }
};
