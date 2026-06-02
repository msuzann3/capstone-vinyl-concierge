import React, { useState } from "react";
import { UserPreferences } from "../types";
import { Disc, Sparkles, SlidersHorizontal, ArrowRight, HelpCircle } from "lucide-react";
import { Brandmark } from "./BrandLogo";

interface QuestionnaireFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const PRESET_GENRES = [
  "Jazz", "Dream Pop", "Alternative", "Indie Folk", "Trip-Hop", 
  "Indie Rock", "Ambient / Drone", "Soul / Funk", "Post-Rock", "Electronic"
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

export default function QuestionnaireForm({ onSubmit, isLoading }: QuestionnaireFormProps) {
  const [artists, setArtists] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [mood, setMood] = useState("late_night");
  const [listeningHabit, setListeningHabit] = useState("deep_listening");
  const [customPrompt, setCustomPrompt] = useState("");

  const handleGenreToggle = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handlePresetFill = () => {
    setArtists("Phoebe Bridgers, Radiohead, Miles Davis");
    setSelectedGenres(["Indie Folk", "Jazz", "Alternative"]);
    setMood("late_night");
    setListeningHabit("deep_listening");
    setCustomPrompt("I want records that feel emotionally immersive but not overly polished. Something intimate, warm, slightly haunted, but still beautiful. Headphones after midnight with a glass of wine and low lighting.");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      artists,
      genres: selectedGenres,
      mood: PRESET_MOODS.find((m) => m.value === mood)?.label || mood,
      listeningHabit: LISTENING_HABITS.find((h) => h.value === listeningHabit)?.label || listeningHabit,
      customPrompt
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-200 shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-curate-red px-6 py-5 border-b border-sleeve-mustard flex justify-between items-center">
        <div>
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
          className="text-[11px] text-sleeve-mustard font-mono hover:text-white border border-sleeve-mustard/30 hover:border-white px-2.5 py-1 rounded transition-all bg-curate-red animate-pulse"
        >
          Quick Demo Fill
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Step 1: Favorite Artists */}
        <div>
          <label className="block text-stone-900 font-bold text-sm tracking-tight mb-1">
            1. Who are your favorite artists or bands?
          </label>
          <span className="text-xs text-stone-500 block mb-2 font-editorial italic">
            List a few names that represent your core rotation (e.g., Miles Davis, Cocteau Twins, Nick Drake).
          </span>
          <input
            type="text"
            value={artists}
            onChange={(e) => setArtists(e.target.value)}
            placeholder="Radiohead, John Coltrane, Phoebe Bridgers..."
            className="w-full bg-bone-cream border border-stone-300 rounded px-3.5 py-2 text-stone-900 focus:outline-none focus:border-curate-red focus:ring-1 focus:ring-curate-red text-sm"
            required
          />
        </div>

        {/* Step 2: Genres */}
        <div>
          <label className="block text-stone-900 font-bold text-sm tracking-tight mb-1">
            2. Which genres are you currently hunting in?
          </label>
          <span className="text-xs text-stone-500 block mb-3 font-editorial italic">
            Select all that apply for your custom shelf recommendation.
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PRESET_GENRES.map((genre) => {
              const isChecked = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  type="button"
                  onClick={() => handleGenreToggle(genre)}
                  className={`text-xs py-2 px-2.5 rounded border text-center transition-all cursor-pointer ${
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
          <label className="block text-stone-900 font-bold text-sm tracking-tight mb-1">
            3. What mood or listening environment are you pursuing?
          </label>
          <span className="text-xs text-stone-500 block mb-3 font-editorial italic">
            We curate specific releases matching physical listening settings.
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
                    <span className="block text-xs font-bold text-stone-900">{m.label}</span>
                    <span className="block text-[11px] text-stone-500 italic mt-0.5">{m.description}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 4: Listening Habits */}
        <div>
          <label className="block text-stone-900 font-bold text-sm tracking-tight mb-1">
            4. What are your vinyl spinning habits?
          </label>
          <span className="text-xs text-stone-500 block mb-3 font-editorial italic text-stone-500">
            Tell us how the needle drops into your home routine.
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
                  <span className="text-xs text-stone-800">{h.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Step 5: Custom note */}
        <div>
          <label className="block text-stone-900 font-bold text-sm tracking-tight mb-1">
            5. Leave a note or seek specific vintage textures (Optional)
          </label>
          <span className="text-xs text-stone-500 block mb-2 font-editorial italic text-stone-500">
            "Looking for high-reverb folk", "dusty piano samples", "pristine analog fidelity master pressings"...
          </span>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Explain any subtle specifics you are searching for..."
            rows={3}
            className="w-full bg-bone-cream border border-stone-300 rounded px-3.5 py-2 text-stone-900 focus:outline-none focus:border-curate-red focus:ring-1 focus:ring-curate-red text-sm"
          />
        </div>
      </div>

      {/* Footer Submission Panel */}
      <div className="bg-stone-50 p-6 border-t border-stone-200 flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-2 text-stone-500 font-mono text-xs">
          <SlidersHorizontal className="w-4 h-4 text-curate-red" />
          <span>Syncing with synthetic catalog metadata</span>
        </div>

        <button
          type="submit"
          disabled={isLoading || !artists || selectedGenres.length === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm tracking-wide uppercase shadow transition-all cursor-pointer ${
            isLoading || !artists || selectedGenres.length === 0
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
