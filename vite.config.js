import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

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
