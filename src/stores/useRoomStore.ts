import { defineStore } from "pinia";
import { useLoadModelStore } from "./useLoadModelStore";
import * as THREE from 'three';
import { Ref, ref } from "vue";
import { useAnimateStore } from "./useAnimateStore";
import { useOrbitControlsStore } from "./useOrbitControlsStore";

export const useRoomStore = defineStore("room", () => {
    const moveForward = ref(false);
    const moveBackward = ref(false);
    const moveLeft = ref(false);
    const moveRight = ref(false);

    let cleanupFunctions: (() => void)[] = [];

    async function useRoom(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, container: Ref<HTMLDivElement | null>) {
        const { loadModel } = useLoadModelStore()
        const { changeStatusOfControls } = useOrbitControlsStore()

        changeStatusOfControls(false)
        
        try {
            const glb = await loadModel(scene, '/room-1-1.glb')

            const canJump = ref(true);
            const { setAnimate, stopAnimate } = useAnimateStore()

            const velocity = new THREE.Vector3();
            const direction = new THREE.Vector3();
            const euler = new THREE.Euler(0, 0, 0, 'YXZ');


            // Movement parameters
            const MOVEMENT_SPEED = 7;
            const GRAVITY = 18;
            const JUMP_FORCE = 8;
            // camera.rotateX(1.5)
            camera.rotateY(-1.5)

            function updateMovement(delta: number) {
                // Apply friction and gravity
                velocity.x -= velocity.x * 10.0 * delta;
                velocity.z -= velocity.z * 10.0 * delta;
                velocity.y -= GRAVITY * delta;

                direction.z = Number(moveForward.value) - Number(moveBackward.value);
                direction.x = Number(moveRight.value) - Number(moveLeft.value);
                direction.normalize();

                // Create a new direction vector based on camera orientation
                const cameraDirection = new THREE.Vector3();
                camera.getWorldDirection(cameraDirection);
                cameraDirection.y = 0; // Prevent movement in the Y direction (up/down)

                // Create a right vector perpendicular to the camera's direction
                const cameraRight = new THREE.Vector3();
                cameraRight.crossVectors(camera.up, cameraDirection).normalize();

                // Calculate the move direction based on the camera's direction and the pressed keys
                const moveVector = new THREE.Vector3();
                moveVector.addScaledVector(cameraDirection, direction.z * MOVEMENT_SPEED * delta); // Forward/Backward
                moveVector.addScaledVector(cameraRight, direction.x * MOVEMENT_SPEED * delta); // Left/Right

                // Apply movement to a potential position
                const potentialPosition = camera.position.clone();
                potentialPosition.add(moveVector);

                // Check for wall collisions before moving the camera
                if (!checkWallCollision(potentialPosition)) {
                    camera.position.copy(potentialPosition);
                }

                // Vertical movement (jumping and falling)
                camera.position.y += velocity.y * delta;

                // Floor collision
                if (camera.position.y < 0) {
                    velocity.y = 0;
                    camera.position.y = 0;
                    canJump.value = true;
                }
            }

            function checkWallCollision(position: THREE.Vector3): boolean {
                if (
                    position.x < -1.3007450103759766 && position.z < 5.1058 ||
                    position.z < -9.25515713710073 ||
                    position.x > 19.358950180929448 ||
                    position.z > 12.268618317872416 ||
                    position.x < -23.71270501688958 && position.z < 12.268342599734497

                ) {
                    return true;
                }

                return false;
            }

            function onKeyDown(event: KeyboardEvent) {
                switch (event.code) {
                    case 'KeyW': moveForward.value = true; break;
                    case 'KeyA': moveRight.value = true; break; // Swap A with Right
                    case 'KeyS': moveBackward.value = true; break;
                    case 'KeyD': moveLeft.value = true; break;  // Swap D with Left
                    case 'Space':
                        if (canJump.value) {
                            velocity.y += JUMP_FORCE;
                            canJump.value = false;
                        }
                        break;
                }
            }

            function onKeyUp(event: KeyboardEvent) {
                switch (event.code) {
                    case 'KeyW': moveForward.value = false; break;
                    case 'KeyA': moveRight.value = false; break; // Swap A with Right
                    case 'KeyS': moveBackward.value = false; break;
                    case 'KeyD': moveLeft.value = false; break;  // Swap D with Left
                }
            }

            function onMouseMove(event: MouseEvent) {
                const movementX = event.movementX || 0;
                const movementY = event.movementY || 0;

                euler.y -= movementX * 0.002;
                euler.x -= movementY * 0.002;

                euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

                camera.quaternion.setFromEuler(euler);
            }

            let previousTouch: Touch | null = null;

            function onTouchStart(event:  TouchEvent) {
                previousTouch = event.touches[0];
            }

            function onTouchMove(event:  TouchEvent) {
                if (previousTouch) {
                    const currentTouch = event.touches[0];

                    // Calculate movement
                    const movementX: number = currentTouch.clientX - previousTouch.clientX;
                    const movementY: number = currentTouch.clientY - previousTouch.clientY;

                    euler.y -= movementX * 0.008;
                    euler.x -= movementY * 0.008;

                    euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

                    camera.quaternion.setFromEuler(euler);

                    // Update previous touch position
                    previousTouch = currentTouch;
                }
            }

            function pointerLock() {
                container.value?.requestPointerLock();
            }

            function addEventListeners() {
                document.addEventListener('keydown', onKeyDown);
                document.addEventListener('keyup', onKeyUp);
                container.value!.addEventListener('mousemove', onMouseMove);
                container.value!.addEventListener('touchstart', onTouchStart);
                container.value!.addEventListener('touchmove', onTouchMove);
                container.value!.addEventListener('click', pointerLock);
            }

            function removeEventListeners() {
                document.removeEventListener('keydown', onKeyDown);
                document.removeEventListener('keyup', onKeyUp);
                container.value!.removeEventListener('mousemove', onMouseMove);
                container.value!.removeEventListener('touchstart', onTouchStart);
                container.value!.removeEventListener('touchmove', onTouchMove);
                container.value!.removeEventListener('click', pointerLock);
            }

            addEventListeners()
            setAnimate(renderer, scene, camera, updateMovement)

            cleanupFunctions.push(() => {
                removeEventListeners();
                stopAnimate();
                
            });

            console.log(glb);
        } catch (error) {
            console.log(error);
        }
    }

    function cleanup() {
        cleanupFunctions.forEach(cleanup => cleanup());
        cleanupFunctions = [];
    }


    return {
        useRoom,
        moveBackward,
        moveForward,
        moveLeft,
        moveRight,
        cleanup
    }
})