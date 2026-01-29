"use client";

import { Card, CardContent } from "@/components/ui/card";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import type { GoogleFont } from "@/lib/google-fonts";

const MAX_VARIANTS = 7;

function formatVariant(v: string): string {
  if (v === "regular") return "400";
  if (v === "italic") return "400i";
  if (v.endsWith("italic")) return v.replace("italic", "") + "i";
  return v;
}

interface FontCardProps {
  font: GoogleFont;
  previewText: string;
  onSelect: () => void;
  liked?: boolean;
  onToggleLike?: () => void;
}

export function FontCard({
  font,
  previewText,
  onSelect,
  liked,
  onToggleLike,
}: FontCardProps) {
  const googleFontsUrl = `https://fonts.google.com/specimen/${font.family.replace(/ /g, "+")}`;
  const displayedVariants = font.variants.slice(0, MAX_VARIANTS);
  const remainingCount = font.variants.length - MAX_VARIANTS;

  return (
    <Card
      className="overflow-hidden bg-card rounded-2xl border-2 border-border card-duo cursor-pointer"
      onClick={onSelect}
    >
      <CardContent className="p-4 sm:p-6">
        {/* Header row with title and action buttons */}
        <div className="mb-3 sm:mb-4 flex items-center justify-between gap-2">
          <span className="font-bold text-foreground text-base sm:text-lg truncate border-b-2 border-green-500 pb-0.5">
            {font.family}
          </span>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <a
              href={googleFontsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="btn-duo px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
              aria-label="View on Google Fonts"
            >
              <span className="hidden sm:inline">Get on Google Fonts</span>
              <span className="sm:hidden">Google</span>
            </a>
            {onToggleLike && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike();
                }}
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

        {/* Preview text */}
        <p
          className="text-xl sm:text-2xl leading-relaxed text-foreground min-h-16 sm:min-h-18"
          style={{ fontFamily: `"${font.family}", sans-serif` }}
        >
          {previewText || "The quick brown fox jumps over the lazy dog"}
        </p>

        {/* Bottom row: category + variant tags */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1">
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
      </CardContent>
    </Card>
  );
}
