'use client';

import { useEffect } from 'react';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import type { GoogleFont } from '@/lib/google-fonts';

const MAX_VARIANTS = 7;

function formatVariant(v: string): string {
  if (v === 'regular') return '400';
  if (v === 'italic') return '400i';
  if (v.endsWith('italic')) return v.replace('italic', '') + 'i';
  return v;
}

interface FontDetailProps {
  font: GoogleFont;
  previewText: string;
  onBack: () => void;
  liked?: boolean;
  onToggleLike?: () => void;
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

export function FontDetail({ font, previewText, onBack, liked, onToggleLike }: FontDetailProps) {
  const googleFontsUrl = `https://fonts.google.com/specimen/${font.family.replace(/ /g, '+')}`;
  const displayedVariants = font.variants.slice(0, MAX_VARIANTS);
  const remainingCount = font.variants.length - MAX_VARIANTS;
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
    <div className="bg-card rounded-2xl border-2 border-border card-duo p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={onBack}
              className="btn-duo w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border-2 border-border bg-card text-muted-foreground hover:text-foreground shrink-0"
              aria-label="Go back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
            </button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground truncate">{font.family}</h2>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={googleFontsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-duo px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="View on Google Fonts"
            >
              <span className="hidden sm:inline">Get on Google Fonts</span>
              <span className="sm:hidden">Google</span>
            </a>
            {onToggleLike && (
              <button
                onClick={onToggleLike}
                className={`btn-duo w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full border ${
                  liked
                    ? "bg-destructive border-destructive text-white scale-110"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
                aria-label={liked ? "Unlike font" : "Like font"}
              >
                {liked ? (
                  <HeartSolid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <HeartOutline className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1 ml-6 sm:ml-8">
          <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground/70 lowercase bg-muted/50 px-1.5 py-0.5 rounded">
            {font.category}
          </span>
          <span className="text-muted-foreground/30 mx-0.5">·</span>
          {displayedVariants.map((v) => (
            <span
              key={v}
              className="text-[9px] sm:text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
            >
              {formatVariant(v)}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
              +{remainingCount}
            </span>
          )}
        </div>
      </div>

      {/* Weight variants */}
      <div className="space-y-4 sm:space-y-6">
        {font.variants.map((variant) => {
          const { weight, style, label } = parseVariant(variant);
          return (
            <div key={variant} className="bg-muted rounded-xl p-4 sm:p-5">
              <p className="text-xs sm:text-sm font-bold text-muted-foreground mb-2 sm:mb-3">{label} ({weight})</p>
              <p
                className="text-2xl sm:text-3xl leading-relaxed text-foreground"
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
