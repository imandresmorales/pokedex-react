import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { ContrastProvider } from './context/ContrastContext.jsx'
import { FontSizeProvider } from './context/FontSizeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <ContrastProvider>
          <FontSizeProvider>
            <FavoritesProvider>
              <App />
            </FavoritesProvider>
          </FontSizeProvider>
        </ContrastProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
