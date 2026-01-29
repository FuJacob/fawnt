import { Input } from "@/components/ui/input";
import {
  ArrowRightIcon,
  PaintBrushIcon,
  CodeBracketIcon,
  HeartIcon,
  BoltIcon,
  CakeIcon,
} from "@heroicons/react/24/outline";

const EXAMPLE_PROMPTS = [
  { text: "clean and modern for a tech startup", icon: CodeBracketIcon },
  { text: "playful and bubbly for a children's app", icon: CakeIcon },
  { text: "elegant serif for a wedding invitation", icon: HeartIcon },
  { text: "bold and loud for a sports brand", icon: BoltIcon },
  { text: "hand-drawn and artistic for a portfolio", icon: PaintBrushIcon },
];

interface SearchHeroProps {
  prompt: string;
  isLoading: boolean;
  hasResults: boolean;
  onPromptChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onQuickSubmit: (prompt: string) => void;
}

export function SearchHero({
  prompt,
  isLoading,
  hasResults,
  onPromptChange,
  onSubmit,
  onQuickSubmit,
}: SearchHeroProps) {
  return (
    <div
      className={`transition-all duration-500 ease-out ${
        hasResults
          ? "pt-24 sm:pt-32 pb-6 sm:pb-8"
          : "min-h-screen flex flex-col items-center justify-center px-4"
      }`}
    >
      <div
        className={`w-full max-w-4xl mx-auto px-4 sm:px-6 ${hasResults ? "" : "text-center"}`}
      >
        {!hasResults && (
          <div className="text-center mb-6 sm:mb-10">
            <h1 className="font-extrabold tracking-tight text-primary text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">
              find your favourite font
            </h1>
            <p className="text-muted-foreground font-medium text-base sm:text-lg md:text-xl">
              Describe what you&apos;re looking for, and we&apos;ll find you
              your font
            </p>
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="text-muted-foreground text-xl sm:text-2xl md:text-3xl font-medium whitespace-nowrap shrink-0">
              I want a font that is
            </span>
            <div className="flex items-center gap-2 w-full sm:flex-1">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="..."
                  value={prompt}
                  onChange={(e) => onPromptChange(e.target.value)}
                  className="h-auto text-xl sm:text-2xl md:text-3xl px-2 py-1 border-0 border-b-[3px] border-b-primary bg-transparent rounded-none shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:border-b-primary placeholder:text-muted-foreground/40 font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="btn-duo shrink-0 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-primary hover:text-primary/80 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ArrowRightIcon className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                )}
              </button>
            </div>
          </div>
        </form>

        {!hasResults && (
          <div className="flex flex-wrap justify-center gap-2 mt-6 sm:mt-8">
            {EXAMPLE_PROMPTS.map(({ text, icon: Icon }) => (
              <button
                key={text}
                type="button"
                onClick={() => onQuickSubmit(text)}
                className="btn-duo flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-2xl border-2 border-border bg-card/80 text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
