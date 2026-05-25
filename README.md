# 🔴 Pokédex React

Una Pokédex moderna, interactiva y responsiva construida con **React** y alimentada por [PokéAPI](https://pokeapi.co/). Rediseñada con características avanzadas de rendimiento, accesibilidad, internacionalización y utilidades completas para entrenadores.

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-6+-CA4245?logo=react-router&logoColor=white&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)
![PWA](https://img.shields.io/badge/PWA-Supported-00c7b7?logo=pwa&logoColor=white&style=flat-square)
![A11y](https://img.shields.io/badge/Accessibility-WCAG_AAA-blue?style=flat-square)

---

## ✨ Funcionalidades

| Feature | Descripción |
|---|---|
| 🎴 **Generaciones Completas** | Soporte para las 9 generaciones (1025 Pokémon) con paginación optimizada. |
| 🔍 **Búsqueda Avanzada** | Filtro instantáneo por nombre/número, selección de **tipo doble**, peso, altura y estadísticas mínimas. |
| 🔀 **Ordenación Dinámica** | Ordena por ID, Nombre (A-Z/Z-A), peso/altura y estadísticas individuales (HP, Ataque, Defensa, Velocidad, Total). |
| 🛡️ **Team Builder (Constructor de Equipos)** | Crea equipos de hasta 6 Pokémon con promedios estadísticos detallados y un **análisis defensivo acumulado** de debilidades elementales. |
| ⚖️ **Comparador Lado a Lado** | Compara detalladamente las estadísticas y dimensiones de dos Pokémon simultáneamente mediante una barra de selección persistente. |
| 🎮 **Quiz Mini-Game** | Minijuego interactivo "¿Quién es ese Pokémon?" con silueta interactiva, reveal animado, y contador de puntuación récord. |
| 📊 **Gráfico de Radar SVG** | Gráfico interactivo concéntrico hexagonal renderizado de forma nativa mediante SVG para las estadísticas base. |
| 📖 **Movimientos Diferidos (On-Demand)** | Acordeón interactivo que carga descripciones, potencia, precisión y categoría de daño en tiempo de clic para ahorrar ancho de banda. |
| 🗺️ **Datos de Captura y Encuentros** | Tasa de captura estimada, barra de ratio de género (Macho/Hembra/Sin género) y listado de las primeras 5 zonas de encuentros salvajes formateadas. |
| 🔊 **Reproducción de Gritos** | Botón para escuchar el sonido real (`cry`) del Pokémon directamente desde los servidores oficiales de la PokéAPI. |
| ❤️ **Favoritos** | Guarda tus Pokémon preferidos localmente (con animación de confeti al añadirlos) y fíltralos mediante una pestaña dedicada en la Home. |
| 🌐 **Internacionalización (i18n)** | Soporte completo multilingüe (Español / Inglés). Traduce automáticamente nombres de Pokémon, habilidades, tipos y descripciones. |
| ♿ **Accesibilidad Avanzada (a11y)** | Modo de Alto Contraste (WCAG AAA), control de tamaño de fuente ajustable, toggle de **Reducción de Movimiento** (apaga giros 3D y rebotes), skip-links y compatibilidad total con lectores de pantalla. |
| 📱 **Gestos y Mobile Native** | Soporte de gestos táctiles (Swipe izquierda/derecha para anterior/siguiente) y gesto interactivo de **Pull-to-Refresh** para recargar la lista. |
| ⚡ **Offline & PWA** | Aplicación web progresiva instalable que funciona sin conexión a Internet mediante service workers. |
| 🧭 **SEO Optimizado** | Generador dinámico de `sitemap.xml` para las 1025 páginas de Pokémon, etiquetas meta específicas y datos estructurados JSON-LD (`ItemList` y `Thing`) para Google. |

---

## 🖼️ Capturas de pantalla

> El proyecto utiliza un diseño premium con acentos dinámicos de color HSL basados en el tipo elemental de cada Pokémon.

- **Home** — Panel principal con búsqueda avanzada, ordenamiento y pestañas de categorías.
- **Detalle** — Sección interactiva de stats (Barras/Radar), grito audible, acordeón de movimientos, efectividad de tipos y zonas salvajes de captura.
- **Team Builder** — Gráfico defensivo de equipo y ranuras personalizadas.
- **Comparator** — Comparación estadística con indicadores visuales de ventaja.

---

## 🚀 Cómo ejecutar el proyecto

### Prerequisitos

- Node.js 18+
- npm

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/imandresmorales/pokedex-react.git

# Entrar a la carpeta
cd pokedex-react

# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Build para producción

```bash
npm run build
```

Este comando ejecuta la generación de `sitemap.xml` de forma dinámica y empaqueta la aplicación con Service Workers listos para el modo producción en la carpeta `dist`.

---

## 🛠️ Stack Tecnológico

| Herramienta | Uso |
|---|---|
| **React 18** | UI framework basado en componentes |
| **Vite 8** | Build tool ultrarrápido y servidor de desarrollo |
| **React Router 6** | Enrutamiento client-side responsivo |
| **Vite PWA Plugin** | Inyección de Service Workers y estrategias de precaché offline |
| **Vanilla CSS** | Sistema de diseño y variables CSS con adaptabilidad nativa |
| **PokéAPI** | API REST de datos Pokémon |

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── CompareBar/      # Barra flotante de selección para comparar Pokémon
│   ├── CompareButton/   # Botón para añadir/remover del comparador
│   ├── CryButton/       # Botón reproductor de sonidos del Pokémon
│   ├── EvolutionChain/  # Cadena evolutiva recursiva y enlazada
│   ├── FavoriteButton/  # Botón de favorito ❤️ (con efectos de confeti)
│   ├── Header/          # Navegación con controles de accesibilidad, idioma y tema
│   ├── MovesList/       # Acordeón de movimientos con fetching on-demand
│   ├── PokemonCard/     # Tarjeta individual con efecto de inclinación 3D (Tilt)
│   ├── ScrollToTop/     # Botón flotante para regresar al tope de la página
│   ├── SearchBar/       # Filtros avanzados, tipos múltiples y ordenación
│   ├── Seo/             # Inyección de JSON-LD y meta-tags por ruta
│   ├── SkeletonCard/    # Placeholders de carga (Skeletons)
│   ├── StatsChart/      # Gráficos de estadísticas (Barras / Radar SVG)
│   ├── ThemeToggle/     # Switch clásico para cambiar de tema
│   └── TypeBadge/       # Badges de tipos elementales
├── context/
│   ├── CompareContext.jsx   # Estado global del comparador de Pokémon
│   ├── ContrastContext.jsx  # Control de modo alto contraste (WCAG AAA)
│   ├── FavoritesContext.jsx # Gestión local de favoritos con persistencia
│   ├── FontSizeContext.jsx  # Tamaños de fuente dinámicos
│   ├── LanguageContext.jsx  # Control de idiomas (ES/EN)
│   ├── MotionContext.jsx    # Preferencias de reducción de movimiento
│   ├── TeamContext.jsx      # Almacenamiento y cálculo analítico del equipo
│   └── ThemeContext.jsx     # Gestión de tema oscuro/claro
├── hooks/
│   ├── use3DTilt.js         # Efecto de inclinación interactivo por mouse
│   ├── useEvolutionChain.js # Fetching y flattening de cadenas de evolución
│   ├── usePageTransition.js # Animación en transiciones entre rutas
│   ├── usePokemonCry.js     # Lógica y audio buffer para gritos
│   ├── usePokemonDetail.js  # Carga unificada de Pokémon y Species
│   ├── usePokemonList.js    # Carga de listas por offset y generación
│   ├── usePullToRefresh.js  # Soporte de gestos táctiles de recarga móvil
│   └── useSwipeNavigation.js# Soporte para gestos de swipe en móvil
├── pages/
│   ├── Compare.jsx      # Página de comparación estadística lado a lado
│   ├── Detail.jsx       # Detalle completo con stats, radar, movimientos y capturas
│   ├── Home.jsx         # Lista principal de Pokémon filtrable y ordenable
│   ├── NotFound.jsx     # Página 404 personalizada con animaciones
│   ├── Quiz.jsx         # Minijuego de adivinanza "¿Quién es ese Pokémon?"
│   └── Team.jsx         # Panel de Team Builder y análisis defensivo de coberturas
├── services/
│   └── pokeapi.js       # Servicios de red con caché en memoria (Map)
└── utils/
    ├── confetti.js      # Animación nativa de partículas al marcar favoritos
    ├── formatters.js    # Formateo regionalizado con Intl.NumberFormat
    ├── generations.js   # Límites e IDs de las 9 generaciones de Pokémon
    ├── typeColors.js    # Paleta de colores elementales HSL
    └── typeMatchups.js  # Matriz estática de debilidades/resistencias
```

---

## 🗺️ Roadmap Completado

- [x] Grid de Pokémon con paginación
- [x] Búsqueda por nombre y número
- [x] Filtros por tipo elemental
- [x] Vista de detalle con stats y habilidades
- [x] Dark / Light mode con persistencia
- [x] Responsive y accesible (ARIA, skip-link, touch targets)
- [x] Página 404 personalizada
- [x] Cadena evolutiva visual y enlazada
- [x] Comparador de Pokémon con ventajas estadísticas
- [x] Favoritos con `localStorage` y animación de confeti
- [x] Reproducción del cry (sonido) de cada Pokémon
- [x] Quiz "¿Quién es ese Pokémon?" con silueta interactiva y revelado
- [x] Team builder con análisis de coberturas de tipo acumuladas
- [x] Soporte para todas las 9 generaciones (1025 Pokémon)
- [x] Accesibilidad mejorada (Alto contraste, control de tamaño de fuente, reducción de movimiento)
- [x] Internacionalización completa (Español e Inglés con regionalización física)
- [x] Soporte offline completo (PWA) e interacciones táctiles móviles (Swipe y Pull-to-refresh)

---

## 📝 Licencia

Este proyecto es open source bajo la [Licencia MIT](LICENSE).

## 🙏 Créditos

- [PokéAPI](https://pokeapi.co/) — La API REST de Pokémon
- Pokémon es © Nintendo / Game Freak
