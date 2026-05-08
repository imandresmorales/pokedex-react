# 🔴 Pokédex React

Una Pokédex moderna y responsiva construida con **React** y alimentada por [PokéAPI](https://pokeapi.co/).

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white&style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white&style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-6+-CA4245?logo=react-router&logoColor=white&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)

---

## ✨ Funcionalidades

| Feature | Descripción |
|---|---|
| 🎴 **Grid de Pokémon** | Vista de los 151 Pokémon de Kanto con artwork oficial |
| 🔍 **Búsqueda** | Encuentra Pokémon por nombre o número al instante |
| 🏷️ **Filtros por tipo** | Filtra por cualquiera de los 18 tipos de Pokémon |
| 📊 **Stats animadas** | Barras de estadísticas con animación al entrar |
| 🧬 **Habilidades** | Visualiza habilidades normales y ocultas |
| 🌙 **Dark / Light Mode** | Switch para cambiar entre modo oscuro y claro, con persistencia en `localStorage` |
| 📱 **Responsive** | Adaptado para desktop, tablet y móvil (hasta 375px) |
| ♿ **Accesible** | Skip-link, ARIA labels, `aria-live`, touch targets mínimos de 44px, y `focus-visible` |
| 🧭 **Navegación** | Botones de anterior/siguiente entre Pokémon en la vista de detalle |
| 🚫 **Página 404** | Pantalla de error personalizada con animación |

---

## 🖼️ Capturas de pantalla

> El proyecto utiliza un diseño oscuro premium con acentos por tipo de Pokémon.

- **Home** — Grid con búsqueda y filtros por tipo
- **Detalle** — Información completa: artwork flotante, stats, habilidades y descripción

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

---

## 🛠️ Stack Tecnológico

| Herramienta | Uso |
|---|---|
| **React 18** | UI framework |
| **Vite 5** | Build tool ultrarrápido |
| **React Router 6** | Navegación client-side |
| **Vanilla CSS** | Sistema de diseño con variables CSS |
| **PokéAPI** | API REST de datos Pokémon (sin autenticación) |

---

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── Header/          # Barra de navegación con logo y theme toggle
│   ├── PokemonCard/     # Tarjeta individual de Pokémon
│   ├── SearchBar/       # Buscador + filtros por tipo (colapsables en mobile)
│   ├── StatsChart/      # Barras de estadísticas animadas
│   ├── ThemeToggle/     # Switch dark/light mode
│   └── TypeBadge/       # Etiqueta de tipo con color
├── context/
│   └── ThemeContext.jsx # Context API para el tema global
├── hooks/
│   ├── usePokemonList.js   # Carga paginada de la lista
│   └── usePokemonDetail.js # Carga de detalle + species
├── pages/
│   ├── Home.jsx         # Página principal con grid
│   ├── Detail.jsx       # Vista de detalle de un Pokémon
│   └── NotFound.jsx     # Página 404 personalizada
├── services/
│   └── pokeapi.js       # Capa de API con caché en memoria
└── utils/
    └── typeColors.js    # Paleta de colores por tipo
```

---

## 🗺️ Roadmap

- [x] Grid de Pokémon con paginación
- [x] Búsqueda por nombre y número
- [x] Filtros por tipo
- [x] Vista de detalle con stats y habilidades
- [x] Dark / Light mode con persistencia
- [x] Responsive y accesible (ARIA, skip-link, touch targets)
- [x] Página 404 personalizada
- [ ] Cadena evolutiva visual
- [ ] Comparador de Pokémon
- [ ] Favoritos con `localStorage`
- [ ] Reproducción del cry (sonido) de cada Pokémon
- [ ] Quiz "¿Quién es ese Pokémon?"
- [ ] Team builder con análisis de coberturas de tipo
- [ ] Soporte para todas las generaciones

---

## 📝 Licencia

Este proyecto es open source bajo la [Licencia MIT](LICENSE).

## 🙏 Créditos

- [PokéAPI](https://pokeapi.co/) — La API REST de Pokémon
- Pokémon es © Nintendo / Game Freak
