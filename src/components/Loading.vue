<script setup lang="ts">
import {loadingProgress} from '../stores/loadingProgress';
</script>

<template>
    <div class="fixed top-0 left-0 w-full h-screen bg-white/90 drop-shadow-xl flex justify-center items-center z-10">
        <div class="p-4 relative after:absolute after:top-0 after:left-0 after:bg-pink-400 after:h-full w-6/12"
            :class="`after:w-[${loadingProgress.toString()}%]`">
        </div>
    </div>
</template>