import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize the GoogleGenAI client on the server.
// Set User-Agent as instructed for telemetry.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Synthetic base inventory list for context and suggestions.
const SYNTHETIC_INVENTORY = [
  { title: "Kind of Blue", artist: "Miles Davis", genre: "Jazz", year: "1959", vibe: "late-night jazz masterwork, cool modal progressions" },
  { title: "Blue Train", artist: "John Coltrane", genre: "Jazz", year: "1958", vibe: "expressive hard bop, high-energy horn lines" },
  { title: "Heaven or Las Vegas", artist: "Cocteau Twins", genre: "Dream Pop", year: "1990", vibe: "ethereal guitars, shimmering oceans of sound" },
  { title: "In Rainbows", artist: "Radiohead", genre: "Alternative", year: "2007", vibe: "warm textures, pristine art rock, intricate rhythms" },
  { title: "Punisher", artist: "Phoebe Bridgers", genre: "Indie Folk", year: "2020", vibe: "melancholic, whispery indie songwriting, apocalyptic bedroom folk" },
  { title: "Pink Moon", artist: "Nick Drake", genre: "Folk", year: "1972", vibe: "stark acoustic guitar, intimate late-night confessions" },
  { title: "A Love Supreme", artist: "John Coltrane", genre: "Jazz", year: "1965", vibe: "spiritual jazz journey, transcendent and deeply emotional" },
  { title: "Dummy", artist: "Portishead", genre: "Trip-Hop", year: "1994", vibe: "dusty vinyl samples, sultry/tense vocals, cinematic atmosphere" },
  { title: "The Queen Is Dead", artist: "The Smiths", genre: "Indie Rock", year: "1986", vibe: "jangly guitars, witty melancholia, essential indie guitar-pop" },
  { title: "Illinois", artist: "Sufjan Stevens", genre: "Indie Folk", year: "2005", vibe: "lush indie orchestral arrangements, cinematic heartland tales" }
];

// Helper endpoint for checking server status.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Endpoint to generate recommendations via Gemini
app.post("/api/recommendations", async (req, res) => {
  try {
    const { artists, genres, mood, listeningHabit, customPrompt } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not defined on the server side.",
      });
    }

    const inventoryContext = JSON.stringify(SYNTHETIC_INVENTORY, null, 2);

    const systemInstruction = `You are an experienced, legendary independent record store clerk at Curate Records & Books.
Your voice is deeply knowledgeable, plain, warm, and highly opinionated. You are confident enough to recommend, but modest enough to admit tastes are personal.

Guidelines for your dialogue and writing:
1. Keep the writing concise, thoughtful, and conversational. Short sentences are preferred over overly dramatic prose.
2. Avoid overly corporate, trendy, or marketing-heavy language. Write naturally and conversationally, like an experienced independent record store employee helping someone discover music they might genuinely love.
3. Speak of releases with deep appreciation for pressing details, reissue labels, studio settings, acoustic textures, or cultural contexts. Treat music like a living document or a shared neighborhood artifact.
4. Recommend 3-5 vinyl albums. Make them a balanced blend:
   - At least 1 or 2 should be 'Familiar Classics' (can include items from the store's stock: ${inventoryContext}, or other extremely well-known masterpieces).
   - At least 2 should be 'Discovery Gems' (lesser-known records, underrepresented genres or artists, out-of-print curiosities, or incredible underground records).
5. For each recommendation, provide a warm, highly tailored essay (2-3 short, vivid paragraphs) in your unique clerk voice about why it matches their preferences. Include 2-3 standout tracks to cue up on the turntable.
6. Provide an internal business analysis for the store owner. Do not let the customer see this owner summary — it should be in strict industry shopkeeper tone. Discuss customer style, inventory shelf gaps, specific merchandise arrangements, and potential labels or titles we must buy to fill this niche.`;

    const prompt = `A customer has walked up to the shop desk.
Favorites artists they list: "${artists || 'None specified'}"
Favorite genres they check: "${Array.isArray(genres) ? genres.join(', ') : (genres || 'None specified')}"
Mood they are hunting for: "${mood || 'None specified'}"
Turntable listening habit: "${listeningHabit || 'None specified'}"
Additional raw customer thoughts to look out for: "${customPrompt || 'None specified'}"

Please generate recommendations and store insights following the exact requested json schema structure. Ensure it flows beautifully in our independent store voice.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              description: "A list of 3 to 5 vinyl recommendations.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Title of the album." },
                  artist: { type: Type.STRING, description: "Name of the artist/band." },
                  genre: { type: Type.STRING, description: "A few genres associated with the album." },
                  releaseYear: { type: Type.STRING, description: "Original release year. Example: 1974" },
                  classification: { type: Type.STRING, description: "Must be either 'Familiar Classic' or 'Discovery Gem'." },
                  whyThisMatches: {
                    type: Type.STRING,
                    description: "An evocative, conversational, 2-paragraph justification written in the warm, experienced clerk voice. Connect details of the instruments or production directly to the customer's preferences. Explain how the pressing or turntable experience heightens this album."
                  },
                  aestheticVibe: {
                    type: Type.STRING,
                    description: "A quick 3-5 word poetic description of the audio-visual vibe, like 'Rain-slicked bricks, smoky brass'."
                  },
                  tracksToListenTo: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "2 or 3 standout tracks that showcase the record's genius."
                  }
                },
                required: ["title", "artist", "genre", "releaseYear", "classification", "whyThisMatches", "aestheticVibe", "tracksToListenTo"]
              }
            },
            ownerInsights: {
              type: Type.OBJECT,
              description: "Business logistics and purchasing recommendations for the store owner. Keep it practical, shopkeeper-to-shopkeeper.",
              properties: {
                trendsSummary: { type: Type.STRING, description: "Summarize the customer preference trends represented by this search. Why is this listening style thriving or what does it say about contemporary vinyl buyers?" },
                inventoryOpportunities: { type: Type.STRING, description: "Identify specific catalog titles, reissues, or small labels we should immediately stock or call distributors for to satisfy this specific customer type." },
                underrepresentedAreas: { type: Type.STRING, description: "Spotlight specific subgenres, historical periods, or fringe movements (e.g. ambient folk, Japanese city pop, krautrock) currently underrepresented on our physical shelves." },
                merchandisingStrategy: { type: Type.STRING, description: "Actionable shelving, wall-display, or listening station groupings. Suggest a catchy hand-written card title we can chalk onto our corkboards." }
              },
              required: ["trendsSummary", "inventoryOpportunities", "underrepresentedAreas", "merchandisingStrategy"]
            }
          },
          required: ["recommendations", "ownerInsights"]
        }
      }
    });

    const responseText = response.text;
    res.json(JSON.parse(responseText || "{}"));
  } catch (error: any) {
    console.error("Gemini GenAI recommendation error:", error);
    res.status(500).json({
      error: error.message || "An error occurred while compiling recommendations.",
    });
  }
});

// Serve frontend assets via Vite in development, static build files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Vinyl Concierge express server running on http://localhost:${PORT}`);
  });
}

startServer();
