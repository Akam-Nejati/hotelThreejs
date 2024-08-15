<template>
    <div ref="rendererContainer" class="renderer-container"></div>
    <Modal ref="modal">
        <template #Title>
            <h2 class="drop-shadow-2xl text-2xl font-extrabold">Armchairs</h2>
        </template>
        <div class="grid grid-cols-3 gap-2 mt-4">
            <div v-for="armchair in armchairs" class="p-4 bg-blue-300 rounded-xl shadow-xl overflow-hidden cursor-pointer"
                @click="changeArmchair(armchair.path)">
                <img :src="`/image/${armchair.image}`" :class="{ 'scale-150': armchair.name === 'armchair2' }"
                    class="drop-shadow-xl w-full h-full object-cover object-center" :alt="armchair.name">
            </div>
        </div>
    </Modal>
</template>

<script setup lang="ts">
import {loadingProgress, loadingShow} from '../stores/loadingProgress';
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import Modal from "./Modal.vue"
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import anime from 'animejs';

const rendererContainer = ref<HTMLElement | null>(null);
const controls = shallowRef<OrbitControls | null>(null);
const camera = shallowRef<THREE.PerspectiveCamera | null>(null);
const renderer = shallowRef<THREE.WebGLRenderer | null>(null);
const scene = shallowRef<THREE.Scene | null>(null);
const raycaster = shallowRef<THREE.Raycaster | null>(null);
const mouse = shallowRef<THREE.Vector2 | null>(null);

const roomModel = shallowRef<THREE.Group | null>(null);
const isMouseOver = ref(false);

const armchairModel = shallowRef<THREE.Group | null>(null);

const body = document.querySelector("body")

const modal = ref<any>()

defineExpose({
    modal
})

const armchairs: { name: string, path: string, image: string }[] = [
    {
        name: "armchair1",
        path: "armchair1.glb",
        image: "armchair1.png"
    },
    {
        name: "armchair2",
        path: "armchair2.glb",
        image: "armchair2.png"
    },
]

// Load the GLTF models
async function loadModel(path: string, initialScale: THREE.Vector3, initialPosition: THREE.Vector3, enableControls: boolean = false) {
    const loader = new GLTFLoader();
    return new Promise<THREE.Group>((resolve, reject) => {
        loader.load(path, (gltf) => {
            const model = gltf.scene;
            model.scale.copy(initialScale);
            model.position.copy(initialPosition);
            model.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    child.name = child.name || 'unnamed';
                }
            });
            scene.value!.add(model);

            if (controls.value) {
                controls.value.enableZoom = enableControls;
                controls.value.enablePan = enableControls;
                controls.value.enableRotate = enableControls;
            }

            resolve(model);
        }, (xhr) => {
            // Update the progress bar based on loading progress
            loadingProgress.value = Math.round((xhr.loaded / xhr.total) * 100);
            if (loadingProgress.value === 100) {
                loadingProgress.value = 0
            }
        }, (error) => {
            reject(error);
        });
    });
}

onMounted(() => {
    if (rendererContainer.value) {
        // Scene setup
        scene.value = new THREE.Scene();
        scene.value.background = new THREE.Color("#fff");

        // Camera setup
        camera.value = new THREE.PerspectiveCamera(40, rendererContainer.value.clientWidth / rendererContainer.value.clientHeight, 0.1, 1000);
        camera.value.position.set(30, 30, 30);

        // Renderer setup
        renderer.value = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        renderer.value.setSize(rendererContainer.value.clientWidth, rendererContainer.value.clientHeight);
        rendererContainer.value.appendChild(renderer.value.domElement);
        renderer.value.shadowMap.enabled = true;
        renderer.value.shadowMap.type = THREE.PCFSoftShadowMap; // Use PCFSoftShadowMap for smooth shadows

        // Light setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.value.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 1;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.bias = -0.001;
        directionalLight.shadow.radius = 2; // Increase the shadow radius to blur the edges
        scene.value.add(directionalLight);

        // Plane to receive shadows
        const planeGeometry = new THREE.PlaneGeometry(500, 500);
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.1;
        plane.receiveShadow = true;
        scene.value.add(plane);

        // OrbitControls setup
        controls.value = new OrbitControls(camera.value, renderer.value.domElement);

        // Initialize raycaster and mouse
        raycaster.value = new THREE.Raycaster();
        mouse.value = new THREE.Vector2();

        // Add click and mousemove event listeners
        renderer.value.domElement.addEventListener('click', clickEventOnRoom);
        renderer.value.domElement.addEventListener('mousemove', moseMoveEventOnRoom);

        async function init() {
            try {
                loadingShow.value = true
                
                const obj1 = await loadModel(
                    "/models/armchair1.glb",
                    new THREE.Vector3(0.01, 0.01, 0.01),
                    new THREE.Vector3(0, 0, 0),
                    false
                );

                // Load and animate obj2 (room model)
                const obj2 = await loadModel(
                    "/models/room - Copy.glb",
                    new THREE.Vector3(0.01, 0.01, 0.01),
                    new THREE.Vector3(0, 0, 0),
                    true
                );
                
                loadingShow.value = false
                

                // Animate obj1 to appear
                await anime({
                    targets: obj1.scale,
                    x: 3,
                    y: 3,
                    z: 3,
                    duration: 1000,
                    easing: 'easeInOutExpo'
                }).finished;

                await anime({
                    targets: obj1.position,
                    y: 0,
                    duration: 1000,
                    direction: 'alternate',
                    easing: 'easeInOutExpo',
                    update: (anim) => {
                        obj1.rotateY(-0.001);

                        const progress = anim.progress / 100;
                        obj1.traverse((child) => {
                            if (child instanceof THREE.Mesh) {
                                child.material.opacity = 1 + progress;
                            }
                        });
                    },
                    loop: false
                }).finished;

                anime({
                    targets: obj1.position,
                    y: 2,
                    duration: 1000,
                    direction: 'alternate',
                    easing: 'easeInOutQuad',
                    loop: true
                }).finished;

                // Wait for 8 seconds before transitioning to the next model
                setTimeout(async () => {
                    // Animate obj1 to shrink and disappear
                    await anime({
                        targets: obj1.scale,
                        x: 0.01,
                        y: 0.01,
                        z: 0.01,
                        duration: 1000,
                        easing: 'easeInOutExpo',
                        complete: () => {
                            scene.value?.remove(obj1);
                        }
                    }).finished;

                    obj2.position.y = 2
                    roomModel.value = obj2;


                    obj2.traverse(item => {
                        if (item.name === "Text") {
                            item.position.y = .05
                        }
                    })
                    // Animate obj2 to grow and appear
                    await anime({
                        targets: obj2.scale,
                        x: 1.5,
                        y: 1.5,
                        z: 1.5,
                        duration: 1000,
                        easing: 'easeInOutExpo'
                    }).finished;
                }, 10000);
            } catch (error) {
                console.error('Error loading models:', error);
            }
        }

        init();

        // Resize handler
        const handleResize = () => {
            if (!rendererContainer.value || !camera.value || !renderer.value) return;

            camera.value.aspect = rendererContainer.value.clientWidth / rendererContainer.value.clientHeight;
            camera.value.updateProjectionMatrix();
            renderer.value.setSize(rendererContainer.value.clientWidth, rendererContainer.value.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.value?.render(scene.value!, camera.value!);
        };
        animate();
    }
});

onUnmounted(() => {
    if (renderer.value) {
        renderer.value.domElement.removeEventListener('click', clickEventOnRoom);
        renderer.value.domElement.removeEventListener('mousemove', moseMoveEventOnRoom);
    }
});

function clickEvent(event: MouseEvent, modal: THREE.Object3D<THREE.Object3DEventMap>) {
    if (!renderer.value || !camera.value || !modal || !raycaster.value || !mouse.value) return;

    const rect = renderer.value!.domElement.getBoundingClientRect();
    mouse.value.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.value.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.value.setFromCamera(mouse.value, camera.value!);

    return raycaster.value.intersectObject(modal, true);
}

function clickEventOnRoom(event: MouseEvent) {
    const intersects = clickEvent(event, roomModel.value!)

    for (const intersect of intersects!) {
        if (intersect.object.name === 'Cube003') {
            modal.value.openModal()
            break;
        }
    }
}

function moseMoveEventOnRoom(event: MouseEvent) {
    if (!renderer.value || !camera.value || !roomModel.value || !raycaster.value || !mouse.value) return;

    const rect = renderer.value.domElement.getBoundingClientRect();
    mouse.value.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.value.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.value.setFromCamera(mouse.value, camera.value);

    const intersects = raycaster.value.intersectObject(roomModel.value, true);

    let foundCube003 = false;
    for (const intersect of intersects) {
        if (intersect.object.name === 'Cube003') {
            foundCube003 = true;
            if (!isMouseOver.value) {
                isMouseOver.value = true;
                handleCube003MouseEnter();
            }
            break;
        }
    }

    if (!foundCube003 && isMouseOver.value) {
        isMouseOver.value = false;
        handleCube003MouseLeave();
    }
}

function handleCube003MouseEnter() {
    if (body) {
        body.style.cursor = "pointer"
    }
}

function handleCube003MouseLeave() {
    console.log('Mouse left Cube003');
    if (body) {
        body.style.cursor = "inherit"
    }
}

async function changeArmchair(path: string) {
    if (armchairModel.value && armchairModel.value.parent) {
        armchairModel.value.parent.remove(armchairModel.value);
        armchairModel.value = null; // Optionally, set the reference to null
    }

    loadingShow.value = true
    
    const armchair = await loadModel(
        `/models/${path}`,
        new THREE.Vector3(1, 1, 1),
        new THREE.Vector3(0, 0, 0),
        true
    );

    loadingShow.value = false

    armchairModel.value = armchair

    renderer.value!.domElement.addEventListener('click', clickEventOnArmchair);

    if (path === "armchair1.glb") {
        armchair.rotation.y = Math.PI * 1.5
        armchair.position.z = -6
        armchair.position.y = 1.4
        armchair.position.x = .8
    } else if (path === "armchair2.glb"){
        armchair.rotation.y = Math.PI * 1.5
        armchair.position.z = -7
        armchair.position.x = 4.8
        armchair.position.y = .8
    }


    scene.value!.add(armchair)

    function removeItem(name: string) {
        roomModel.value?.children.forEach(item => {
            if (item.name === name) {
                if (item.parent) {
                    item.parent.remove(item);
                }
            }
        })
    }

    if (roomModel.value) {
        removeItem("Text")
        removeItem("Cube003")
    }

    modal.value.closeModal()
}

function clickEventOnArmchair(event: MouseEvent) {
    console.log("hello");

    const intersects = clickEvent(event, armchairModel.value!)

    console.log(intersects);

    if (intersects?.length !== 0) {
        modal.value.openModal()
    }

}
</script>

<style>
.renderer-container {
    @apply w-full h-full overflow-hidden
}
</style>