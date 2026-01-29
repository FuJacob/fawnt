import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";
import { fetchAllFonts } from "@/lib/google-fonts";

const mistral = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

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

    // Improved system prompt for better font matching
    const systemPrompt = `You are an expert typography consultant. Recommend exactly 8 fonts from the provided list that match the user's description.

RULES:
- Return EXACTLY 16 font names ordered by what you think fits best based on prompt, no more, no less
- Only use fonts from the provided list
- Mix display fonts with body fonts for variety
- Return as JSON object with "fonts" array

Consider mood, use case, and visual style when selecting.`;

    const userMessage = `Find 8 fonts for: "${prompt}"

Available fonts:
${fontNames.slice(0, 400).join(", ")}

Return exactly 8 font names as JSON: {"fonts": ["Font1", "Font2", ...]}`;

    // Call Mistral API with JSON mode
    const chatResponse = await mistral.chat.complete({
      model: "ministral-14b-latest",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      responseFormat: { type: "json_object" },
      temperature: 0.7,
      maxTokens: 500,
    });

    const content = chatResponse.choices?.[0]?.message?.content;

    if (!content || typeof content !== "string") {
      console.error("Empty or invalid Mistral response");
      return NextResponse.json(
        { error: "Failed to get font recommendations. Please try again." },
        { status: 500 },
      );
    }

    // Parse the JSON response
    let selectedFontNames: string[] = [];
    try {
      const parsed = JSON.parse(content);
      // Limit to 10 fonts max as a safeguard
      selectedFontNames = (parsed.fonts || []).slice(0, 10);
    } catch {
      console.error("Failed to parse Mistral response:", content);
      return NextResponse.json(
        { error: "Failed to parse font recommendations. Please try again." },
        { status: 500 },
      );
    }

    // Filter to get full font data for selected fonts
    const selectedFonts = allFonts.filter((font) =>
      selectedFontNames.includes(font.family),
    );

    // If we got no fonts, return an error
    if (selectedFonts.length === 0) {
      return NextResponse.json(
        {
          error: "Could not find matching fonts. Try a different description.",
        },
        { status: 400 },
      );
    }

    return NextResponse.json({ fonts: selectedFonts });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to get font recommendations. Please try again." },
      { status: 500 },
    );
  }
}
