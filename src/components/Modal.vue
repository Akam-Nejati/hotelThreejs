<template>
    <transition name="modal">
        <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            @click="closeModal">
            <div class="bg-[#cb997e] text-[#ddbea9] p-5 rounded-lg shadow-lg w-11/12 max-w-md relative" @click.stop>
                <div class="flex items-center justify-between">
                    <button class="absolute top-3 right-3 text-4xl translate-y-1"
                        @click="closeModal">&times;</button>

                    <slot name="Title"/>
                </div>
                <slot></slot>
            </div>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isOpen = ref(false);

const closeModal = () => {
    isOpen.value = false;
};

const openModal = () => {
    isOpen.value = true;
};

defineExpose({
    openModal,
    closeModal
});
</script>

<style scoped>
.modal-enter-active {
    transition: all 0.2s ease-out;
}

.modal-leave-active {
    transition: all 0.2s ease-in-out;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
    transform: scale(0.9);
}
</style>
