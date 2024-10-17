import { defineStore } from "pinia";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from 'three';
import { useLoadingStore } from "./useLoadingProgressStore";
import { toRefs } from "vue";
import { useCacheModel } from './useCacheModel'; // Import the caching logic

export const useLoadModelStore = defineStore("load model", () => {
    const { downloadAndCacheModel } = useCacheModel(); // Access the caching method

    function loadModel(scene: THREE.Scene, path: string): Promise<GLTF> {
        return new Promise(async (resolve, reject) => {
            const { loadingShow, loadingProgress } = toRefs(useLoadingStore());
            
            loadingShow.value = true;
            
            console.log("cachedModel");
            
            // Try to download the model and cache it in IndexedDB
            const cachedModel = await downloadAndCacheModel(path ,path);
            
            console.log(cachedModel);

            if (cachedModel) {
                // Convert ArrayBuffer to Blob
                const blob = new Blob([cachedModel], { type: 'model/gltf-binary' });
                const url = URL.createObjectURL(blob); // Create a URL from the Blob
                
                const loader = new GLTFLoader();
                loader.load(url, (gltf) => {
                    loadingShow.value = false;
                    scene.add(gltf.scene);
                    resolve(gltf);
                }, (xhr) => {
                    loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100);
                    if (loadingProgress.value === 100) {
                        loadingProgress.value = 0;
                    }
                }, (error) => {
                    console.error('An error occurred while loading the GLB file:', error);
                    loadingShow.value = false;
                    reject(error);
                });
            } else {
                loadingShow.value = false;
                reject(new Error('Failed to load the GLB model.'));
            }
        });
    }

    return {
        loadModel
    };
});
