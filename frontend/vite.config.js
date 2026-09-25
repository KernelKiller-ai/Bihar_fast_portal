import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'sitemap.xml', 'sitemap-static.xml', 'logo.png'],
      manifest: {
        id: '/?source=pwa',
        name: 'BiharFast - Bihar Govt Jobs & Alerts',
        short_name: 'BiharFast',
        description: 'Bihar Latest Government Jobs, Admit Cards, and Results Fast Updates',
        categories: ['education', 'news', 'government'],
        theme_color: '#0B4F8A',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/logo-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/logo-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          { name: 'Jobs', short_name: 'Jobs', url: '/jobs', icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Admit Card', short_name: 'Admit Card', url: '/admit-card', icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }] },
          { name: 'Results', short_name: 'Results', url: '/results', icons: [{ src: '/logo-192.png', sizes: '192x192', type: 'image/png' }] }
        ]
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // Ye sabse important hai: API aur XML routes ko Service Worker bypass karega
        navigateFallbackDenylist: [/^\/api/, /\.xml$/]
      }
    })
  ],
  build: {
    // Cross-world preload warning fix
    modulePreload: {
      polyfill: false
    },
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react'
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons'
            }
          }
        }
      }
    }
  }
})