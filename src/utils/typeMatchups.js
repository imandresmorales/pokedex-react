const TYPE_MATCHUPS = {
  normal: {
    weak: ['fighting'],
    resist: [],
    immune: ['ghost']
  },
  fire: {
    weak: ['water', 'ground', 'rock'],
    resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immune: []
  },
  water: {
    weak: ['electric', 'grass'],
    resist: ['fire', 'water', 'ice', 'steel'],
    immune: []
  },
  electric: {
    weak: ['ground'],
    resist: ['electric', 'flying', 'steel'],
    immune: []
  },
  grass: {
    weak: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resist: ['water', 'electric', 'grass', 'ground'],
    immune: []
  },
  ice: {
    weak: ['fire', 'fighting', 'rock', 'steel'],
    resist: ['ice'],
    immune: []
  },
  fighting: {
    weak: ['flying', 'psychic', 'fairy'],
    resist: ['bug', 'rock', 'dark'],
    immune: []
  },
  poison: {
    weak: ['ground', 'psychic'],
    resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immune: []
  },
  ground: {
    weak: ['water', 'grass', 'ice'],
    resist: ['poison', 'rock'],
    immune: ['electric']
  },
  flying: {
    weak: ['electric', 'ice', 'rock'],
    resist: ['grass', 'fighting', 'bug'],
    immune: ['ground']
  },
  psychic: {
    weak: ['bug', 'ghost', 'dark'],
    resist: ['fighting', 'psychic'],
    immune: []
  },
  bug: {
    weak: ['fire', 'flying', 'rock'],
    resist: ['grass', 'fighting', 'ground'],
    immune: []
  },
  rock: {
    weak: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resist: ['normal', 'fire', 'poison', 'flying'],
    immune: []
  },
  ghost: {
    weak: ['ghost', 'dark'],
    resist: ['poison', 'bug'],
    immune: ['normal', 'fighting']
  },
  dragon: {
    weak: ['ice', 'dragon', 'fairy'],
    resist: ['fire', 'water', 'electric', 'grass'],
    immune: []
  },
  dark: {
    weak: ['fighting', 'bug', 'fairy'],
    resist: ['ghost', 'dark'],
    immune: ['psychic']
  },
  steel: {
    weak: ['fire', 'fighting', 'ground'],
    resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'],
    immune: ['poison']
  },
  fairy: {
    weak: ['poison', 'steel'],
    resist: ['fighting', 'bug', 'dark'],
    immune: ['dragon']
  }
};

const ALL_TYPES = Object.keys(TYPE_MATCHUPS);

/**
 * Calculates defensive effectiveness multipliers for a given set of types.
 * @param {string[]} defenderTypes - Array of 1 or 2 types (e.g. ['fire', 'flying'])
 * @returns {Object} Grouped effectiveness types with their multipliers
 */
export function getTypeMatchups(defenderTypes) {
  if (!defenderTypes || defenderTypes.length === 0) {
    return {
      weak4x: [],
      weak2x: [],
      resistHalf: [],
      resistQuarter: [],
      immune0x: []
    };
  }

  const results = {};

  // Initialize all types with 1x multiplier
  for (const type of ALL_TYPES) {
    results[type] = 1;
  }

  // Multiply based on defender types
  for (const defType of defenderTypes) {
    const cleanDefType = defType.toLowerCase();
    const matchups = TYPE_MATCHUPS[cleanDefType];
    
    if (!matchups) continue;

    // Weaknesses double the damage
    for (const weakType of matchups.weak) {
      results[weakType] *= 2;
    }
    // Resistances halve the damage
    for (const resistType of matchups.resist) {
      results[resistType] *= 0.5;
    }
    // Immunities reduce damage to 0
    for (const immuneType of matchups.immune) {
      results[immuneType] *= 0;
    }
  }

  // Group by multiplier
  const weak4x = [];
  const weak2x = [];
  const resistHalf = [];
  const resistQuarter = [];
  const immune0x = [];

  for (const type of ALL_TYPES) {
    const mult = results[type];
    if (mult === 4) {
      weak4x.push(type);
    } else if (mult === 2) {
      weak2x.push(type);
    } else if (mult === 0.5) {
      resistHalf.push(type);
    } else if (mult === 0.25) {
      resistQuarter.push(type);
    } else if (mult === 0) {
      immune0x.push(type);
    }
  }

  return {
    weak4x,
    weak2x,
    resistHalf,
    resistQuarter,
    immune0x
  };
}
