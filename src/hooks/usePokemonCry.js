import { useState, useRef, useCallback } from 'react';

/**
 * Hook to play a Pokémon's cry audio.
 *
 * Uses the latest cry URL from the PokéAPI sprites CDN.
 * Falls back to the legacy cry if the modern one fails.
 *
 * Security note: Audio is fetched from a trusted CDN (raw.githubusercontent.com)
 * which is already whitelisted in the CSP media-src directive.
 *
 * @param {number} pokemonId
 * @returns {{ play: Function, isPlaying: boolean, isSupported: boolean }}
 */
export function usePokemonCry(pokemonId) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Both CDN URLs — modern (ogg) and legacy (ogg) as backup
  const modernUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
  const legacyUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/legacy/${pokemonId}.ogg`;

  // Check if browser supports Audio API
  const isSupported = typeof Audio !== 'undefined';

  const play = useCallback(() => {
    if (!isSupported || isPlaying) return;

    // Stop any in-progress audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const audio = new Audio(modernUrl);
    audio.volume = 0.6;
    audioRef.current = audio;

    const handleEnd = () => setIsPlaying(false);
    const handleError = () => {
      // Try legacy URL on failure
      const fallback = new Audio(legacyUrl);
      fallback.volume = 0.6;
      audioRef.current = fallback;
      fallback.addEventListener('ended', handleEnd);
      fallback.play().catch(() => setIsPlaying(false));
    };

    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('error', handleError);

    setIsPlaying(true);
    audio.play().catch(() => setIsPlaying(false));
  }, [isPlaying, isSupported, modernUrl, legacyUrl]);

  return { play, isPlaying, isSupported };
}
