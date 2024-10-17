import { defineStore } from "pinia";
import { useIndexedDB } from "./useIndexedDB";

export const useCacheModel = defineStore("cacheModel", () => {
    const { openDB, storeFileInDB, getFileFromDB } = useIndexedDB()

    const DB_NAME = 'glbFilesDB';
    const DB_VERSION = 1;

    async function fetchWithProgress(fileUrl: string): Promise<ArrayBuffer> {        
        const response = await fetch(fileUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch the model from network');
        }

        // Get the total size of the file (in bytes) from the response headers
        const contentLength = parseInt(response.headers.get('Content-Length') || '0', 10);

        if (!contentLength) {
            throw new Error('Unable to determine file size');
        }

        const reader = response.body?.getReader();
        const chunks: Uint8Array[] = [];
        let receivedLength = 0; // The total number of bytes received

        while (true) {
            const { done, value } = await reader!.read();

            if (done) {
                break;
            }

            chunks.push(value!);
            receivedLength += value!.length;

            // Calculate progress as a percentage
            const progress = (receivedLength / contentLength) * 100;
            console.log(`Progress: ${Math.round(progress)}%`);
        }

        // Combine all chunks into a single ArrayBuffer
        const allChunks = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
            allChunks.set(chunk, position);
            position += chunk.length;
        }

        return allChunks.buffer;
    }


    const downloadAndCacheModel = async (fileName: string, fileUrl: string): Promise<ArrayBuffer | null> => {
        try {
            
            const db = await openDB(DB_NAME, DB_VERSION);
            console.log("hello");
            const cachedFile = await getFileFromDB(db, fileName);

            if (cachedFile) {
                console.log(`Loaded ${fileName} from IndexedDB`);
                return cachedFile;
            }

            const response = await fetch(fileUrl);;
            if (!response.ok) throw new Error('Failed to fetch the model from network');

            const arrayBuffer = await response.arrayBuffer();
            await storeFileInDB(db, fileName, arrayBuffer)
            console.log(`Cached ${fileName} in IndexedDB`);
            return arrayBuffer;
        } catch (error) {
            console.error(`Error fetching and caching model: ${error}`);
            return null;
        }
    };

    return {
        downloadAndCacheModel
    }
}) 