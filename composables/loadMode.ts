import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import THREE from "three"

export default function loadModel(scene: THREE.Scene): Promise<GLTF> {
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
        loader.load('room-1-1.glb', (gltf) => {
            scene.add(gltf.scene);
            resolve(gltf)
        }, undefined, (error) => {
            console.error('An error occurred while loading the GLB file:', error);
            reject(error)
        });
    })
}