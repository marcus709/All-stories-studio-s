export interface BookSize {
  width: number;
  height: number;
  name: string;
  category: string;
}

export interface DigitalFormat {
  name: string;
  extension: string;
  description: string;
  platforms: string[];
}

export const BOOK_SIZES: BookSize[] = [
  // Trade Paperback
  { width: 5, height: 8, name: "5\" × 8\"", category: "Trade Paperback" },
  { width: 5.25, height: 8, name: "5.25\" × 8\"", category: "Trade Paperback" },
  { width: 5.5, height: 8.5, name: "5.5\" × 8.5\"", category: "Trade Paperback" },
  { width: 6, height: 9, name: "6\" × 9\"", category: "Trade Paperback" },
  
  // Mass Market
  { width: 4.25, height: 6.87, name: "4.25\" × 6.87\"", category: "Mass Market" },
  { width: 4.37, height: 7, name: "4.37\" × 7\"", category: "Mass Market" },
  
  // Hardcover
  { width: 5.5, height: 8.5, name: "5.5\" × 8.5\"", category: "Hardcover" },
  { width: 6, height: 9, name: "6\" × 9\"", category: "Hardcover" },
  { width: 6.14, height: 9.21, name: "6.14\" × 9.21\"", category: "Hardcover" },
  { width: 7, height: 10, name: "7\" × 10\"", category: "Hardcover" },
  
  // Non-Fiction & Academic
  { width: 8, height: 10, name: "8\" × 10\"", category: "Non-Fiction" },
  { width: 8.5, height: 11, name: "8.5\" × 11\"", category: "Non-Fiction" },
  
  // Children's Books
  { width: 8, height: 8, name: "8\" × 8\"", category: "Children's" },
  { width: 8.5, height: 8.5, name: "8.5\" × 8.5\"", category: "Children's" },
  { width: 11, height: 8.5, name: "11\" × 8.5\" (Landscape)", category: "Children's" },
  { width: 6, height: 9, name: "6\" × 9\" (Compact)", category: "Children's" },
  
  // Photo & Coffee Table
  { width: 8, height: 10, name: "8\" × 10\"", category: "Photo Book" },
  { width: 11, height: 8.5, name: "11\" × 8.5\" (Landscape)", category: "Photo Book" },
  { width: 12, height: 12, name: "12\" × 12\" (Square)", category: "Photo Book" },
  
  // International Sizes
  { width: 5.83, height: 8.27, name: "A5 (5.83\" × 8.27\")", category: "International" },
  { width: 8.27, height: 11.69, name: "A4 (8.27\" × 11.69\")", category: "International" },
  { width: 6.93, height: 9.84, name: "B5 (6.93\" × 9.84\")", category: "International" },
];

export const DIGITAL_FORMATS: DigitalFormat[] = [
  {
    name: "EPUB",
    extension: ".epub",
    description: "Most widely accepted reflowable format",
    platforms: ["Apple Books", "Kobo", "Google Play Books"],
  },
  {
    name: "Kindle Format",
    extension: ".kpf",
    description: "Amazon's preferred format for Kindle devices",
    platforms: ["Amazon Kindle"],
  },
  {
    name: "PDF",
    extension: ".pdf",
    description: "Fixed-layout format for graphic-heavy books",
    platforms: ["All Platforms"],
  },
  {
    name: "HTML5",
    extension: ".html",
    description: "Interactive eBooks with multimedia content",
    platforms: ["Web Browsers"],
  },
];

export const COVER_REQUIREMENTS = {
  kindle: {
    width: 2560,
    height: 1600,
    ratio: "1.6:1",
    format: "JPG/TIFF",
  },
  apple: {
    ratio: "3:4",
    format: "JPG/PNG",
    minWidth: 1400,
  },
  kobo: {
    width: 1072,
    height: 1448,
    ratio: "3:4",
    format: "JPG/PNG",
  },
};