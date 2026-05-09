import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Pokédex React';
const BASE_URL = 'https://imandresmorales.github.io/pokedex-react';

/**
 * SEO component for the Home page
 */
export function HomeSeo() {
  const title = `${SITE_NAME} — Kanto Region`;
  const description =
    'Browse, search, and explore all 151 original Pokémon from the Kanto region. Filter by type, view base stats, abilities, and more.';

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={BASE_URL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}

/**
 * SEO component for the Detail page
 * @param {{ pokemon: object, species: object }} props
 */
export function DetailSeo({ pokemon, species }) {
  if (!pokemon) return null;

  const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  const number = String(pokemon.id).padStart(3, '0');
  const types = pokemon.types.map((t) => t.type.name).join(' / ');
  const title = `${name} #${number} — ${SITE_NAME}`;
  const description =
    species?.description ||
    `${name} is a ${types} type Pokémon. View its base stats, abilities, height, weight and more.`;
  const image = pokemon.sprites.other['official-artwork'].front_default;
  const url = `${BASE_URL}/pokemon/${pokemon.id}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
