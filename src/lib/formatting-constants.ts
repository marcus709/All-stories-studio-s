
export interface BookSize {
  width: number;
  height: number;
  name: string;
  category: string;
}

export const PLATFORMS = [
  {
    name: "Amazon KDP",
    description: "Kindle Direct Publishing for both paperback and ebook formats",
    requirements: [
      "Trim sizes must match Amazon KDP options",
      "Interior margins should be at least 0.25 inches",
      "File must be PDF for print or EPUB for Kindle"
    ],
    trimSizes: [
      { width: 5, height: 8, name: "5\" x 8\"", category: "Pocket Book" },
      { width: 5.5, height: 8.5, name: "5.5\" x 8.5\"", category: "Half US Letter" },
      { width: 6, height: 9, name: "6\" x 9\"", category: "US Trade" },
      { width: 7, height: 10, name: "7\" x 10\"", category: "Textbook" },
      { width: 8.5, height: 11, name: "8.5\" x 11\"", category: "US Letter" }
    ]
  },
  {
    name: "IngramSpark",
    description: "Professional publishing platform with wide distribution",
    requirements: [
      "Higher quality requirements for cover files",
      "Stricter margin requirements based on page count",
      "Supports hardcover and paperback options"
    ],
    trimSizes: [
      { width: 5, height: 8, name: "5\" x 8\"", category: "Pocket Book" },
      { width: 5.5, height: 8.5, name: "5.5\" x 8.5\"", category: "Digest" },
      { width: 6, height: 9, name: "6\" x 9\"", category: "Standard" },
      { width: 7.5, height: 9.25, name: "7.5\" x 9.25\"", category: "Executive" },
      { width: 8.5, height: 11, name: "8.5\" x 11\"", category: "Letter" }
    ]
  },
  {
    name: "Lulu",
    description: "Self-publishing platform with flexible options",
    requirements: [
      "Supports various binding types",
      "Color and B&W interior options",
      "Premium paper options available"
    ],
    trimSizes: [
      { width: 4.25, height: 6.88, name: "4.25\" x 6.88\"", category: "Pocket" },
      { width: 5.5, height: 8.5, name: "5.5\" x 8.5\"", category: "Digest" },
      { width: 6, height: 9, name: "6\" x 9\"", category: "Standard" },
      { width: 8, height: 8, name: "8\" x 8\"", category: "Square" },
      { width: 8.5, height: 11, name: "8.5\" x 11\"", category: "Letter" }
    ]
  }
];
