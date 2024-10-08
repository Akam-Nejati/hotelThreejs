import { defineStore } from "pinia";
import { useLoadModelStore } from "./useLoadModelStore";
import * as THREE from "three"
import { GLTF } from "three/examples/jsm/Addons.js";
import { useAnimateStore } from "./useAnimateStore";
import { useOrbitControlsStore } from "./useOrbitControlsStore";
import { shallowRef, toRefs, watch } from "vue";
import { useCurrentModel } from "./useCurrentModelStore";
import { useRoomStore } from "./useRoomStore";


export const useHotelStore = defineStore("hotel", () => {
    function useHotel(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera,): Promise<GLTF> {
        const { loadModel } = useLoadModelStore()
        const { controls, changeStatusOfControls } = useOrbitControlsStore()
        const raycaster = shallowRef<THREE.Raycaster | null>(null);
        const mouse = shallowRef<THREE.Vector2 | null>(null);
        // const { currentModel } = toRefs(useCurrentModel())
        const { cleanup: cleanupRoom } = useRoomStore();



        return new Promise(async (resolve, reject) => {
            try {
                cleanupRoom();

                const glb = await loadModel(scene, "hotel.glb")


                const { setAnimate } = useAnimateStore()
                setAnimate(renderer, scene, camera)

                controls?.update()

                camera.position.set(195.1306848732326, 74.80587868698026, -115.22309666251127)
                camera.rotation.set(-2.398704845741442, 0.6348168193747105, 2.6428753085514725)

                changeStatusOfControls(false)

                raycaster.value = new THREE.Raycaster();
                mouse.value = new THREE.Vector2();

                function clickEvent(event: MouseEvent, model: THREE.Object3D<THREE.Object3DEventMap>) {
                    if (!renderer || !camera || !model || !raycaster || !mouse) return;

                    const rect = renderer!.domElement.getBoundingClientRect();
                    mouse.value!.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                    mouse.value!.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                    raycaster.value!.setFromCamera(mouse.value!, camera!);

                    return raycaster.value!.intersectObject(model, true);
                }

                function clickEventOnHotel(event: MouseEvent) {
                    const intersects = clickEvent(event, glb.scene)
                    
                    for (const intersect of intersects!) {
                        if (['department1-1', "header001"].includes(intersect.object.name)) {
                            const { currentModel } = toRefs(useCurrentModel())
                            console.log(intersect.object.name);
                            
                            currentModel.value = "room"
                            break;
                        }
                    }
                }

                window.addEventListener("click" ,clickEventOnHotel)

                resolve(glb)
            } catch (error) {
                console.log(error);

                reject(error)
            }
        })
    }

    return {
        useHotel
    }
})