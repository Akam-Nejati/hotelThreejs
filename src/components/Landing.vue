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
    <div class="w-full h-screen bg-[#6b705c] grid grid-cols-5">
        <div class="col-span-3 flex justify-center items-center">
            <div class="flex flex-col items-center gap-2">
                <AutoTyperVue :typingDelay="100" :deletingDelay="100" componentTag="h6" :text="titleText"
                    :repeat="false" class="text-[#ffe8d6] text-[3vw] font-bold drop-shadow-xl" />
                <AutoTyperVue :startDelay="17000" :typingDelay="100" :deletingDelay="100" componentTag="span"
                    :text="startText" :repeat="false" class="text-[#ffe8d6] text-[1vw] font-bold drop-shadow-xl" />
            </div>
        </div>
        <div class="col-span-2">
            <Threejs />
        </div>
    </div>
</template>


<style scoped>
/* @import "auto-typer-vue3/dist/style.css"; */
</style>