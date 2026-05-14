import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { ContrastProvider } from './context/ContrastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <ContrastProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </ContrastProvider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>,
)
