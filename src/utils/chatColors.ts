const COLORS = [
  '#4F46E5', // indigo-600
  '#7C3AED', // violet-600
  '#DB2777', // pink-600
  '#059669', // emerald-600
  '#DC2626', // red-600
  '#D97706', // amber-600
  '#4338CA', // indigo-700
  '#6D28D9', // violet-700
  '#BE185D', // pink-700
  '#047857', // emerald-700
  '#B91C1C', // red-700
  '#B45309', // amber-700
];

export const getUserColor = (userId: string | undefined): string => {
  if (!userId) return COLORS[0];
  
  // Use a consistent way to generate a number from the userId
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  // Use the absolute value of the hash to ensure positive number
  const index = Math.abs(hash) % COLORS.length;
  return COLORS[index];
};