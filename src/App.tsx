import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  RotateCcw, 
  Compass, 
  Layers, 
  Info,
  Gauge,
  LibraryBig,
  Ticket,
  MapPinned
} from "lucide-react";
import QuestionnaireForm from "./components/QuestionnaireForm";
import VinylDisc from "./components/VinylDisc";
import OwnerInsightsView from "./components/OwnerInsightsView";
import { Brandmark } from "./components/BrandLogo";
import { buildRecommendations } from "./recommender";
import { CollectionInsights, UserPreferences, Recommendation } from "./types";

const curateHeaderLogo = new URL("../docs/brand/Logos/01_brandmark_color.png", import.meta.url).href;

// Illustrative starting list for initial load when no recommendation is fetched yet
const DEFAULT_STORE_DISPLAY: Recommendation[] = [
  {
    title: "Kind of Blue",
    artist: "Miles Davis",
    genre: "Jazz",
    releaseYear: "1959",
    classification: "Familiar Classic",
    whyThisMatches: "A perfect introduction to modal jazz, recorded over just two sessions in the spring of '59. Miles, Coltrane, and Bill Evans crafted an infinite late-night masterpiece that hangs in the air like smoke. It's the ultimate turntable-friendly record — pure physical space captured in black vinyl wax.",
    aestheticVibe: "Late-night rain on neon streets",
    tracksToListenTo: ["So What", "Blue in Green", "Flamenco Sketches"]
  },
  {
    title: "Heaven or Las Vegas",
    artist: "Cocteau Twins",
    genre: "Dream Pop",
    releaseYear: "1990",
    classification: "Discovery Gem",
    whyThisMatches: "Elizabeth Fraser's otherworldly voice floats on Robin Guthrie's oceans of shimmering, chorused guitar. Released as the 4AD label's peak dreamscape, this pressing creates a physical soundstage in your room that fully exposes the depth of multi-tracked analog wizardry. A masterpiece in sonic warmth.",
    aestheticVibe: "Misty purple mountain peaks",
    tracksToListenTo: ["Cherry-coloured Funk", "Fifty-fifty Clown", "Heaven or Las Vegas"]
  },
  {
    title: "Pink Moon",
    artist: "Nick Drake",
    genre: "Folk",
    releaseYear: "1972",
    classification: "Familiar Classic",
    whyThisMatches: "Stark, intimate, and devastatingly quiet. Nick Drake recorded this on a solo pine acoustic guitar and a midnight voice. This physical record demands a quiet room, low light, and your vintage amp warmed to perfection. It is as close as a human has ever crawled into a speaker cone to talk to you.",
    aestheticVibe: "Solitary candle in dark cabins",
    tracksToListenTo: ["Pink Moon", "Place to Be", "Road"]
  }
];

export default function App() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(DEFAULT_STORE_DISPLAY);
  const [collectionInsights, setCollectionInsights] = useState<CollectionInsights | null>(null);
  const [ownerInsights, setOwnerInsights] = useState<any>({
    trendsSummary: "Synthetic owner dashboard is modeling recent recommendation sessions across indie folk, jazz, alternative, classic rock, country, audiophile, and singer-songwriter customers.",
    inventoryOpportunities: "Use the dashboard alerts to prioritize jazz depth, indie folk staff picks, country storytelling records, and classic rock bridge titles before the next buy list.",
    underrepresentedAreas: "The strongest sample gaps are jazz fusion, lyric-forward indie folk, country foundations, and alternative records that bridge familiar artists with deeper bins.",
    merchandisingStrategy: "Shelf title cue: 'Late-Night Requests From the Listening Desk.' Place one familiar classic beside two discovery records so the table feels welcoming rather than obscure."
  });
  const [selectedAlbumIdx, setSelectedAlbumIdx] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingPhraseIndex, setLoadingPhraseIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const loadingPhrases = [
    "Skimming our back racks of original pressings...",
    "Talking to the morning clerks in the stockroom...",
    "Checking the staff shelf notes...",
    "Spinning test groove sections on the display deck...",
    "Flipping through dust-jacket covers for secret clues...",
    "Writing the warm independent shopkeeper's recommendation..."
  ];

  // Rotate loading phrases during assistant analysis
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    setPreferences(prefs);

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      const data = buildRecommendations(prefs);
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setOwnerInsights(data.ownerInsights);
        setCollectionInsights(data.collectionInsights);
        setSelectedAlbumIdx(0);
      } else {
        throw new Error("Empty recommendations response structure received.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while building the shelf recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPreferences(null);
    setRecommendations(DEFAULT_STORE_DISPLAY);
    setCollectionInsights(null);
    setSelectedAlbumIdx(0);
    setError(null);
  };

  const activeAlbum = recommendations[selectedAlbumIdx] || DEFAULT_STORE_DISPLAY[0];

  return (
    <div className="min-h-screen bg-bone-cream flex flex-col selection:bg-sleeve-mustard selection:text-curate-red">
      
      {/* Visual Top Header of Curate Brand Colors */}
      <header className="bg-vinyl-black text-bone-cream border-b-4 border-sleeve-mustard shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Production Curate brandmark with an opaque plate for contrast */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-bone-cream border-2 border-sleeve-mustard shadow-lg p-1.5 flex items-center justify-center">
              <img
                src={curateHeaderLogo}
                alt="Curate Records & Books"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-display text-white text-lg tracking-tight uppercase">THE VINYL CONCIERGE</span>
                <span className="text-[10px] bg-curate-red text-sleeve-mustard font-mono uppercase px-1.5 py-0.5 rounded border border-sleeve-mustard/20 font-bold">
                  Your AI Curator
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono tracking-wider mt-0.5">
                Curate Records & Books · Northern New Mexico
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs text-sleeve-mustard font-mono text-right hidden md:block">
              "Where the needle drops — <br />
              and the book falls open."
            </span>
            <div className="h-6 w-px bg-stone-800 hidden md:block"></div>
            {/* Curate Active Badge */}
            <div className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-full border border-curate-red/40 shadow-inner">
              <span className="w-2.5 h-2.5 rounded-full bg-curate-red animate-pulse"></span>
              <span className="text-[10px] text-stone-300 font-mono font-bold tracking-wider uppercase">
                Curate Brand Active
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        
        {/* Welcome Intro Hero Panel */}
        <div className="mb-8 border-l-4 border-curate-red pl-5 py-2">
          <h1 className="font-display text-2xl sm:text-3.5xl text-vinyl-black tracking-tight leading-tight uppercase">
            The Vinyl Concierge: Your AI Curator
          </h1>
          <p className="font-editorial text-stone-700 italic text-base sm:text-lg mt-1 max-w-3xl">
            Pull up a stool. Share your favorite albums, rotating genres, and the specific atmosphere you are chasing. Our experienced shop clerk recommendation engine will hand-pick custom shelf items for your listening stack.
          </p>
        </div>

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE COLUMN (7 GRID): Interactive Form OR Recommendation Display Panel */}
          <div className="lg:col-span-7 space-y-8">
            <AnimatePresence mode="wait">
              {loading ? (
                /* Interactive Loading turntable state */
                <motion.div
                  key="loading-gate"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-white rounded-lg border border-stone-200 shadow-xl p-8 text-center space-y-6 flex flex-col justify-center items-center min-h-[450px]"
                >
                  {/* Big Spinning Brandmark Record Loader */}
                  <div className="relative w-48 h-48 animate-spin-vinyl shadow-2xl cursor-wait rounded-full">
                    <Brandmark size="100%" />
                  </div>

                  <div className="max-w-md space-y-2">
                    <span className="text-xs text-curate-red font-mono uppercase tracking-widest font-bold block animate-pulse">
                      Dropping the stylus...
                    </span>
                    <h3 className="text-lg font-serif italic text-stone-800 font-bold transition-all duration-300">
                      "{loadingPhrases[loadingPhraseIndex]}"
                    </h3>
                    <p className="text-xs text-stone-500 leading-relaxed font-sans pt-2">
                      Our clerk is drafting personalized liner notes tailored to your listening habits, blending familiar legends with underrepresented underground pressings.
                    </p>
                  </div>
                </motion.div>
              ) : error ? (
                /* Error boundary */
                <motion.div
                  key="error-gate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-red-50 border border-red-200 text-red-900 rounded-lg p-6 space-y-4"
                >
                  <h3 className="font-bold text-lg">Humm... The stylus hit a dust speck.</h3>
                  <p className="text-sm">
                    {error}
                  </p>
                  <div className="p-3 bg-white rounded border border-red-100 text-xs text-stone-600 font-mono space-y-1">
                    <div>Please ensure:</div>
                    <div>1. The recommendation catalog has at least one matching record.</div>
                    <div>2. The local app bundle finished loading successfully.</div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="bg-curate-red hover:bg-stone-900 text-white font-mono text-xs font-bold uppercase py-2 px-4 rounded transition-all cursor-pointer shadow hover:shadow-lg"
                  >
                    Try Questionnaire Again
                  </button>
                </motion.div>
              ) : !preferences ? (
                /* Step A: User fills out preferences */
                <motion.div
                  key="form-gate"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuestionnaireForm onSubmit={handleFormSubmit} isLoading={loading} />
                </motion.div>
              ) : (
                /* Step B: User sees custom recommendations stack with detailed breakdown */
                <motion.div
                  key="results-gate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Preferences Summary Banner */}
                  <div className="bg-stone-100 border border-stone-200 rounded-lg p-5 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500 block">
                        Showing results for custom query:
                      </span>
                      <div className="text-xs text-stone-800 font-sans font-bold flex flex-wrap gap-2 mt-1 items-center">
                        <span className="bg-white px-2 py-1 rounded border border-stone-200">{preferences.artists.split(',')[0]}</span>
                        <span className="text-stone-400 font-serif">·</span>
                        <span className="bg-white px-2 py-1 rounded border border-stone-200">{preferences.genres.slice(0, 2).join(", ")}</span>
                        <span className="text-stone-400 font-serif">·</span>
                        <span className="bg-white px-2 py-1 rounded border border-stone-200 italic font-normal tracking-wide">"{preferences.mood}"</span>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-3.5 py-1.5 rounded text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-curate-red" />
                      Refill Filter
                    </button>
                  </div>

                  {/* Horizontal Vinyl Display rack selector */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-display font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-1.5 align-middle">
                        <Layers className="w-3.5 h-3.5 text-curate-red animate-pulse" />
                        YOUR CUSTOM SHELF RECOMMENDATIONS ({recommendations.length})
                      </h3>
                      <span className="text-[11px] text-stone-500 font-mono tracking-tighter">
                        PROTOTYPE PREVIEW
                      </span>
                    </div>

                    {/* Horizontal Scroller list of vinyl records */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {recommendations.map((rec, i) => (
                        <VinylDisc
                          key={i}
                          index={i}
                          album={rec}
                          isSelected={selectedAlbumIdx === i}
                          onClick={() => {
                            setSelectedAlbumIdx(i);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Selected Record Custom Liner notes detailed page */}
                  <div className="bg-white border border-stone-200 rounded-lg shadow-xl overflow-hidden">
                    
                    {/* Spin bar tape info */}
                    <div className="bg-vinyl-black border-b border-stone-800 py-2.5 px-5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-sleeve-mustard"></span>
                        <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400">
                          Selected shelf pull from the display bins
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-sleeve-mustard font-mono uppercase">
                        Staff Pick
                      </div>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      
                      {/* Album Meta */}
                      <div className="flex justify-between items-start flex-wrap gap-4 border-b border-stone-100 pb-5">
                        <div>
                          <span className="text-curate-red text-[11px] font-mono tracking-widest uppercase font-bold block mb-1">
                            {activeAlbum.classification} · {activeAlbum.genre}
                          </span>
                          <h2 className="font-display text-2xl md:text-3xl text-stone-900 uppercase tracking-tight leading-tight">
                            {activeAlbum.title}
                          </h2>
                          <p className="font-editorial italic text-stone-600 text-lg md:text-xl mt-1.5">
                            By {activeAlbum.artist}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 bg-bone-cream px-3.5 py-2 rounded-md border border-stone-200 shadow-sm">
                          <span className="text-stone-500 font-mono text-[10px] tracking-wider uppercase block">
                            Release
                          </span>
                          <span className="font-display text-base text-stone-800">
                            {activeAlbum.releaseYear}
                          </span>
                        </div>
                      </div>

                      {/* Essay body column - The Clerk essay explanation */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 block">
                          CLERK NOTES & DIALOGUE
                        </span>
                        
                        <div className="text-stone-800 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
                          {activeAlbum.whyThisMatches}
                        </div>
                        
                        <div className="p-3 bg-bone-cream/60 rounded border border-dashed border-stone-300 text-xs text-stone-600 font-mono mt-4 flex items-center gap-2">
                          <Info className="w-4 h-4 text-curate-red" />
                          <span>
                            Aesthetic match criteria: <strong className="text-stone-800 italic">"{activeAlbum.aestheticVibe}"</strong>
                          </span>
                        </div>
                      </div>

                      {/* Track cues */}
                      <div className="border-t border-stone-100 pt-5 space-y-3">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 block">
                          SIDE A TRACK CUES
                        </span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {activeAlbum.tracksToListenTo.map((track, i) => (
                            <div
                              key={track}
                              className="text-left p-2.5 rounded border text-xs bg-bone-cream border-stone-200 text-stone-700 flex items-center gap-2"
                            >
                              <span className="text-[10px] font-mono text-curate-red font-bold">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="truncate">
                                {track}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {collectionInsights && (
                    <div className="bg-sleeve-white border border-stone-300 rounded-lg shadow-xl overflow-hidden">
                      <div className="bg-vinyl-black px-5 py-3 border-b-4 border-sleeve-mustard flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-sleeve-mustard block">
                            New customer feature
                          </span>
                          <h3 className="font-display text-lg text-white uppercase tracking-tight flex items-center gap-2">
                            <LibraryBig className="w-5 h-5 text-curate-red" />
                            Collection Insights
                          </h3>
                        </div>
                        <div className="bg-stone-950 border border-stone-800 rounded-md px-3 py-2 flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-sleeve-mustard" />
                          <div>
                            <span className="block text-[9px] text-stone-500 font-mono uppercase tracking-widest">
                              Coverage score
                            </span>
                            <span className="block font-display text-xl text-bone-cream leading-none">
                              {collectionInsights.coverageScore}/100
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 space-y-6">
                        <div className="bg-bone-cream border border-stone-200 rounded-md p-4 flex items-start gap-3">
                          <Ticket className="w-5 h-5 text-curate-red mt-0.5 shrink-0" />
                          <p className="text-sm text-stone-700 font-editorial italic leading-relaxed">
                            {collectionInsights.scoreNote}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between gap-3 mb-3">
                            <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500">
                              Worth pulling from the next bin
                            </span>
                            <span className="text-[10px] font-mono uppercase text-curate-red font-bold">
                              {collectionInsights.opportunities.length} shelf notes
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {collectionInsights.opportunities.map((opportunity) => (
                              <div
                                key={`${opportunity.artist}-${opportunity.title}`}
                                className="bg-white border border-stone-200 rounded-md p-4 shadow-sm hover:border-sleeve-mustard transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-curate-red font-bold">
                                      {opportunity.genre}
                                    </span>
                                    <h4 className="font-display text-sm text-stone-900 uppercase leading-tight mt-1">
                                      {opportunity.title}
                                    </h4>
                                    <p className="font-editorial text-stone-600 italic text-sm">
                                      {opportunity.artist}
                                    </p>
                                  </div>
                                  <span className="text-[9px] font-mono uppercase bg-bone-cream border border-stone-200 text-stone-600 rounded px-2 py-1 whitespace-nowrap">
                                    {opportunity.shelfTag}
                                  </span>
                                </div>
                                <p className="text-xs text-stone-700 leading-relaxed mt-3">
                                  {opportunity.reason}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-stone-300 pt-5">
                          <div className="flex items-center gap-2 mb-3">
                            <MapPinned className="w-4 h-4 text-curate-red" />
                            <span className="text-[10px] font-mono tracking-widest uppercase text-stone-500">
                              Suggested exploration areas
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {collectionInsights.explorationAreas.map((area) => (
                              <span
                                key={area}
                                className="bg-vinyl-black text-bone-cream border border-sleeve-mustard/50 rounded-full px-3 py-1.5 text-[11px] font-mono uppercase tracking-wide"
                              >
                                {area}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT SIDE COLUMN (5 GRID): Curate Records & Books Shop Ambience */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Live Shop Visualizer widget */}
            <div className="bg-vinyl-black rounded-lg border border-stone-800 shadow-xl overflow-hidden text-bone-cream">
              <div className="bg-stone-950 px-5 py-3 border-b border-stone-900 flex justify-between items-center">
                <span className="text-[10px] font-mono tracking-widest uppercase text-sleeve-mustard">
                  Curate Records · Live Display Bins
                </span>
                <span className="flex items-center gap-1 text-[10px] uppercase font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active
                </span>
              </div>

              <div className="p-5 space-y-4 text-xs font-sans">
                <p className="text-xs text-stone-400 font-editorial italic text-stone-300">
                  This prototype holds a curated list of our current synthetic floor inventory that we use to match client interests. See outstanding titles below:
                </p>

                {/* Preformatted list of standard stock items matching user request */}
                <div className="space-y-2 h-76 overflow-y-auto pr-1">
                  {[
                    { title: "Kind of Blue", artist: "Miles Davis", genre: "Jazz" },
                    { title: "Blue Train", artist: "John Coltrane", genre: "Jazz" },
                    { title: "Heaven or Las Vegas", artist: "Cocteau Twins", genre: "Dream Pop" },
                    { title: "In Rainbows", artist: "Radiohead", genre: "Alternative" },
                    { title: "Punisher", artist: "Phoebe Bridgers", genre: "Indie Folk" },
                    { title: "Pink Moon", artist: "Nick Drake", genre: "Folk" },
                    { title: "A Love Supreme", artist: "John Coltrane", genre: "Jazz" },
                    { title: "Jolene", artist: "Dolly Parton", genre: "Country" },
                    { title: "Rumours", artist: "Fleetwood Mac", genre: "Classic Rock" },
                    { title: "The Queen Is Dead", artist: "The Smiths", genre: "Indie Rock" },
                    { title: "Illinois", artist: "Sufjan Stevens", genre: "Indie Folk" }
                  ].map((inv, idx) => (
                    <div 
                      key={idx}
                      className="bg-stone-900/40 p-2 border border-stone-800 rounded flex justify-between items-center hover:bg-stone-800/60 transition"
                    >
                      <div>
                        <span className="block font-bold text-stone-100">{inv.title}</span>
                        <span className="block text-[10px] text-stone-400 font-editorial italic">{inv.artist}</span>
                      </div>
                      <span className="text-[9px] font-mono uppercase bg-stone-800 border border-stone-700 px-1.5 py-0.5 rounded text-stone-300">
                        {inv.genre}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] text-stone-400 text-center font-mono pt-2 border-t border-stone-900">
                  Total available: 1,421 physical copies inside display slots
                </div>
              </div>
            </div>

            {/* Vintage style bulletin board notice */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 rounded-lg border border-amber-200 p-6 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-sleeve-mustard rotate-45 translate-x-8 -translate-y-8 border-l border-b border-sleeve-mustard"></div>
              
              <div className="flex gap-2 items-center text-xs font-mono uppercase text-stone-500 mb-1">
                <Compass className="w-4 h-4 text-curate-red" />
                <span>Curate Community</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-bone-cream/70 border border-amber-200 rounded p-3">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-500">
                    Next Record Club
                  </span>
                  <span className="block font-bold text-stone-800 leading-tight mt-1">
                    First Monday of Every Month
                  </span>
                </div>
                <div className="bg-bone-cream/70 border border-amber-200 rounded p-3">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-500">
                    Featured Theme
                  </span>
                  <span className="block font-bold text-stone-800 leading-tight mt-1">
                    Women Who Changed Rock
                  </span>
                </div>
                <div className="bg-bone-cream/70 border border-amber-200 rounded p-3">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-500">
                    New Arrivals This Week
                  </span>
                  <span className="block font-display text-2xl text-curate-red leading-none mt-1">
                    23
                  </span>
                </div>
                <div className="bg-bone-cream/70 border border-amber-200 rounded p-3">
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-stone-500">
                    Most Requested Genre
                  </span>
                  <span className="block font-bold text-stone-800 leading-tight mt-1">
                    Indie Folk
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-2 gap-2 text-[11px] text-stone-600 font-mono">
                <div>
                  <span className="block font-bold text-stone-800">Shop Hours:</span>
                  <span>Tue - Sun, 11am - 7pm</span>
                </div>
                <div aria-hidden="true"></div>
              </div>
            </div>

          </div>

        </div>

        {/* OWNER INSIGHTS SEGMENTED CONTAINER VIEW */}
        <OwnerInsightsView insights={ownerInsights} />

      </main>

      {/* Curate Style Footer */}
      <footer className="bg-vinyl-black text-stone-400 py-6 mt-16 border-t-4 border-sleeve-mustard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-mono">
            &copy; 2026 Curate Records & Books, USA
          </p>
        </div>
      </footer>

    </div>
  );
}
