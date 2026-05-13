/**
 * generate-sitemap.js
 *
 * Generates a static sitemap.xml for the Pokédex React app.
 * Covers the 151 original Kanto Pokémon (Gen I).
 *
 * Run with: node scripts/generate-sitemap.js
 * Output:   public/sitemap.xml
 *
 * Security note: This script is a build-time tool only.
 * It writes to the /public directory and does NOT make any network
 * requests. No user input is involved — XSS/injection risk is zero.
 */

import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_URL = 'https://imandresmorales.github.io/pokedex-react';
const TOTAL_POKEMON = 151;
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

/** Escape XML special characters to prevent malformed output */
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildSitemap() {
  const staticRoutes = [
    { url: '/', changefreq: 'weekly', priority: '1.0' },
  ];

  const pokemonRoutes = Array.from({ length: TOTAL_POKEMON }, (_, i) => ({
    url: `/pokemon/${i + 1}`,
    changefreq: 'monthly',
    priority: '0.8',
  }));

  const allRoutes = [...staticRoutes, ...pokemonRoutes];

  const urlEntries = allRoutes
    .map(({ url, changefreq, priority }) =>
      [
        '  <url>',
        `    <loc>${escapeXml(BASE_URL + url)}</loc>`,
        `    <lastmod>${TODAY}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        '  </url>',
      ].join('\n')
    )
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urlEntries,
    '</urlset>',
    '',
  ].join('\n');
}

const outputPath = resolve(__dirname, '../public/sitemap.xml');
writeFileSync(outputPath, buildSitemap(), 'utf-8');
console.log(`✅ sitemap.xml generated → ${outputPath}`);
console.log(`   Entries: 1 static + ${TOTAL_POKEMON} Pokémon routes`);
