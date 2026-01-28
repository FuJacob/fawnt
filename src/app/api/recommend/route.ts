import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { fetchAllFonts, type GoogleFont } from "@/lib/google-fonts";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      );
    }

    // Fetch all fonts from Google Fonts API
    const allFonts = await fetchAllFonts();
    const fontNames = allFonts.map((f) => f.family);

    // Use Gemini to select matching fonts
    const systemPrompt = `You are a font expert. Given a user's description of what they're looking for, select 8-12 fonts from the provided list that best match their needs.

Consider:
- The mood and tone they're describing
- The use case (headers, body text, branding, etc.)
- Visual characteristics (modern, classic, playful, elegant, etc.)

Return ONLY a JSON array of font family names, nothing else. Example: ["Roboto", "Open Sans", "Lato"]`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: `${systemPrompt}

User request: "${prompt}"

Available fonts (pick from this list only):
${fontNames.slice(0, 500).join(", ")}

Return only a JSON array of 8-12 font names that match the request:`,
    });

    const text = response.text?.trim() || "[]";

    // Parse the JSON response
    let selectedFontNames: string[];
    try {
      // Handle potential markdown code blocks
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      selectedFontNames = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse Gemini response:", text);
      selectedFontNames = [];
    }

    // Filter to get full font data for selected fonts
    const selectedFonts = allFonts.filter((font) =>
      selectedFontNames.includes(font.family),
    );

    return NextResponse.json({ fonts: selectedFonts });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get font recommendations" },
      { status: 500 },
    );
  }
}
