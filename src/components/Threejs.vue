<template>
    <div ref="container"
        :class="isModelFullScreen ? '!fixed top-0 left-0 w-screen h-screen z-10' : 'w-full h-[22.5rem] relative'">
        <div class="absolute top-4 right-4 w-5 cursor-pointer" v-if="currentModel === 'room'">
            <img src="/fullscreen.svg" @click="toggleFullScreen" />
        </div>

        <div class="absolute top-3 left-5 cursor-pointer" @click="currentModel = 'hotel'"
            v-if="currentModel === 'room'">
            <div class="text-black text-4xl">
                ←
            </div>
        </div>

        <div class="absolute  bottom-1 left-1 flex justify-end items-end gap-3 p-4 select-none"
            v-if="currentModel === 'room' && deviceType === 'Phone'">
            <div>
                <div @touchstart="moveLeft = true" @touchend="moveLeft = false"
                    class="py-[2.80rem] px-3 text-xl bg-black bg-opacity-30 border border-black rounded-xl text-slate-300">
                    →
                </div>
            </div>
            <div class="flex flex-col gap-3">
                <div @touchstart="moveForward = true" @touchend="moveForward = false"
                    class="p-3 text-xl bg-black bg-opacity-30 border border-black rounded-xl text-slate-300">↑
                </div>
                <div @touchstart="moveBackward = true" @touchend="moveBackward = false"
                    class="p-3 text-xl bg-black bg-opacity-30 border border-black rounded-xl text-slate-300">↓
                </div>
            </div>
            <div>
                <div @touchstart="moveRight = true" @touchend="moveRight = false"
                    class="py-[2.80rem] px-3 text-xl bg-black bg-opacity-30 border border-black rounded-xl text-slate-300">
                    ←
                </div>
            </div>
        </div>

        <div v-if="showRotationMessage"
            class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-20 px-4">
            <div class="backdrop-blur-sm bg-white/30 rounded-lg p-6 max-w-sm text-center relative">
                <button @click="closeRotationMessage" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                        stroke="#0f172a">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-blue-500" fill="none"
                    viewBox="0 0 24 24" stroke="#cbd5e1">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <p class="text-lg font-semibold text-slate-300 drop-shadow-xl">برای تجربه بهتر لطفا گوشی خود را بچرخانید
                </p>
            </div>
        </div>
    </div>
    <div class="py-4">
        <img src="/Screenshot from 2024-10-08 22-57-28.png"  v-if="currentModel === 'hotel'" class="w-24 rounded-xl shadow-lg border border-zinc-900 cursor-pointer" @click="currentModel = 'room'" alt="">
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRefs, watch } from 'vue';
import * as THREE from 'three';
import { useRoomStore } from '../stores/useRoomStore';
import { useHotelStore } from '../stores/useHotelStore';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { useOrbitControlsStore } from '../stores/useOrbitControlsStore';
import { useCurrentModel } from '../stores/useCurrentModelStore';

const container = ref<HTMLDivElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;

const { setControls } = useOrbitControlsStore();
const { useRoom } = useRoomStore();
const { moveBackward, moveForward, moveLeft, moveRight } = toRefs(useRoomStore());
const { useHotel } = useHotelStore();

const isModelFullScreen = ref<boolean>(false);
const showRotationMessage = ref<boolean>(false);

const { currentModel } = toRefs(useCurrentModel()) 

onMounted(() => {
    initScene();
    addResizeEventListener();
    useHotel(renderer, scene, camera)

    // useRoom(renderer, scene, camera, container);

    setSkyImage();
});

function detectDevice(): 'Phone' | 'PC' {
    const userAgent: string = navigator.userAgent;

    if (/Mobi|Android|iPhone|iPad|iPod/i.test(userAgent)) {
        return 'Phone';
    } else {
        return 'PC';
    }
}

const deviceType: 'Phone' | 'PC' = detectDevice();

function removeAllModelsFromScene(scene: THREE.Scene) {
    const objectsToRemove: THREE.Object3D[] = [];

    // Traverse through the scene's children to find meshes
    scene.traverse((object) => {
        // If the object is a mesh (model), mark it for removal
        if (object instanceof THREE.Mesh) {
            objectsToRemove.push(object);
        }
    });

    // Now remove each object from its parent
    objectsToRemove.forEach((object) => {
        // Check if the object has a parent, and remove it from the parent
        if (object.parent) {
            object.parent.remove(object);
        }

        // Dispose geometry and materials
        object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                // Dispose geometry
                child.geometry.dispose();

                // Dispose material(s)
                if (Array.isArray(child.material)) {
                    child.material.forEach(material => disposeMaterial(material));
                } else {
                    disposeMaterial(child.material);
                }
            }
        });
    });
}

// Function to safely dispose of a material
function disposeMaterial(material: THREE.Material) {
    // Dispose textures attached to the material
    for (const key in material) {
        if ((material as any)[key] && (material as any)[key].isTexture) {
            (material as any)[key].dispose();
        }
    }

    // Dispose the material itself
    material.dispose();
}


watch(currentModel, () => {
    camera.rotation.set(0, 0, 0);
    camera.position.set(0, 0, 0);

    removeAllModelsFromScene(scene);

    if (currentModel.value === "room") {
        useRoom(renderer, scene, camera, container);
    } else {
        const { cleanup } = useRoomStore();
        cleanup(); // Clean up room store when switching to hotel
        useHotel(renderer, scene, camera);
    }
})

onUnmounted(() => {
    removeResizeEventListener();
});

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, getAspectRatio(), 0.1, 1000);
    camera.position.set(0, 1.7, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    updateRendererSize();
    if (container.value) container.value.appendChild(renderer.domElement);

    controls = new OrbitControls(camera, renderer.domElement);
    setupControls();

    setControls(controls);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);
}

function setupControls() {
    controls.enableDamping = false;
    controls.autoRotate = false;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.update();
}

function setSkyImage() {
    scene.background = new THREE.Color("#C3D6DF");
}

function getAspectRatio() {
    return container.value
        ? container.value.clientWidth / container.value.clientHeight
        : window.innerWidth / window.innerHeight;
}

function updateRendererSize() {
    if (container.value) {
        renderer.setSize(container.value.clientWidth, container.value.clientHeight);
    }
}

function updateCameraAspect() {
    camera.aspect = getAspectRatio();
    camera.updateProjectionMatrix();
}

function onWindowResize() {
    updateCameraAspect();
    updateRendererSize();
}

function addResizeEventListener() {
    window.addEventListener('resize', onWindowResize);
}

function removeResizeEventListener() {
    window.removeEventListener('resize', onWindowResize);
}

async function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (container.value?.requestFullscreen) {
            await container.value.requestFullscreen();
        }
        isModelFullScreen.value = true;
        checkDeviceOrientation();
    } else {
        if (document.exitFullscreen) {
            await document.exitFullscreen();
        }
        isModelFullScreen.value = false;
        showRotationMessage.value = false;
    }
}

function checkDeviceOrientation() {
    if (isModelFullScreen.value && window.innerWidth < window.innerHeight) {
        showRotationMessage.value = true;
    } else {
        showRotationMessage.value = false;
    }
}

function closeRotationMessage() {
    showRotationMessage.value = false;
}

watch(isModelFullScreen, () => {
    setTimeout(() => {
        onWindowResize();
        checkDeviceOrientation();
    }, 100);
});

onMounted(() => {
    document.addEventListener('fullscreenchange', onFullScreenChange);
    window.addEventListener('orientationchange', checkDeviceOrientation);
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', onFullScreenChange);
    window.removeEventListener('orientationchange', checkDeviceOrientation);
});

function onFullScreenChange() {
    isModelFullScreen.value = !!document.fullscreenElement;
    if (!isModelFullScreen.value) {
        showRotationMessage.value = false;
    }
}
</script>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    cursor: pointer;
}
</style>