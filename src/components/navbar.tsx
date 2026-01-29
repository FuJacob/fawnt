import { HeartIcon as HeartOutline, GiftIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

interface NavbarProps {
  onLogoClick: () => void;
  likedCount: number;
  onLikedClick: () => void;
}

export function Navbar({ onLogoClick, likedCount, onLikedClick }: NavbarProps) {
  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl px-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-md rounded-2xl border-2 border-border shadow-sm">
          <button
            onClick={onLogoClick}
            className="pl-2 text-xl font-extrabold text-primary hover:opacity-80 transition-opacity"
          >
            fawnt
          </button>
          <a
            href="https://buymeacoffee.com/fawnt"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-duo flex items-center gap-1.5 px-4 py-1.5 text-sm font-bold rounded-2xl bg-primary text-primary-foreground hover:brightness-110"
          >
            <GiftIcon className="w-4 h-4" />
            support us
          </a>
        </div>
        <button
          onClick={onLikedClick}
          className="btn-duo relative shrink-0 w-11 h-11 flex items-center justify-center rounded-full border-2 border-border bg-card/80 backdrop-blur-md shadow-sm hover:text-foreground text-muted-foreground"
          aria-label="Liked fonts"
        >
          {likedCount > 0 ? (
            <HeartSolid className="w-5 h-5 text-destructive" />
          ) : (
            <HeartOutline className="w-5 h-5" />
          )}
          {likedCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-destructive text-white text-[10px] font-bold">
              {likedCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
