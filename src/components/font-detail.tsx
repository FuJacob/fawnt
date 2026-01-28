'use client';

import { useEffect } from 'react';
import type { GoogleFont } from '@/lib/google-fonts';

interface FontDetailProps {
  font: GoogleFont;
  previewText: string;
  onBack: () => void;
}

function parseVariant(variant: string): { weight: string; style: string; label: string } {
  const isItalic = variant.includes('italic');
  const weightPart = variant.replace('italic', '');

  const weightMap: Record<string, string> = {
    '100': '100',
    '200': '200',
    '300': '300',
    'regular': '400',
    '': '400',
    '500': '500',
    '600': '600',
    '700': '700',
    '800': '800',
    '900': '900',
  };

  const labelMap: Record<string, string> = {
    '100': 'Thin',
    '200': 'Extra Light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Semi Bold',
    '700': 'Bold',
    '800': 'Extra Bold',
    '900': 'Black',
  };

  const weight = weightMap[weightPart] || '400';
  const label = `${labelMap[weight]}${isItalic ? ' Italic' : ''}`;

  return {
    weight,
    style: isItalic ? 'italic' : 'normal',
    label,
  };
}

export function FontDetail({ font, previewText, onBack }: FontDetailProps) {
  // Load all font weights
  useEffect(() => {
    const weights = font.variants
      .map(v => {
        const { weight, style } = parseVariant(v);
        return style === 'italic' ? `1,${weight}` : `0,${weight}`;
      })
      .join(';');

    const fontUrl = `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}:ital,wght@${weights}&display=swap`;

    const linkId = 'detail-font';
    let link = document.getElementById(linkId) as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
    link.href = fontUrl;
  }, [font]);

  const displayText = previewText || 'The quick brown fox jumps over the lazy dog';

  return (
    <div className="bg-card rounded-2xl border-2 border-border card-duo p-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground font-bold rounded-xl hover:bg-muted transition-colors"
        >
          <span className="text-lg">←</span> Back
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-extrabold text-foreground">{font.family}</h2>
            <span className="text-xs font-bold text-muted-foreground capitalize px-3 py-1.5 bg-muted rounded-full">
              {font.category}
            </span>
          </div>
        </div>
        <a
          href={`https://fonts.google.com/specimen/${font.family.replace(/ /g, '+')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-secondary hover:brightness-90 transition-all"
        >
          View on Google Fonts →
        </a>
      </div>

      {/* Weight variants */}
      <div className="space-y-6">
        {font.variants.map((variant) => {
          const { weight, style, label } = parseVariant(variant);
          return (
            <div key={variant} className="bg-muted rounded-xl p-5">
              <p className="text-sm font-bold text-muted-foreground mb-3">{label} ({weight})</p>
              <p
                className="text-3xl leading-relaxed text-foreground"
                style={{
                  fontFamily: `"${font.family}", sans-serif`,
                  fontWeight: weight,
                  fontStyle: style,
                }}
              >
                {displayText}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
