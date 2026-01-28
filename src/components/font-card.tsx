'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { GoogleFont } from '@/lib/google-fonts';

interface FontCardProps {
  font: GoogleFont;
  previewText: string;
  onSelect: () => void;
}

export function FontCard({ font, previewText, onSelect }: FontCardProps) {
  return (
    <Card
      className="overflow-hidden bg-card rounded-2xl border-2 border-border card-duo cursor-pointer"
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <a
            href={`https://fonts.google.com/specimen/${font.family.replace(/ /g, '+')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-foreground hover:text-secondary transition-colors text-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {font.family}
          </a>
          <span className="text-xs font-bold text-muted-foreground capitalize px-3 py-1.5 bg-muted rounded-full">
            {font.category}
          </span>
        </div>
        <p
          className="text-2xl leading-relaxed text-foreground min-h-[4.5rem]"
          style={{ fontFamily: `"${font.family}", sans-serif` }}
        >
          {previewText || 'The quick brown fox jumps over the lazy dog'}
        </p>
      </CardContent>
    </Card>
  );
}
