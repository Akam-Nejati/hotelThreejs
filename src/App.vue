<script setup lang="ts">
import Landing from "./components/Landing.vue"
import { toRefs } from 'vue';
import { useLoadingStore } from "./stores/useLoadingProgressStore";
import Loading from "./components/Loading.vue";

const { loadingShow } = toRefs(useLoadingStore())

// onMounted(async () => {
//     if ('serviceWorker' in navigator) {
//         window.addEventListener('load', () => {
//             navigator.serviceWorker.register('/service-worker.js')
//                 .then(registration => {
//                     console.log('Service Worker registered:', registration);
//                 })
//                 .catch(error => {
//                     console.log('Service Worker registration failed:', error);
//                 });
//         });
//     }
// })
</script>

<template>
    <div v-show="loadingShow">
        <Loading />
    </div>
    <div v-show="!loadingShow">
        <Landing />
    </div>
</template>

<style>

</style>