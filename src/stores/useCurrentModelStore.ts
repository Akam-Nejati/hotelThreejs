import { defineStore } from "pinia";
import { ref } from "vue";

export const useCurrentModel = defineStore("current model", () => {
    const currentModel = ref<"room" | "hotel">("hotel")  
    return {
        currentModel
    }
})