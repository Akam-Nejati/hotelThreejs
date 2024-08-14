<script setup lang="ts">
import Landing from "./components/Landing.vue"
import Loading from "./components/Loading.vue";
import {loadingShow} from "./stores/loadingProgress";
</script>

<template>
    <div v-show="loadingShow">
        <Loading />
    </div>
    <div v-show="!loadingShow">
        <Landing />
    </div>
</template>