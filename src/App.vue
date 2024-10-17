<script setup lang="ts">
import Landing from "./components/Landing.vue"
import { toRefs } from 'vue';
import { useLoadingStore } from "./stores/useLoadingProgressStore";
import Loading from "./components/Loading.vue";

const { loadingShow } = toRefs(useLoadingStore())

// onMounted(async () => {
//     if ('serviceWorker' in navigator) {
//         window.addEventListener('load', () => {
//             navigator.serviceWorker.register('/sw.js')
//                 .then((registration) => {
//                     console.log('Service Worker registered with scope:', registration.scope);
//                 })
//                 .catch((registrationError) => {
//                     console.log('Service Worker registration failed:', registrationError);
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