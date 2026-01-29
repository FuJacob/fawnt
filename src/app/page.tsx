"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Navbar } from "@/components/navbar";
import { SearchHero } from "@/components/search-hero";
import { SearchResults } from "@/components/search-results";
import { useLikedFonts } from "@/hooks/use-liked-fonts";
import { useRateLimit } from "@/hooks/use-rate-limit";
import { recommendFonts, loadFonts } from "@/lib/api";
import type { GoogleFont } from "@/lib/google-fonts";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<GoogleFont | null>(null);
  const [showLiked, setShowLiked] = useState(false);

  const { likedFonts, isLiked, toggleLike } = useLikedFonts();
  const { checkRateLimit, getRemainingTime } = useRateLimit();

  const search = async (query: string) => {
    if (!query.trim()) return;

    // Check rate limit
    if (!checkRateLimit()) {
      const remaining = Math.ceil(getRemainingTime() / 1000);
      toast.warning(`Please wait ${remaining} second${remaining !== 1 ? 's' : ''} before searching again`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSelectedFont(null);
    setShowLiked(false);

    try {
      const recommendedFonts = await recommendFonts(query);
      setFonts(recommendedFonts);
      loadFonts(recommendedFonts);
      toast.success(`Found ${recommendedFonts.length} fonts!`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong";
      
      // Check for rate limit errors from Gemini API
      if (errorMessage.toLowerCase().includes('rate') || 
          errorMessage.toLowerCase().includes('quota') ||
          errorMessage.toLowerCase().includes('429') ||
          errorMessage.toLowerCase().includes('too many')) {
        toast.error("API rate limit reached. Please try again in a moment.");
        setError("Rate limited. Please wait a moment and try again.");
      } else {
        toast.error(errorMessage);
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    search(prompt);
  };

  const handleQuickSubmit = (text: string) => {
    setPrompt(text);
    search(text);
  };

  const handleReset = () => {
    setPrompt("");
    setPreviewText("");
    setFonts([]);
    setError(null);
    setSelectedFont(null);
    setShowLiked(false);
  };

  const handleLikedClick = () => {
    setShowLiked((prev) => !prev);
    setSelectedFont(null);
  };

  // Load liked font files when entering liked view
  useEffect(() => {
    if (showLiked && likedFonts.length > 0) {
      loadFonts(likedFonts);
    }
  }, [showLiked, likedFonts]);

  const displayFonts = showLiked ? likedFonts : fonts;
  const hasResults = showLiked || fonts.length > 0 || isLoading || error;

  return (
    <main className="min-h-screen">
      <Navbar
        onLogoClick={handleReset}
        likedCount={likedFonts.length}
        onLikedClick={handleLikedClick}
      />

      <SearchHero
        prompt={prompt}
        isLoading={isLoading}
        hasResults={!!hasResults}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        onQuickSubmit={handleQuickSubmit}
      />

      {hasResults && (
        <SearchResults
          fonts={displayFonts}
          previewText={previewText}
          isLoading={isLoading}
          error={error}
          selectedFont={selectedFont}
          onPreviewTextChange={setPreviewText}
          onSelectFont={setSelectedFont}
          isLiked={isLiked}
          onToggleLike={toggleLike}
        />
      )}
    </main>
  );
}
