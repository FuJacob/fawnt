export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: string;
  files: Record<string, string>;
}

interface GoogleFontsResponse {
  items: GoogleFont[];
}

const GOOGLE_FONTS_API_KEY = process.env.GOOGLE_FONTS_API_KEY!;

// Server-side cache
let cachedFonts: GoogleFont[] | null = null;
let cacheTime = 0;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export async function fetchAllFonts(): Promise<GoogleFont[]> {
  // Return cached data if still valid
  if (cachedFonts && Date.now() - cacheTime < CACHE_TTL) {
    return cachedFonts;
  }

  const response = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch fonts: ${response.statusText}`);
  }

  const data: GoogleFontsResponse = await response.json();

  // Update cache
  cachedFonts = data.items;
  cacheTime = Date.now();

  return cachedFonts;
}

export function getFontDisplayUrl(families: string[]): string {
  const familyParams = families
    .map(f => f.replace(/ /g, '+'))
    .join('&family=');
  return `https://fonts.googleapis.com/css2?family=${familyParams}&display=swap`;
}

export function getFontFamilyNames(fonts: GoogleFont[]): string[] {
  return fonts.map(f => f.family);
}
