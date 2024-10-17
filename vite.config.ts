import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from "vite-plugin-pwa"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   devOptions: {
    //     enabled: true, // Enables the service worker during development
    //   },
    //   manifest: {
    //     name: 'Your App Name',
    //     short_name: 'App',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: '/icon-192x192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //       },
    //       {
    //         src: '/icon-512x512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    //   workbox: {
    //     maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // Increase to 100 MB or more
    //     runtimeCaching: [
    //       {
    //         urlPattern: ({ url }) => url.pathname.endsWith('.glb'), // Caching GLB models
    //         handler: 'CacheFirst', // Serve from cache first
    //         options: {
    //           cacheName: 'glb-cache', // Name of the cache for GLB files
    //           expiration: {
    //             maxEntries: 10, // Limit the number of models in the cache
    //             maxAgeSeconds: 60 * 60 * 24 * 30, // Cache models for 30 days
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200], // Cache responses with these statuses
    //           },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ],
  server: {
    host: true
  }
})
