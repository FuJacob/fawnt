import { NextResponse } from "next/server";
import { fetchAllFonts, type GoogleFont } from "@/lib/google-fonts";

const CEREBRAS_API_URL = "https://api.cerebras.ai/v1/chat/completions";

// JSON Schema for structured output
const fontResponseSchema = {
  type: "object",
  properties: {
    fonts: {
      type: "array",
      items: { type: "string" },
      minItems: 6,
      maxItems: 10,
      description: "Array of exactly 8 font family names"
    }
  },
  required: ["fonts"],
  additionalProperties: false
};

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
- Return EXACTLY 8 font names, no more, no less
- Only use fonts from the provided list
- Mix display fonts with body fonts for variety

Consider mood, use case, and visual style when selecting.`;

    const userMessage = `Find 8 fonts for: "${prompt}"

Available fonts:
${fontNames.slice(0, 400).join(", ")}

Return exactly 8 font names as a JSON array.`;

    // Call Cerebras API with structured outputs
    const response = await fetch(CEREBRAS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama3.1-8b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "font_recommendations",
            strict: true,
            schema: fontResponseSchema
          }
        },
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Cerebras API error:", response.status, errorData);
      if (response.status === 429) {
        return NextResponse.json(
          { error: "Rate limited. Please try again in a moment." },
          { status: 429 },
        );
      }
      return NextResponse.json(
        { error: "Failed to get font recommendations. Please try again." },
        { status: 500 },
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Parse the structured JSON response
    let selectedFontNames: string[] = [];
    try {
      const parsed = JSON.parse(content);
      // Limit to 10 fonts max as a safeguard
      selectedFontNames = (parsed.fonts || []).slice(0, 10);
    } catch {
      console.error("Failed to parse Cerebras response:", content);
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
        { error: "Could not find matching fonts. Try a different description." },
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
