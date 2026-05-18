/**
 * Pokémon type colors — curated palette matching the official game aesthetics
 */
export const typeColors = {
  normal: { bg: '#A8A77A', text: '#fff' },
  fire: { bg: '#EE8130', text: '#fff' },
  water: { bg: '#6390F0', text: '#fff' },
  electric: { bg: '#F7D02C', text: '#333' },
  grass: { bg: '#7AC74C', text: '#fff' },
  ice: { bg: '#96D9D6', text: '#333' },
  fighting: { bg: '#C22E28', text: '#fff' },
  poison: { bg: '#A33EA1', text: '#fff' },
  ground: { bg: '#E2BF65', text: '#333' },
  flying: { bg: '#A98FF3', text: '#fff' },
  psychic: { bg: '#F95587', text: '#fff' },
  bug: { bg: '#A6B91A', text: '#fff' },
  rock: { bg: '#B6A136', text: '#fff' },
  ghost: { bg: '#735797', text: '#fff' },
  dragon: { bg: '#6F35FC', text: '#fff' },
  dark: { bg: '#705746', text: '#fff' },
  steel: { bg: '#B7B7CE', text: '#333' },
  fairy: { bg: '#D685AD', text: '#fff' },
};

/**
 * Get background gradient for a type
 */
export function getTypeGradient(type) {
  const color = typeColors[type]?.bg || '#777';
  return `linear-gradient(135deg, ${color}cc, ${color}88)`;
}

/**
 * Get a softer background for cards based on primary type
 */
export function getCardBackground(type) {
  const color = typeColors[type]?.bg || '#777';
  return `linear-gradient(160deg, ${color}22, ${color}11)`;
}

export const typeTranslationsES = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};
