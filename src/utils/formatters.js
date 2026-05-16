/**
 * Detects the user's preferred locale from the browser, gracefully falling back to 'en-US'.
 */
const getUserLocale = () => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.language) {
    return window.navigator.language;
  }
  return 'en-US';
};

/**
 * Formats a raw PokéAPI measurement (which is in decimeters/hectograms) 
 * into a proper regional string with its unit.
 * 
 * @param {number} value Raw API value
 * @param {'meter' | 'kilogram'} unit The unit to format to
 * @returns {string} Formatted string, e.g. "1,2 m" or "1.2 m" based on locale
 */
export const formatMeasurement = (value, unit) => {
  if (value == null) return 'Unknown';

  const locale = getUserLocale();
  // PokéAPI returns height in decimeters (1/10 of a meter) 
  // and weight in hectograms (1/10 of a kilogram).
  const normalizedValue = value / 10;

  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: unit,
    unitDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(normalizedValue);
};

/**
 * Formats standard numbers (like base experience or ID) with regional separators.
 * @param {number} num Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num == null) return '';
  return new Intl.NumberFormat(getUserLocale()).format(num);
};
