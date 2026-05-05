# 🔴 Pokédex React

A modern, responsive Pokédex web application built with React and powered by [PokéAPI](https://pokeapi.co/).

![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎴 **Browse Pokémon** — Grid view of the original 151 Kanto Pokémon with official artwork
- 🔍 **Search** — Find Pokémon by name or number instantly
- 🏷️ **Filter by Type** — Filter the grid by any of the 18 Pokémon types
- 📊 **Detailed Stats** — View base stats with animated bar charts
- 🧬 **Abilities** — See regular and hidden abilities
- 📱 **Responsive** — Looks great on desktop, tablet, and mobile
- 🌙 **Dark Mode** — Sleek dark theme with type-colored accents

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/pokedex-react.git

# Navigate to the project
cd pokedex-react

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Vite** — Lightning-fast build tool
- **React Router** — Client-side routing
- **Vanilla CSS** — Custom design system with CSS variables
- **PokéAPI** — RESTful Pokémon data

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── Header/
│   ├── PokemonCard/
│   ├── SearchBar/
│   ├── StatsChart/
│   └── TypeBadge/
├── hooks/              # Custom React hooks
│   ├── usePokemonList.js
│   └── usePokemonDetail.js
├── pages/              # Route pages
│   ├── Home.jsx
│   └── Detail.jsx
├── services/           # API layer
│   └── pokeapi.js
├── utils/              # Utilities & constants
│   └── typeColors.js
├── App.jsx
├── index.css
└── main.jsx
```

## 🗺️ Roadmap

- [ ] Evolution chain visualization
- [ ] Pokémon comparison tool
- [ ] Favorites with localStorage
- [ ] Pokémon cry audio playback
- [ ] "Who's that Pokémon?" quiz
- [ ] Team builder with type coverage analysis
- [ ] All generations support

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Credits

- [PokéAPI](https://pokeapi.co/) — The RESTful Pokémon API
- Pokémon is © Nintendo/Game Freak
