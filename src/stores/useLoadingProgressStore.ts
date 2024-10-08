import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoadingStore = defineStore("loading", () => {
    const loadingProgress = ref<number>(0)
    const loadingShow = ref<boolean>(false)

    return {
        loadingProgress,
        loadingShow
    }
})