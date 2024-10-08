<script setup lang="ts">
import { toRefs } from 'vue';
import { useLoadingStore } from '../stores/useLoadingProgressStore';

const { loadingProgress, } = toRefs(useLoadingStore())
</script>

<template>
    <div
        class="fixed top-0 left-0 w-full h-screen bg-[#212529] drop-shadow-xl flex flex-col gap-4 justify-center items-center z-10">
        <span class="text-xl text-slate-300 drop-shadow-xl font-bold">Download models, please wait</span>
        <div
            class="loading p-4 relative after:absolute after:top-0 after:left-0 after:bg-slate-300 after:h-full w-6/12 border border-slate-500 shadow-sm">
        </div>

        <span class="text-xl text-slate-300 drop-shadow-xl font-bold">{{ loadingProgress }}%</span>
    </div>
</template>

<style>
.loading::after {
    width: v-bind(loadingProgress + "%");
}
</style>