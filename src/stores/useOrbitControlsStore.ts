import { defineStore } from "pinia";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { ref } from "vue";

export const useOrbitControlsStore = defineStore("orbit controls", () => {
    const controls = ref<OrbitControls>()
    
    function setControls(newControls: OrbitControls) {
        controls.value = newControls
    }

    function changeStatusOfControls(state: boolean) {
        if (controls.value) {
            controls.value.enableZoom = state;
            controls.value.enablePan = state;
            controls.value.enableRotate = state;
        }
    }

    return {
        setControls,
        changeStatusOfControls,
        controls
    }
})