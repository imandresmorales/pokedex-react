import { Helmet } from 'react-helmet-async';

const SITE_NAME = 'Pokédex React';
const BASE_URL = 'https://imandresmorales.github.io/pokedex-react';

/**
 * SEO component for the Home page — includes JSON-LD ItemList schema
 */
export function HomeSeo() {
  const title = `${SITE_NAME} — Kanto Region`;
  const description =
    'Browse, search, and explore all 151 original Pokémon from the Kanto region. Filter by type, view base stats, abilities, and more.';

  /**
   * JSON-LD: ItemList schema for the Pokédex home page.
   * Helps search engines understand this is a catalogue of items.
   *
   * Security note: all values are static strings — no user input involved.
   * JSON.stringify is used for safe serialisation.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: title,
    description,
    url: BASE_URL,
    numberOfItems: 151,
    itemListElement: Array.from({ length: 151 }, (_, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/pokemon/${i + 1}`,
    })),
  };

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
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}

/**
 * SEO component for the Detail page — includes JSON-LD Thing schema
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

  /**
   * JSON-LD: Thing schema (closest schema.org type for a fictional creature).
   * Includes key attributes crawlers can extract: image, description, url.
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Thing',
    name,
    description,
    url,
    image,
    identifier: `#${number}`,
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Type',
        value: types,
      },
      {
        '@type': 'PropertyValue',
        name: 'Height',
        value: `${(pokemon.height / 10).toFixed(1)} m`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Weight',
        value: `${(pokemon.weight / 10).toFixed(1)} kg`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Base Experience',
        value: String(pokemon.base_experience),
      },
    ],
  };

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
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
