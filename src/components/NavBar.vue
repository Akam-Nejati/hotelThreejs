<script setup lang="ts">
const menuItem: { lable: string, link: string, selected: boolean }[] = [
    {
        lable: "Plans",
        link: "#",
        selected: true
    },
    {
        lable: "Blog",
        link: "#",
        selected: false
    },
    {
        lable: "Job",
        link: "#",
        selected: false
    },
    {
        lable: "Features",
        link: "#",
        selected: false
    }
]
</script>

<template>
    <div class="w-full px-3 py-3 lg:py-8 lg:px-16 flex justify-between items-center overflow-visible">
        <div>
            <span class="lg:text-3xl text-2xl font-bold">Box</span>
        </div>
        <div>
            <ul class="flex justify-between lg:gap-8 gap-3">
                <li v-for="item in menuItem" class="lg:text-xl text-md text-gray-400 font-bold drop-shadow-xl" :class="{ '!text-gray-700': item.selected}">
                    <a :href="item.link">
                        {{ item.lable }}
                    </a>
                </li>
            </ul>
        </div>
        <div>
            <div class="btn bg-slate-900 text-white">
                Sign In
            </div>
        </div>
    </div>
</template>