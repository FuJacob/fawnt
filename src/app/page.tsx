"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { FontCard } from "@/components/font-card";
import { FontDetail } from "@/components/font-detail";
import { recommendFonts, loadFonts } from "@/lib/api";
import type { GoogleFont } from "@/lib/google-fonts";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFont, setSelectedFont] = useState<GoogleFont | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setSelectedFont(null);

    try {
      const recommendedFonts = await recommendFonts(prompt);
      setFonts(recommendedFonts);
      loadFonts(recommendedFonts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPrompt("");
    setPreviewText("");
    setFonts([]);
    setError(null);
    setSelectedFont(null);
  };

  const hasResults = fonts.length > 0 || isLoading || error;

  return (
    <main className="min-h-screen">
      {/* Home Button - visible when there are results */}
      {hasResults && (
        <button
          onClick={handleReset}
          className="fixed top-4 left-4 z-10 flex items-center gap-2 px-4 py-2 bg-card text-muted-foreground hover:text-foreground font-bold rounded-xl border-2 border-border shadow-sm hover:shadow-md transition-all"
        >
          <span className="text-lg">←</span> Home
        </button>
      )}

      {/* Hero / Search Section */}
      <div
        className={`transition-all duration-500 ease-out ${
          hasResults
            ? "pt-10 pb-8 bg-card shadow-sm"
            : "min-h-screen flex flex-col items-center justify-center"
        }`}
      >
        <div
          className={`w-full max-w-2xl mx-auto px-6 ${hasResults ? "" : "text-center"}`}
        >
          {/* Header */}
          <div
            className={`text-center transition-all duration-500 ${hasResults ? "mb-6" : "mb-10"}`}
          >
            <h1
              className={`font-extrabold tracking-tight transition-all duration-500 text-primary ${
                hasResults ? "text-2xl mb-1" : "text-6xl mb-4"
              }`}
            >
              fawnt
            </h1>
            <p
              className={`text-muted-foreground font-medium transition-all duration-500 ${
                hasResults ? "text-sm" : "text-xl"
              }`}
            >
              Describe what you need, get perfect fonts
            </p>
          </div>

          {/* Prompt Form */}
          <form onSubmit={handleSubmit}>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="e.g., playful fonts for a children's app..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 h-16 text-lg px-6 rounded-2xl border-2 border-border bg-card focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/60 font-medium"
              />
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="h-16 px-8 text-lg font-bold rounded-2xl bg-primary text-primary-foreground border-b-4 border-primary/80 hover:brightness-110 active:border-b-2 active:translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:border-b-4"
              >
                {isLoading ? "Finding..." : "Find Fonts"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Results Section */}
      {hasResults && (
        <div className="max-w-4xl mx-auto px-6 py-8">
          {/* Preview Text Input */}
          {fonts.length > 0 && (
            <div className="mb-8">
              <Input
                type="text"
                placeholder="Type your preview text here..."
                value={previewText}
                onChange={(e) => setPreviewText(e.target.value)}
                className="h-14 text-base px-5 rounded-2xl border-2 border-border bg-card focus:border-secondary focus:ring-2 focus:ring-secondary/20 placeholder:text-muted-foreground/60 font-medium"
              />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-12 animate-bounce-in">
              <div className="inline-block bg-destructive/10 text-destructive px-6 py-4 rounded-2xl font-bold">
                {error}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-muted-foreground font-bold text-lg">
                Finding the perfect fonts...
              </p>
            </div>
          )}

          {/* Font Detail View OR Results Grid */}
          {!isLoading &&
            fonts.length > 0 &&
            (selectedFont ? (
              <div className="animate-bounce-in">
                <FontDetail
                  font={selectedFont}
                  previewText={previewText}
                  onBack={() => setSelectedFont(null)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {fonts.map((font, index) => (
                  <div
                    key={font.family}
                    className="animate-bounce-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <FontCard
                      font={font}
                      previewText={previewText}
                      onSelect={() => setSelectedFont(font)}
                    />
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </main>
  );
}
