import { ref } from "vue";

const loadingShow = ref<boolean>(false)
const loadingProgress = ref<number>(0)

export { loadingProgress, loadingShow };