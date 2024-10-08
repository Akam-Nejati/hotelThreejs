<script setup>
import Threejs from "./Threejs.vue"

</script>

<template>
    <!-- Main Banner -->
    <section class="container mx-auto my-12">
        <div class="flex flex-col gap-8 lg:flex-row-reverse items-center">
            <div class="lg:w-1/2 w-full mb-8 lg:mb-0">
                <Threejs />
                <!-- <img src="../assets/img/hotel-banner.png" alt="Hotel" class="rounded-lg w-full" /> -->
            </div>
            <div class="lg:w-1/2 text-right">
                <h3 class="text-2xl font-bold mb-4 text-slate-300">آرامش و لحظات به یاد ماندنی را در هتل المپیک
                    تجربه کنید.
                </h3>
                <p class="mb-4 text-justify text-slate-300">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک
                    است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی
                    تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی
                    در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم
                    افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان
                    فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و
                    شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات
                    پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
                </p>
            </div>
        </div>
    </section>

    <!-- Suite Booking Section -->
    <section class="container mx-auto my-12">
        <h2 class="text-2xl font-bold text-[#f0c419] mb-8 text-right">رزرو سوئیت‌های ما</h2>
        <p class="text-right mb-8 font-bold text-lg text-slate-300">لورم ایپسوم متن ساختگی با تولید سادگی
            نامفهوم از صنعت چاپ و با استفاده از
            طراحان
            گرافیک است</p>
        <div class="grid md:grid-cols-2 gap-8">
            <div class="bg-[#2c2e30] h-fit text-black rounded-3xl shadow-xl overflow-hidden">
                <img src="../assets/img/hotel-banner.png" alt="Suite Royal" class="w-full" />
                <div class="p-4">
                    <div class="flex justify-between items-center">
                        <h5 class="font-bold mb-2 text-slate-300 drop-shadow-xl">لورم ایپسوم متن</h5>

                        <div class="rating">
                            <span class="text-yellow-400">☆</span>
                            <span class="text-yellow-400">★</span>
                            <span class="text-yellow-400">★</span>
                            <span class="text-yellow-400">★</span>
                            <span class="text-yellow-400">★</span>
                        </div>
                    </div>
                    <div class="mt-2 flex justify-between items-center">
                        <h5 class="text-slate-300">سوئیت رویال</h5>
                        <p class="text-slate-300"> $200 یک شب</p>
                    </div>
                </div>
            </div>
            <div class="bg-[#2c2e30] h-fit text-black rounded-3xl shadow-xl overflow-hidden">
                <img src="../assets/img/hotel-banner.png" alt="Suite Deluxe" class="w-full" />
                <div class="p-4">
                    <div class="flex justify-between items-center">
                        <h5 class="font-bold mb-2 text-slate-300 drop-shadow-xl">لورم ایپسوم متن</h5>

                        <div class="rating">
                            <span class="text-yellow-400">☆</span>
                            <span class="text-yellow-400">★</span>
                            <span class="text-yellow-400">★</span>
                            <span class="text-yellow-400">★</span>
                            <span class="text-yellow-400">★</span>
                        </div>
                    </div>
                    <div class="mt-2 flex justify-between items-center">
                        <h5 class="text-slate-300">سوئیت رویال</h5>
                        <p class="text-slate-300"> $200 یک شب</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Memorable Stay Section -->
    <section class="container mx-auto my-12">
        <div class="bg-[#2c2e30] text-slate-300 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <img src="../assets/img/hotel-banner.png" alt="Memorable Stay" class="md:w-1/2 object-cover" />
            <div class="md:w-1/2 p-8 flex flex-col justify-center">
                <h3 class="text-2xl font-bold mb-4 text-right">لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از
                    صنعت
                </h3>
                <p class="mb-4 text-right">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک
                    است،
                    چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است...
                </p>
                <a href="#"
                    class="bg-[#f0c419] text-black py-2 px-4 rounded hover:bg-[#e0b716] transition duration-300 self-start">اینجا
                    جستجو کنید</a>
            </div>
        </div>
    </section>

    <!-- Additional Section -->
    <section class="container mx-auto my-12">
        <div class="flex flex-col lg:flex-row">
            <div class="lg:w-1/2 mb-8 lg:mb-0">
                <img src="../assets/img/Group 11214.png" alt="Suite Royal"
                    class="w-full h-full object-cover rounded-lg" />
            </div>
            <div class="lg:w-1/2 bg-[#2c2e30] text-slate-300 rounded-3xl shadow-xl p-8">
                <h5 class="text-xl font-bold mb-4 text-right">لورم ایپسوم متن</h5>
                <p class="mb-4 text-right">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک
                    است،
                    چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است...
                </p>
                <a href="#"
                    class="bg-[#f0c419] text-black py-2 px-4 rounded hover:bg-[#e0b716] transition duration-300 block w-max">اینجا
                    جستجو کنید</a>
            </div>
        </div>
    </section>
</template>

<style scoped></style>
