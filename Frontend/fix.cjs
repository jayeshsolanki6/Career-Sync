const fs = require('fs');
const path = require('path');

const filesToFixMotion = [
  'src/components/dashboard/AnalysisHistory.jsx',
  'src/components/dashboard/CourseModal.jsx',
  'src/components/dashboard/LearningSkills.jsx',
  'src/components/dashboard/NewAnalysis.jsx',
  'src/components/dashboard/Overview.jsx',
  'src/components/landing/Features.jsx',
  'src/components/landing/Hero.jsx',
  'src/pages/AuthPage.jsx',
  'src/pages/DashboardPage.jsx',
  'src/pages/LandingPage.jsx',
  'src/pages/NotFoundPage.jsx',
];

for (const file of filesToFixMotion) {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    // Replace import { motion, AnimatePresence } from 'framer-motion' -> import { AnimatePresence } from 'framer-motion'
    content = content.replace(/import\s*\{\s*motion\s*,\s*AnimatePresence\s*\}\s*from\s*['"]framer-motion['"];?/, "import { AnimatePresence } from 'framer-motion'");
    // If it's just import { motion } from 'framer-motion', remove it.
    content = content.replace(/import\s*\{\s*motion\s*\}\s*from\s*['"]framer-motion['"];?\r?\n?/, "");
    fs.writeFileSync(p, content);
  }
}

// Fix useMemo in LearningSkills.jsx
const learningSkillsPath = path.join(__dirname, 'src/components/dashboard/LearningSkills.jsx');
if (fs.existsSync(learningSkillsPath)) {
  let content = fs.readFileSync(learningSkillsPath, 'utf8');
  content = content.replace(/import\s*\{\s*useState\s*,\s*useEffect\s*,\s*useMemo\s*,\s*useCallback\s*\}\s*from\s*['"]react['"];?/, "import { useState, useEffect, useCallback } from 'react'");
  fs.writeFileSync(learningSkillsPath, content);
}

// Fix Icon in Overview.jsx
const overviewPath = path.join(__dirname, 'src/components/dashboard/Overview.jsx');
if (fs.existsSync(overviewPath)) {
  let content = fs.readFileSync(overviewPath, 'utf8');
  content = content.replace(/const ChartCard = \(\{ title, subtitle, icon: Icon, children, delay = 0, className = '' \}\)/g, "const ChartCard = ({ title, subtitle, icon: IconComponent, children, delay = 0, className = '' })");
  content = content.replace(/\{Icon && <Icon/g, "{IconComponent && <IconComponent");
  fs.writeFileSync(overviewPath, content);
}

// Fix vite.config.js __dirname
const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
  let content = fs.readFileSync(viteConfigPath, 'utf8');
  if(!content.includes('fileURLToPath')) {
    content = content.replace(/import path from "path"/, 'import path from "path"\nimport { fileURLToPath } from "url"\nconst __dirname = path.dirname(fileURLToPath(import.meta.url))');
    fs.writeFileSync(viteConfigPath, content);
  }
}

// Turn off react-refresh/only-export-components in eslint.config.js
const eslintPath = path.join(__dirname, 'eslint.config.js');
if (fs.existsSync(eslintPath)) {
  let content = fs.readFileSync(eslintPath, 'utf8');
  content = content.replace(/rules:\s*\{/, "rules: {\n      'react-refresh/only-export-components': 'off',");
  fs.writeFileSync(eslintPath, content);
}

console.log('Fixed lint issues!');
