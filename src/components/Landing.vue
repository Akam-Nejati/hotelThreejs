<script setup lang="ts">
import { AutoTyperVue } from "auto-typer-vue3";
import Threejs from "./Threejs.vue"

const titleText = [
    'This is a demo of our armchairs',
    'Welcome to our site ⁕',
    'Lets try armchairs in real environment'
];

const startText = [
    'For start choose an armchaire with click in choose button'
]

</script>

<template>
    <div class="w-full h-screen bg-[#6b705c] grid xl:grid-cols-5 grid-cols-6 grid-rows-6">
        <div
            class="xl:col-span-3 md:col-span-3 col-span-6 md:order-1 order-2 md:row-span-6 row-span-3 flex justify-center items-center">
            <div class="flex flex-col items-center gap-2">
                <AutoTyperVue :typingDelay="100" :deletingDelay="100" componentTag="h6" :text="titleText"
                    :repeat="false"
                    class="text-[#a5a58d] md:text-[3vw] text-[7vw] font-bold drop-shadow-xl text-center" />
                <AutoTyperVue :startDelay="17000" :typingDelay="100" :deletingDelay="100" componentTag="span"
                    :text="startText" :repeat="false"
                    class="text-[#a5a58d] md:text-[1vw] text-[3vw] font-bold drop-shadow-xl text-center" />
            </div>
        </div>
        <div class="xl:col-span-2 md:col-span-3 col-span-6 md:order-2 order-1 h-[50dvh] md:row-span-6 row-span-3">
            <Threejs />
        </div>
    </div>
</template>


<style scoped>
/* @import "auto-typer-vue3/dist/style.css"; */
</style>