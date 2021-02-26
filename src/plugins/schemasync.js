import { openDB } from 'idb';

export const SchemaSyncHandler = {
  sync() {
    if (!('indexedDB' in window)) {
      alert('Browser does not support IndexedDB')
      throw new Error('Browser does not support IndexedDB')
    }

    openDB('vue-pos', 3, {
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

        if (!db.objectStoreNames.contains('customer')) {
          db.createObjectStore('customer', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('outlet')) {
          db.createObjectStore('outlet', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('cashier')) {
          db.createObjectStore('cashier', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('table')) {
          db.createObjectStore('table', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('ingredient')) {
          db.createObjectStore('ingredient', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('recipe')) {
          db.createObjectStore('recipe', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('supplier')) {
          db.createObjectStore('supplier', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('order')) {
          db.createObjectStore('order', { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains('receive')) {
          db.createObjectStore('receive', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('transfer')) {
          db.createObjectStore('transfer', { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains('adjustment')) {
          db.createObjectStore('adjustment', { keyPath: 'id' });
        }
      },
    });
  }
};
