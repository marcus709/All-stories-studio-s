// Array of contrasting colors for different users
export const userColors = [
  '#9b87f5', // Primary Purple
  '#0EA5E9', // Ocean Blue
  '#F97316', // Bright Orange
  '#D946EF', // Magenta Pink
  '#7E69AB', // Secondary Purple
  '#6E59A5', // Tertiary Purple
  '#8B5CF6', // Vivid Purple
];

// Default color if no user ID is provided
const DEFAULT_COLOR = '#9b87f5';

// Get a consistent color for a user based on their ID
export const getUserColor = (userId: string | undefined): string => {
  if (!userId) {
    return DEFAULT_COLOR;
  }
  
  // Use the user ID to get a consistent index
  const sum = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = sum % userColors.length;
  return userColors[colorIndex];
};