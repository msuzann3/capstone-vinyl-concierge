import React, { useState } from "react";
import { UserPreferences } from "../types";
import { Disc, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Brandmark } from "./BrandLogo";

interface QuestionnaireFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const PRESET_GENRES = [
  "Jazz", "Pop / Top 40", "Alternative", "Indie Folk", "Classic Rock",
  "Indie Rock", "Ambient", "Soul / Funk", "Country", "Hip-Hop"
];

const PRESET_MOODS = [
  { value: "cozy_morning", label: "Sunny Sunday morning coffee & papers", description: "Warm, soft, optimistic acoustic hums" },
  { value: "late_night", label: "Late night in a rain-slicked quiet city", description: "Smoky brass, nocturnal bass, and slow tempos" },
  { value: "focused_study", label: "Focused, deep-focus thunderstorm study", description: "Instrumental, textural, and repetitive loops" },
  { value: "high_energy", label: "High-voltage weekend record lounge", description: "Upbeat grooves, heavy percussion, and high fidelity" },
  { value: "melancholic", label: "Wistful, melancholic nostalgia room", description: "Poetic songwriting, quiet tape hiss, and intimate delays" }
];

const LISTENING_HABITS = [
  { value: "deep_listening", label: "Active deep listening (eyes closed, centered in sweet spot)" },
  { value: "dynamic_background", label: "Soundtrack for life (cooking, organizing, reading a paperback)" },
  { value: "vintage_crank", label: "Loud physical session (vintage amps humming, crackling warmth)" }
];

const MAX_ARTISTS_LENGTH = 180;
const MAX_CUSTOM_PROMPT_LENGTH = 500;
const DEMO_PROFILES = [
  {
    artists: "John Coltrane, Alice Coltrane, Miles Davis",
    genres: ["Jazz"],
    mood: "late_night",
    listeningHabit: "deep_listening",
    customPrompt: "I want spacious, adventurous records with strong musicianship for focused headphone listening after dark.",
  },
  {
    artists: "Dolly Parton, Fleetwood Mac, Lucinda Williams",
    genres: ["Country", "Classic Rock"],
    mood: "cozy_morning",
    listeningHabit: "dynamic_background",
    customPrompt: "I like vivid storytelling, warm voices, and records that work while cooking or spending a slow morning at home.",
  },
  {
    artists: "Curtis Mayfield, Erykah Badu, Stevie Wonder",
    genres: ["Soul / Funk"],
    mood: "high_energy",
    listeningHabit: "vintage_crank",
    customPrompt: "I want groove-forward records with memorable vocals, rich arrangements, and enough energy for a weekend gathering.",
  },
  {
    artists: "Cocteau Twins, My Bloody Valentine, Björk",
    genres: ["Alternative", "Indie Rock"],
    mood: "melancholic",
    listeningHabit: "deep_listening",
    customPrompt: "I want immersive, textured records with unusual production, emotional depth, and a slightly dreamlike atmosphere.",
  },
] as const;

function normalizeArtistsInput(value: string): string {
  return Array.from(new Set(
    value
      .split(",")
      .map((artist) => artist.trim())
      .filter(Boolean)
  )).join(", ");
}

export default function QuestionnaireForm({ onSubmit, isLoading }: QuestionnaireFormProps) {
  const [artists, setArtists] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [mood, setMood] = useState("");
  const [listeningHabit, setListeningHabit] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [demoProfileIndex, setDemoProfileIndex] = useState(0);

  const handleGenreToggle = (genre: string) => {
    setValidationMessage("");
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handlePresetFill = () => {
    const profile = DEMO_PROFILES[demoProfileIndex];
    setArtists(profile.artists);
    setSelectedGenres([...profile.genres]);
    setMood(profile.mood);
    setListeningHabit(profile.listeningHabit);
    setCustomPrompt(profile.customPrompt);
    setDemoProfileIndex((current) => (current + 1) % DEMO_PROFILES.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedArtists = normalizeArtistsInput(artists);
    const trimmedPrompt = customPrompt.trim();

    if (normalizedArtists.length > MAX_ARTISTS_LENGTH) {
      setValidationMessage("Shorten the artist list so the prototype can read it clearly.");
      return;
    }

    if (!normalizedArtists && selectedGenres.length === 0) {
      setValidationMessage("Add at least one artist or choose at least one genre before curating the rack.");
      return;
    }

    if (trimmedPrompt.length > MAX_CUSTOM_PROMPT_LENGTH) {
      setValidationMessage("Shorten the note before curating the rack.");
      return;
    }

    setArtists(normalizedArtists);
    setCustomPrompt(trimmedPrompt);
    setValidationMessage("");
    onSubmit({
      artists: normalizedArtists,
      genres: selectedGenres,
      mood: PRESET_MOODS.find((m) => m.value === mood)?.label || mood,
      listeningHabit: LISTENING_HABITS.find((h) => h.value === listeningHabit)?.label || listeningHabit,
      customPrompt: trimmedPrompt
    });
  };

  const canSubmit = !isLoading &&
    artists.trim().length <= MAX_ARTISTS_LENGTH &&
    customPrompt.trim().length <= MAX_CUSTOM_PROMPT_LENGTH &&
    (normalizeArtistsInput(artists).length > 0 || selectedGenres.length > 0);

  return (
    <form onSubmit={handleSubmit} className="min-w-0 bg-white rounded-lg border border-stone-200 shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-curate-red px-5 sm:px-6 py-5 border-b border-sleeve-mustard flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4">
        <div className="min-w-0">
          <span className="text-sleeve-mustard text-xs font-mono tracking-widest uppercase block mb-1">
            Curate Records Club · Member Questionnaire
          </span>
          <h2 className="text-white font-display text-xl uppercase tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 animate-spin-vinyl">
              <Brandmark />
            </div>
            The Vinyl Concierge
          </h2>
        </div>
        <button
          type="button"
          onClick={handlePresetFill}
          className="self-start shrink-0 text-[11px] text-white font-mono font-bold hover:text-vinyl-black border border-white/70 hover:border-sleeve-mustard px-2.5 py-1 rounded transition-all bg-curate-red hover:bg-sleeve-mustard shadow-sm"
        >
          Quick Demo Fill
        </button>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        <div className="rounded-md border border-sleeve-mustard bg-sleeve-mustard/15 px-4 py-3 text-sm text-stone-800">
          <strong>Start with an artist or a genre.</strong> Complete at least one of the first two questions. You can use both if you want a narrower match.
        </div>

        {/* Step 1: Favorite Artists */}
        <div>
          <label className="block text-stone-900 font-bold text-base tracking-tight mb-1">
            1. Who are your favorite artists or bands?
          </label>
          <span className="text-sm text-stone-600 block mb-2 font-editorial italic">
            Add one or more artists, or use the genre question below instead.
          </span>
          <input
            type="text"
            value={artists}
            onChange={(e) => {
              setArtists(e.target.value);
              setValidationMessage("");
            }}
            placeholder="Radiohead, John Coltrane, Dolly Parton..."
            maxLength={MAX_ARTISTS_LENGTH}
            className="w-full bg-bone-cream border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-curate-red focus:ring-1 focus:ring-curate-red text-base"
          />
        </div>

        {/* Step 2: Genres */}
        <div>
          <label className="block text-stone-900 font-bold text-base tracking-tight mb-1">
            2. Which genres are you interested in?
          </label>
          <span className="text-sm text-stone-600 block mb-3 font-editorial italic">
            Select any that apply, or leave this blank if you entered an artist above.
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PRESET_GENRES.map((genre) => {
              const isChecked = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`text-sm py-2.5 px-2.5 rounded border text-center transition-all cursor-pointer ${
                    isChecked
                      ? "bg-curate-red border-curate-red text-white font-bold shadow-sm"
                      : "bg-bone-cream border-stone-200 text-stone-700 hover:bg-stone-100"
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 3: Moods */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <label className="block text-stone-900 font-bold text-base tracking-tight">
              3. What mood or listening environment are you pursuing? (Optional)
            </label>
            {mood && (
              <button
                type="button"
                onClick={() => setMood("")}
                className="shrink-0 text-xs font-bold text-curate-red underline underline-offset-2"
              >
                Clear
              </button>
            )}
          </div>
          <span className="text-sm text-stone-600 block mb-3 font-editorial italic">
            No mood is assumed unless you select one.
          </span>
          <div className="space-y-2">
            {PRESET_MOODS.map((m) => {
              const isSelected = mood === m.value;
              return (
                <label
                  key={m.value}
                  onClick={() => setMood(m.value)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-sleeve-mustard/15 border-sleeve-mustard shadow-sm"
                      : "bg-bone-cream border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="mood"
                    value={m.value}
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-1 h-4 w-4 text-curate-red focus:ring-curate-red border-stone-300 accent-curate-red"
                  />
                  <div>
                    <span className="block text-sm font-bold text-stone-900">{m.label}</span>
                    <span className="block text-xs text-stone-600 italic mt-0.5">{m.description}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 4: Listening Habits */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-1">
            <label className="block text-stone-900 font-bold text-base tracking-tight">
              4. How do you usually listen to records? (Optional)
            </label>
            {listeningHabit && (
              <button
                type="button"
                onClick={() => setListeningHabit("")}
                className="shrink-0 text-xs font-bold text-curate-red underline underline-offset-2"
              >
                Clear
              </button>
            )}
          </div>
          <span className="text-sm text-stone-600 block mb-3 font-editorial italic">
            Choose one only if it should influence the recommendations.
          </span>
          <div className="space-y-2">
            {LISTENING_HABITS.map((h) => {
              const isSelected = listeningHabit === h.value;
              return (
                <label
                  key={h.value}
                  onClick={() => setListeningHabit(h.value)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-sleeve-mustard/15 border-sleeve-mustard shadow-sm"
                      : "bg-bone-cream border-stone-200 hover:bg-stone-100"
                  }`}
                >
                  <input
                    type="radio"
                    name="habit"
                    value={h.value}
                    checked={isSelected}
                    onChange={() => {}}
                    className="h-4 w-4 text-curate-red focus:ring-curate-red border-stone-300 accent-curate-red"
                  />
                  <span className="text-sm text-stone-800">{h.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 5: Custom note */}
        <div>
          <label className="block text-stone-900 font-bold text-base tracking-tight mb-1">
            5. Add anything else you want us to consider (Optional)
          </label>
          <span className="text-sm text-stone-600 block mb-2 font-editorial italic">
            For example: "high-reverb folk," "dusty piano samples," or "warm, detailed production."
          </span>
          <textarea
            value={customPrompt}
            onChange={(e) => {
              setCustomPrompt(e.target.value);
              setValidationMessage("");
            }}
            placeholder="Explain any subtle specifics you are searching for..."
            rows={3}
            maxLength={MAX_CUSTOM_PROMPT_LENGTH}
            className="w-full bg-bone-cream border border-stone-300 rounded px-3.5 py-2.5 text-stone-900 focus:outline-none focus:border-curate-red focus:ring-1 focus:ring-curate-red text-base"
          />
          <div className="mt-1 flex justify-end text-[10px] font-mono text-stone-500">
            {customPrompt.length}/{MAX_CUSTOM_PROMPT_LENGTH}
          </div>
        </div>
      </div>

      {/* Footer Submission Panel */}
      <div className="bg-stone-50 p-6 border-t border-stone-200 flex justify-between items-center flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-stone-500 font-mono text-xs">
            <SlidersHorizontal className="w-4 h-4 text-curate-red" />
            <span>Searching a 200-ish Discogs seed catalog</span>
          </div>
          {validationMessage && (
            <p className="mt-2 text-xs font-bold text-curate-red">
              {validationMessage}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm tracking-wide uppercase shadow transition-all cursor-pointer ${
            !canSubmit
              ? "bg-stone-300 text-stone-500 cursor-not-allowed shadow-none"
              : "bg-curate-red hover:bg-stone-900 text-white hover:shadow-lg active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <Disc className="w-4 h-4 animate-spin-vinyl text-white" />
              Tapping Turntable...
            </>
          ) : (
            <>
              Curate My Vinyl Rack
              <ArrowRight className="w-4 h-4 text-sleeve-mustard" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
