import { defineStore } from "pinia";
import { useIndexedDB } from "./useIndexedDB";

export const useCacheModel = defineStore("cacheModel", () => {
    const { openDB, storeFileInDB, getFileFromDB } = useIndexedDB()

    const DB_NAME = 'glbFilesDB';
    const DB_VERSION = 1;


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