import { Input } from "@/components/ui/input";
import { FontCard } from "@/components/font-card";
import { FontDetail } from "@/components/font-detail";
import type { GoogleFont } from "@/lib/google-fonts";

interface SearchResultsProps {
  fonts: GoogleFont[];
  previewText: string;
  isLoading: boolean;
  error: string | null;
  selectedFont: GoogleFont | null;
  onPreviewTextChange: (value: string) => void;
  onSelectFont: (font: GoogleFont | null) => void;
  isLiked: (family: string) => boolean;
  onToggleLike: (font: GoogleFont) => void;
}

export function SearchResults({
  fonts,
  previewText,
  isLoading,
  error,
  selectedFont,
  onPreviewTextChange,
  onSelectFont,
  isLiked,
  onToggleLike,
}: SearchResultsProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {fonts.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <Input
            type="text"
            placeholder="The quick brown fox jumps over the lazy dog"
            value={previewText}
            onChange={(e) => onPreviewTextChange(e.target.value)}
            className="h-12 sm:h-14 text-sm sm:text-base px-4 sm:px-5 rounded-2xl border-2 border-border bg-card focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-muted-foreground/60 font-medium"
          />
        </div>
      )}

      {error && (
        <div className="text-center py-8 sm:py-12 animate-bounce-in">
          <div className="inline-block bg-destructive/10 text-destructive px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base">
            {error}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-16 sm:py-20">
          <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 sm:mb-6" />
          <p className="text-muted-foreground font-bold text-base sm:text-lg">
            Finding the perfect fonts...
          </p>
        </div>
      )}

      {!isLoading &&
        fonts.length > 0 &&
        (selectedFont ? (
          <div className="animate-bounce-in">
            <FontDetail
              font={selectedFont}
              previewText={previewText}
              onBack={() => onSelectFont(null)}
              liked={isLiked(selectedFont.family)}
              onToggleLike={() => onToggleLike(selectedFont)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {fonts.map((font, index) => (
              <div
                key={font.family}
                className="animate-bounce-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <FontCard
                  font={font}
                  previewText={previewText}
                  onSelect={() => onSelectFont(font)}
                  liked={isLiked(font.family)}
                  onToggleLike={() => onToggleLike(font)}
                />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
}
