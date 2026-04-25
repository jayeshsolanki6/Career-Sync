import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load dataset once at startup
const datasetPath = join(__dirname, '../../files/courses_dataset.json');
const dataset = JSON.parse(readFileSync(datasetPath, 'utf-8'));

/**
 * Build a normalized lookup map for fast skill → courses resolution.
 * Handles case-insensitive matching and explicit aliases from the dataset.
 */
const buildSkillMap = (courses) => {
  const map = new Map();

  for (const entry of courses) {
    // entry.skill_names contains all the names and aliases
    // if (Array.isArray(entry.skill_names)) {
    for (const name of entry.skill_names) {
      const normalizedName = name.toLowerCase().trim();
      if (!map.has(normalizedName)) {
        map.set(normalizedName, entry);
      }
    }
    // }
  }

  return map;
};

// Removed generateAliases since we use the explicit skill_names from the dataset

const skillMap = buildSkillMap(dataset.courses);

/**
 * Get courses for a single skill name. Case-insensitive + alias matching.
 * @param {string} skillName
 * @returns {{ skill_name: string, levels: object } | null}
 */
export const getCoursesForSkill = (skillName) => {
  if (!skillName) return null;

  const normalized = skillName.toLowerCase().trim();
  const entry = skillMap.get(normalized);

  if (entry) {
    return {
      skill_name: entry.skill_names ? entry.skill_names[0] : skillName, // Use primary name
      levels: entry.levels,
    };
  }

  // Fallback: partial matching (e.g. "React" matches "React.js")
  for (const [key, value] of skillMap) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return {
        skill_name: value.skill_names ? value.skill_names[0] : key,
        levels: value.levels,
      };
    }
  }

  return null;
};

