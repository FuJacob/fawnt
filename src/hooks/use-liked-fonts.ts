"use client";

import { useState, useEffect, useCallback } from "react";
import type { GoogleFont } from "@/lib/google-fonts";

const STORAGE_KEY = "fawnt-liked-fonts";

function readFromStorage(): GoogleFont[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeToStorage(fonts: GoogleFont[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fonts));
}

export function useLikedFonts() {
  const [likedFonts, setLikedFonts] = useState<GoogleFont[]>([]);

  useEffect(() => {
    setLikedFonts(readFromStorage());
  }, []);

  const isLiked = useCallback(
    (family: string) => likedFonts.some((f) => f.family === family),
    [likedFonts]
  );

  const toggleLike = useCallback((font: GoogleFont) => {
    setLikedFonts((prev) => {
      const exists = prev.some((f) => f.family === font.family);
      const next = exists
        ? prev.filter((f) => f.family !== font.family)
        : [...prev, font];
      writeToStorage(next);
      return next;
    });
  }, []);

  return { likedFonts, isLiked, toggleLike };
}
