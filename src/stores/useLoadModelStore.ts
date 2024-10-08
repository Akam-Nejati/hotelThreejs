import { defineStore } from "pinia";
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js";
import * as THREE from 'three';
import { useLoadingStore } from "./useLoadingProgressStore";
import { toRefs } from "vue";


export const useLoadModelStore = defineStore("load model", () => {
    function loadModel(scene: THREE.Scene, path: string): Promise<GLTF> {
        return new Promise(async (resolve, reject) => {
            const { loadingShow, loadingProgress } = toRefs(useLoadingStore())

            loadingShow.value = true

            const fetchModel = await fetch(path)

            console.log(fetchModel);
            

            const loader = new GLTFLoader();
            loader.load(path, (gltf) => {
                console.log(gltf);
                loadingShow.value = false
                scene.add(gltf.scene);
                resolve(gltf)
            }, (xhr) => {
                // Update the progress bar based on loading progress                
                loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100);
                if (loadingProgress.value === 100) {
                    loadingProgress.value = 0
                }
            }, (error) => {
                console.error('An error occurred while loading the GLB file:', error);
                loadingShow.value = false
                reject(error)
            });
        })
    }

    return {
        loadModel
    }
})