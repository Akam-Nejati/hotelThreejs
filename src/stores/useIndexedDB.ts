import { defineStore } from "pinia";

export const useIndexedDB = defineStore("indexedDB" ,() => {
    const openDB = (dbName: string, version: number) => {
        return new Promise<IDBDatabase>((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onerror = (event) => {
                reject(`IndexedDB error: ${(event.target as any).error}`);
            };

            request.onsuccess = (event) => {
                const db = (event.target as any).result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as any).result;
                if (!db.objectStoreNames.contains('glbFiles')) {
                    db.createObjectStore('glbFiles', { keyPath: 'name' });
                }
            };
        });
    };

    const storeFileInDB = (db: IDBDatabase, fileName: string, fileData: ArrayBuffer) => {
        return new Promise<void>((resolve, reject) => {
            const transaction = db.transaction(['glbFiles'], 'readwrite');
            const store = transaction.objectStore('glbFiles');

            const fileObject = { name: fileName, data: fileData };

            const request = store.put(fileObject);

            request.onsuccess = () => {
                resolve();
            };

            request.onerror = () => {
                reject(`Failed to store file ${fileName}`);
            };
        });
    };

    const getFileFromDB = (db: IDBDatabase, fileName: string): Promise<ArrayBuffer | null> => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['glbFiles'], 'readonly');
            const store = transaction.objectStore('glbFiles');

            const request = store.get(fileName);

            request.onsuccess = (event) => {
                const file = (event.target as any).result;
                if (file) {
                    resolve(file.data);
                } else {
                    resolve(null);
                }
            };

            request.onerror = () => {
                reject(`Failed to retrieve file ${fileName}`);
            };
        });
    };

    return {
        openDB,
        storeFileInDB, 
        getFileFromDB
    }
})