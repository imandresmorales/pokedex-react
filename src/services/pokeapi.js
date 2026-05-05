const BASE_URL = 'https://pokeapi.co/api/v2';

// Simple in-memory cache to respect PokéAPI's fair use policy
const cache = new Map();

async function cachedFetch(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  const data = await response.json();
  cache.set(url, data);
  return data;
}

/**
 * Fetch a paginated list of Pokémon
 */
export async function fetchPokemonList(limit = 20, offset = 0) {
  const data = await cachedFetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  return data;
}

/**
 * Fetch detailed data for a single Pokémon (by id or name)
 */
export async function fetchPokemon(idOrName) {
  return cachedFetch(`${BASE_URL}/pokemon/${idOrName}`);
}

/**
 * Fetch species data (descriptions, evolution chain, habitat, etc.)
 */
export async function fetchPokemonSpecies(idOrName) {
  return cachedFetch(`${BASE_URL}/pokemon-species/${idOrName}`);
}

/**
 * Fetch evolution chain data
 */
export async function fetchEvolutionChain(url) {
  return cachedFetch(url);
}

/**
 * Fetch type data (damage relations, pokémon of that type)
 */
export async function fetchType(idOrName) {
  return cachedFetch(`${BASE_URL}/type/${idOrName}`);
}

/**
 * Fetch all types
 */
export async function fetchAllTypes() {
  const data = await cachedFetch(`${BASE_URL}/type?limit=30`);
  // Filter out unknown and shadow types
  return data.results.filter(t => !['unknown', 'shadow', 'stellar'].includes(t.name));
}

/**
 * Get the official artwork URL for a Pokémon
 */
export function getOfficialArtwork(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/**
 * Get the Pokémon ID from a resource URL
 */
export function getIdFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  return parseInt(parts[parts.length - 1], 10);
}

/**
 * Get English flavor text from species data
 */
export function getEnglishFlavorText(speciesData) {
  const entry = speciesData.flavor_text_entries?.find(
    (e) => e.language.name === 'en'
  );
  return entry?.flavor_text?.replace(/\f|\n/g, ' ') || 'No description available.';
}

/**
 * Get English genus from species data
 */
export function getEnglishGenus(speciesData) {
  const entry = speciesData.genera?.find(
    (e) => e.language.name === 'en'
  );
  return entry?.genus || '';
}
