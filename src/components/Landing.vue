<script setup lang="ts">
import Header from './Header.vue';
import Content from './Content.vue';
import Footer from "./Footer.vue"
</script>


<template>
    <div class="flex justify-center">
        <div class="text-white font-vazir rtl md:w-8/12 w-11/12">

            <Header />

            <Content />

            <Footer />
        </div>
    </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Vazir&display=swap');

body {
    font-family: 'Vazir', sans-serif;
    background-color: #212529 !important;
    color: #ffffff;
    direction: rtl;
    text-align: right;
}
</style>