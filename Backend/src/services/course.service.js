import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load dataset once at startup
const datasetPath = join(__dirname, '../../files/courses_dataset.json');
const dataset = JSON.parse(readFileSync(datasetPath, 'utf-8'));

/**
 * Build a normalized lookup map for fast skill → courses resolution.
 * Handles case-insensitive matching and common aliases.
 */
const buildSkillMap = (courses) => {
  const map = new Map();

  for (const entry of courses) {
    const normalizedName = entry.skill_name.toLowerCase().trim();
    map.set(normalizedName, entry);

    // Add common alias variants (e.g. "react.js" → "React.js", "node" → "Node.js")
    const aliases = generateAliases(entry.skill_name);
    for (const alias of aliases) {
      if (!map.has(alias)) {
        map.set(alias, entry);
      }
    }
  }

  return map;
};

const generateAliases = (skillName) => {
  const aliases = [];
  const lower = skillName.toLowerCase();

  // "React.js" → "react", "reactjs"
  if (lower.endsWith('.js')) {
    aliases.push(lower.replace('.js', ''));
    aliases.push(lower.replace('.', ''));
  }

  // "Node.js" → "node", "nodejs"
  if (lower.includes('.')) {
    aliases.push(lower.replace(/\./g, ''));
  }

  // "Go (Golang)" → "go", "golang"
  const parenMatch = lower.match(/^(.+?)\s*\((.+?)\)$/);
  if (parenMatch) {
    aliases.push(parenMatch[1].trim());
    aliases.push(parenMatch[2].trim());
  }

  // "Amazon Web Services" → "aws", "amazon web services"
  // "Machine Learning" → "ml"
  const acronymMap = {
    'amazon web services': ['aws'],
    'machine learning': ['ml'],
    'artificial intelligence': ['ai'],
    'natural language processing': ['nlp'],
    'continuous integration/continuous deployment': ['ci/cd', 'cicd'],
    'ci/cd': ['continuous integration/continuous deployment', 'cicd'],
    'rest api': ['restful api', 'rest apis', 'restful apis'],
  };

  if (acronymMap[lower]) {
    aliases.push(...acronymMap[lower]);
  }

  return aliases;
};

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
      skill_name: entry.skill_name,
      levels: entry.levels,
    };
  }

  // Fallback: partial matching (e.g. "React" matches "React.js")
  for (const [key, value] of skillMap) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return {
        skill_name: value.skill_name,
        levels: value.levels,
      };
    }
  }

  return null;
};

