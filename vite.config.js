import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Pokédex React',
        short_name: 'Pokédex',
        description: 'Browse, search, and explore all 151 original Pokémon.',
        theme_color: '#dc2626',
        background_color: '#0f0f14',
        display: 'standalone',
        icons: [
          {
            src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png',
            sizes: '30x30',
            type: 'image/png'
          },
          {
            src: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png',
            sizes: '30x30',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        // Cache PokeAPI responses and Github CDN images for offline use
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/pokeapi\.co\/api\/v2\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokeapi-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/raw\.githubusercontent\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'pokeapi-images-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],

  server: {
    // Security headers for the dev server
    headers: {
      // Prevent clickjacking
      'X-Frame-Options': 'DENY',
      // Block MIME-type sniffing
      'X-Content-Type-Options': 'nosniff',
      // Enable XSS filter in older browsers
      'X-XSS-Protection': '1; mode=block',
      // Control referrer information
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // Content Security Policy:
      //  - default-src 'self'                → only load resources from same origin by default
      //  - script-src 'self' 'unsafe-inline' → React needs inline scripts for hot-reload in dev
      //  - style-src 'self' 'unsafe-inline' fonts.googleapis.com → allow Google Fonts stylesheet
      //  - font-src fonts.gstatic.com        → allow Google Fonts files
      //  - img-src 'self' data: raw.githubusercontent.com → artwork images from GitHub CDN
      //  - connect-src 'self' pokeapi.co     → allow fetch calls to PokéAPI
      //  - media-src 'self' raw.githubusercontent.com → allow Pokémon cry audio
      //  - frame-ancestors 'none'            → prevent embedding this app in iframes
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src https://fonts.gstatic.com",
        "img-src 'self' data: https://raw.githubusercontent.com",
        "connect-src 'self' https://pokeapi.co",
        "media-src 'self' https://raw.githubusercontent.com",
        "frame-ancestors 'none'",
      ].join('; '),
    },
  },

  build: {
    // Generate source maps only for production debugging — never expose them publicly
    sourcemap: false,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 600,
  },
})
