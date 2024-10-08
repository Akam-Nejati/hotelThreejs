import { defineStore } from "pinia";
import * as THREE from 'three';

export const useAnimateStore = defineStore("animate", () => {
    
    let isAnimating = false; // Flag to control the animation loop

    function setAnimate(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, updateMovement?: Function) {
        isAnimating = true; // Enable animation loop
        let prevTime = performance.now();

        function animate() {
            if (!isAnimating) return; // Stop the loop if no longer animating

            requestAnimationFrame(animate);

            if (updateMovement) {
                const time = performance.now();
                const delta = (time - prevTime) / 1000;
                updateMovement(delta);
                prevTime = time;
            }
            renderer.render(scene, camera);
        }

        animate();
    }

    function stopAnimate() {
        isAnimating = false;
    }

    return {
        setAnimate,
        stopAnimate,
    };
});
