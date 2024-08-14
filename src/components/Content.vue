<script setup lang="ts">
import { AutoTyperVue } from "auto-typer-vue3";
import Threejs from "./Threejs.vue"
import { onMounted, ref } from "vue";

const titleText = [
    'This is a demo of our armchairs',
    'Welcome to our site ⁕',
    'Lets try armchairs in real environment'
];

const startText = [
    'For start choose an armchaire with click in choose button'
]

const isChooseBtnShow = ref<boolean>(false)

onMounted(() => {
    setTimeout(() => {
        isChooseBtnShow.value = true
    }, 19000)
})
const threejs = ref<any>()


function openSelectModal() {
    threejs.value.modal.openModal()
}
</script>

<template>
    <div class="h-[calc(100%-7.5rem)] grid xl:grid-cols-5 grid-cols-6 grid-rows-6">
        <div
            class="xl:col-span-2 lg:col-span-3 col-span-6 lg:order-1 order-2 lg:row-span-6 row-span-3 lg:px-24 px-12 flex flex-col justify-center gap-8">
            <div>
                <small class="tip">NEW FEATURES</small>
            </div>
            <div class="h-fit">
                <AutoTyperVue :typingDelay="100" :deletingDelay="100" componentTag="h6" :text="titleText"
                    :repeat="false"
                    class="text-slate-900 lg:text-6xl text-[7vw] font-bold drop-shadow-xl" />
            </div>
            <div>
                <AutoTyperVue :startDelay="17000" :typingDelay="100" :deletingDelay="100" componentTag="span"
                    :text="startText" :repeat="false"
                    class="text-slate-500 lg:text-[1vw] text-[3vw] font-bold drop-shadow-xl" />
            </div>
            <div>
                <div @click="openSelectModal()" :class="{'opacity-100': isChooseBtnShow}" class="opacity-0 btn bg-blue-500 text-white w-fit">
                    Choose
                </div>
            </div>
        </div>
        <div class="xl:col-span-3 lg:col-span-3 col-span-6 lg:order-2 order-1  lg:row-span-6 row-span-3">
            <Threejs ref="threejs"/>
        </div>
    </div>
</template>

<style scoped>
    .tip{
        @apply px-4 py-2 bg-pink-200 rounded-full text-blue-500 font-bold
    }
</style>