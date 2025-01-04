export const calculateReadability = (text: string): number => {
  if (!text.trim()) return 0;
  
  // Count sentences (roughly) by splitting on .!?
  const sentences = text.split(/[.!?]+/).filter(Boolean).length;
  
  // Count words
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  
  // Count syllables (rough approximation)
  const syllables = countSyllables(text);
  
  if (words === 0 || sentences === 0) return 0;
  
  // Flesch Reading Ease score
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  
  // Clamp score between 0 and 100
  return Math.min(Math.max(Math.round(score), 0), 100);
};

const countSyllables = (text: string): number => {
  const words = text.toLowerCase().split(/\s+/);
  return words.reduce((total, word) => {
    return total + countWordSyllables(word);
  }, 0);
};

const countWordSyllables = (word: string): number => {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (word.length <= 3) return 1;
  
  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');
  
  const syllables = word.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
};