import { getFontDisplayUrl, type GoogleFont } from './google-fonts';

export interface RecommendFontsResponse {
  fonts: GoogleFont[];
}

export async function recommendFonts(prompt: string): Promise<GoogleFont[]> {
  const response = await fetch('/api/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Failed to get recommendations');
  }

  const data: RecommendFontsResponse = await response.json();
  return data.fonts;
}

export function loadFonts(fonts: GoogleFont[]): void {
  if (fonts.length === 0) return;

  const fontUrl = getFontDisplayUrl(fonts.map(f => f.family));
  const linkId = 'dynamic-fonts';
  let link = document.getElementById(linkId) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement('link');
    link.id = linkId;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }
  link.href = fontUrl;
}
