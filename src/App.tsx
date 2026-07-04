import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CalendarDays,
  RotateCcw, 
  Compass, 
  Layers, 
  Info,
  LogIn,
  LogOut,
  Heart,
  MoveRight,
  Music2,
  Sparkles,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";
import type { User } from "firebase/auth";
import QuestionnaireForm from "./components/QuestionnaireForm";
import VinylDisc from "./components/VinylDisc";
import OwnerInsightsView from "./components/OwnerInsightsView";
import OwnerIntelligenceDashboard from "./components/OwnerIntelligenceDashboard";
import AuthScreen from "./components/AuthScreen";
import FeedbackFormPage from "./components/FeedbackFormPage";
import TesterIntroPage from "./components/TesterIntroPage";
import { Brandmark } from "./components/BrandLogo";
import { buildRecommendations } from "./recommender";
import { CollectionInsights, UserPreferences, Recommendation, type ProfessorSessionHandoff } from "./types";
import { logOut, signInWithGoogle, watchAuth } from "./auth";
import { saveRecommendationAction, saveSessionAndSignals, type RecommendationAction } from "./sessions";

const curateHeaderLogo = new URL("../docs/brand/Logos/01_brandmark_color.png", import.meta.url).href;
const THIS_WEEKS_NEW_RELEASES = [
  { artist: "Beth Orton", title: "The Ground Above" },
  { artist: "Ibeyi", title: "Offering" },
  { artist: "Gold Panda", title: "Ton Up" },
];

type AppRoute = "intro" | "app" | "feedback";
type RecommendationActionState = {
  action: RecommendationAction;
  persistence: "local" | "saving" | "saved" | "error";
};

function getRouteFromHash(): AppRoute {
  const route = window.location.hash.replace(/^#\/?/, "");
  if (route === "intro" || route === "feedback" || route === "app") {
    return route;
  }
  return "app";
}

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
  const [activeExperience, setActiveExperience] = useState<"customer" | "owner">("customer");
  const [activeRoute, setActiveRoute] = useState<AppRoute>(getRouteFromHash);
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
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authBusy, setAuthBusy] = useState(false);
  const [showAuthScreen, setShowAuthScreen] = useState(false);
  const [prototypeActions, setPrototypeActions] = useState<Record<string, RecommendationActionState>>({});
  const [sessionPersistence, setSessionPersistence] = useState<{
    sessionId: string | null;
    state: "saved" | "local" | "error";
  } | null>(null);

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

  useEffect(() => watchAuth((user) => {
    setCurrentUser(user);
    if (user) {
      setAuthNotice(null);
    }
  }), []);

  useEffect(() => {
    const handleHashChange = () => setActiveRoute(getRouteFromHash());
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute) => {
    window.location.hash = `/${route}`;
    setActiveRoute(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getRouteUrl = (route: AppRoute) => {
    return `${window.location.origin}${window.location.pathname}#/${route}`;
  };

  const handleAuthClick = async () => {
    setAuthNotice(null);

    if (currentUser) {
      setAuthBusy(true);
      try {
        await logOut();
      } catch (err: any) {
        console.error(err);
        setAuthNotice(err.message || "The sign-out request could not finish. Please try again.");
      } finally {
        setAuthBusy(false);
      }
      return;
    }

    setShowAuthScreen(true);
  };

  const finishAuthRequest = async (request: () => Promise<unknown>) => {
    setAuthBusy(true);
    setAuthNotice(null);

    try {
      await request();
      setShowAuthScreen(false);
    } catch (err: any) {
      console.error(err);
      setAuthNotice(err.message || "The sign-in window could not finish. Please try again.");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleFormSubmit = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    setPreferences(prefs);

    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      const data = await buildRecommendations(prefs);
      if (data.recommendations && data.recommendations.length > 0) {
        setRecommendations(data.recommendations);
        setOwnerInsights(data.ownerInsights);
        setCollectionInsights(data.collectionInsights);
        setSelectedAlbumIdx(0);
        try {
          const savedSessionId = await saveSessionAndSignals(
            {
              artists: prefs.artists.split(",").map((artist) => artist.trim()).filter(Boolean),
              genres: prefs.genres,
              mood: prefs.mood,
              context: prefs.listeningHabit,
            },
            data.recommendations.map((rec) => ({
              albumId: rec.albumId ?? `${rec.artist}-${rec.title}`,
              title: rec.title,
              artist: rec.artist,
              type: rec.classification === "Familiar Classic" ? "familiar" : "discovery",
              matchScore: rec.matchScore,
            })),
            data.collectionInsights.coverageScore,
          );
          setSessionPersistence({
            sessionId: savedSessionId,
            state: currentUser && savedSessionId ? "saved" : currentUser ? "error" : "local",
          });
          setAuthNotice(
            currentUser && !savedSessionId
              ? "Recommendations are showing, but this session could not be saved to Firestore."
              : null,
          );
        } catch (sessionError: any) {
          console.error(sessionError);
          setSessionPersistence({ sessionId: null, state: currentUser ? "error" : "local" });
          setAuthNotice("Recommendations are showing, but this signed-in session could not be saved yet. Check the Firestore rules if this keeps happening.");
        }
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
    setAuthNotice(null);
    setPrototypeActions({});
    setSessionPersistence(null);
  };

  const activeAlbum = recommendations[selectedAlbumIdx] || DEFAULT_STORE_DISPLAY[0];
  const getRecommendationKey = (rec: Recommendation) => rec.albumId ?? `${rec.artist}-${rec.title}`;
  const professorSessionHandoff: ProfessorSessionHandoff | null = preferences && sessionPersistence
    ? {
        preferences,
        recommendations,
        sessionId: sessionPersistence.sessionId,
        persistence: sessionPersistence.state,
        actions: Object.fromEntries(
          (Object.entries(prototypeActions) as Array<[string, RecommendationActionState]>)
            .map(([key, value]) => [key, value.action]),
        ),
      }
    : null;
  const setPrototypeAction = async (rec: Recommendation, action: RecommendationAction) => {
    const key = getRecommendationKey(rec);
    const albumId = rec.albumId ?? `${rec.artist}-${rec.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    setPrototypeActions((current) => ({
      ...current,
      [key]: {
        action,
        persistence: currentUser ? "saving" : "local",
      },
    }));

    if (!currentUser) return;

    const savedId = await saveRecommendationAction({
      albumId,
      title: rec.title,
      artist: rec.artist,
      genre: rec.genre,
      action,
    });

    setPrototypeActions((current) => ({
      ...current,
      [key]: {
        action,
        persistence: savedId ? "saved" : "error",
      },
    }));
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-bone-cream flex flex-col selection:bg-sleeve-mustard selection:text-curate-red">
      <AnimatePresence>
        {showAuthScreen && !currentUser && (
          <motion.div
            key="auth-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AuthScreen
              busy={authBusy}
              notice={authNotice}
              onClose={() => setShowAuthScreen(false)}
              onGoogle={() => finishAuthRequest(signInWithGoogle)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      
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
                <span className="text-[10px] bg-curate-red text-white font-mono uppercase px-1.5 py-0.5 rounded border border-white/30 font-bold">
                  AI-Assisted Recommendations
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono tracking-wider mt-0.5">
                Curate Records & Books
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs text-sleeve-mustard font-mono text-right hidden md:block">
              "Where the needle drops — <br />
              and the book falls open."
            </span>
            <div className="h-6 w-px bg-stone-800 hidden md:block"></div>
            <button
              onClick={handleAuthClick}
              disabled={authBusy}
              className="flex items-center gap-2 bg-stone-900 px-3 py-1.5 rounded-full border border-sleeve-mustard/30 shadow-inner text-[10px] text-stone-300 font-mono font-bold tracking-wider uppercase hover:text-bone-cream hover:border-sleeve-mustard/60 disabled:opacity-60"
            >
              {currentUser ? <LogOut className="w-3.5 h-3.5 text-sleeve-mustard" /> : <LogIn className="w-3.5 h-3.5 text-sleeve-mustard" />}
              <span className="max-w-36 truncate">
                {authBusy
                  ? "Working"
                  : currentUser
                    ? currentUser.displayName || currentUser.email || "Signed In"
                    : "Sign In"}
              </span>
            </button>
            <div className="flex rounded-full border border-sleeve-mustard/30 bg-stone-950 p-1">
              {[
                { id: "customer", label: "Customer" },
                { id: "owner", label: "Owner" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setActiveExperience(option.id as "customer" | "owner");
                    navigateTo("app");
                  }}
                  className={`rounded-full px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-all ${
                    activeRoute === "app" && activeExperience === option.id
                      ? "bg-sleeve-mustard text-vinyl-black"
                      : "text-stone-400 hover:text-bone-cream"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="box-border flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">
        {activeRoute === "intro" ? (
          <TesterIntroPage
            appHref={getRouteUrl("app")}
            feedbackHref={getRouteUrl("feedback")}
          />
        ) : activeRoute === "feedback" ? (
          <FeedbackFormPage
            onBackToIntro={() => navigateTo("intro")}
            onTryApp={() => {
              setActiveExperience("customer");
              navigateTo("app");
            }}
          />
        ) : activeExperience === "owner" ? (
          <OwnerIntelligenceDashboard latestSession={professorSessionHandoff} />
        ) : (
          <>
        
        {/* Welcome Intro Hero Panel */}
        <div className="mb-8 border-l-4 border-curate-red pl-5 py-2">
          <h1 className="font-display text-2xl sm:text-3.5xl text-vinyl-black tracking-tight leading-tight uppercase">
            The Vinyl Concierge
          </h1>
          <p className="font-editorial text-stone-700 italic text-base sm:text-lg mt-1 max-w-3xl">
            Pull up a stool. Share an artist, a genre, or a listening mood, and the prototype will suggest five records from its limited demo catalog.
          </p>
        </div>

        <section className="mb-6 rounded-lg border border-sleeve-mustard bg-sleeve-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-curate-red" />
            <div>
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-curate-red">
                Prototype Notice
              </span>
              <p className="mt-1 text-sm leading-relaxed text-stone-700">
                This prototype uses a curated demo catalog to show the recommendation logic and Owner Intelligence workflow.
                Recommendations do not represent live store inventory. A production version would connect directly to
                inventory and commerce platforms such as Shopify, Square, or Lightspeed.
              </p>
            </div>
          </div>
        </section>

        {!preferences && (
          <div className="mb-6 rounded-lg border border-sleeve-mustard bg-sleeve-white p-4 shadow-sm">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-curate-red">
              Professor test path
            </span>
            <p className="mt-1 text-sm leading-relaxed text-stone-700">
              Sign in first, submit one customer request, optionally heart or rate a recommendation, then use the results-page button to view that exact session in Owner Intelligence.
            </p>
          </div>
        )}

        {authNotice && (
          <div className="mb-6 rounded-md border border-sleeve-mustard bg-sleeve-white px-4 py-3 text-sm text-stone-700 shadow-sm">
            <span className="font-mono text-[10px] uppercase tracking-widest text-curate-red font-bold block mb-1">
              Account note
            </span>
            {authNotice}
          </div>
        )}

        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* MAIN CUSTOMER FLOW */}
          <div className="min-w-0 lg:col-span-8 space-y-8">
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
                      The prototype is comparing your choices with its demo catalog and preparing a mix of familiar records and possible discoveries.
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
                    <div>1. The prototype catalog has at least one matching record.</div>
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
                      <span className="text-xs font-mono tracking-widest uppercase text-stone-500 block">
                        Showing results for custom query:
                      </span>
                      <div className="text-sm text-stone-800 font-sans font-bold flex flex-wrap gap-2 mt-1 items-center">
                        {preferences.artists && (
                          <span className="bg-white px-2 py-1 rounded border border-stone-200">
                            {preferences.artists.split(",")[0]}
                          </span>
                        )}
                        {preferences.genres.length > 0 && (
                          <span className="bg-white px-2 py-1 rounded border border-stone-200">
                            {preferences.genres.slice(0, 2).join(", ")}
                          </span>
                        )}
                        {preferences.mood && (
                          <span className="bg-white px-2 py-1 rounded border border-stone-200 italic font-normal tracking-wide">
                            "{preferences.mood}"
                          </span>
                        )}
                        {preferences.listeningHabit && (
                          <span className="bg-white px-2 py-1 rounded border border-stone-200 font-normal">
                            {preferences.listeningHabit}
                          </span>
                        )}
                      </div>
                      <p className="mt-3 max-w-2xl text-sm text-stone-600 leading-relaxed">
                        Prototype note: this is a limited 200-ish title demo catalog, not live store inventory. Match labels show whether the result is an exact artist hit, an adjacent fit, or a looser suggestion.
                      </p>
                    </div>

                    <button
                      onClick={handleReset}
                      className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 px-3.5 py-1.5 rounded text-xs font-mono font-bold transition-all shadow-sm cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-curate-red" />
                      Start Over
                    </button>
                  </div>

                  {/* Horizontal Vinyl Display rack selector */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-display font-bold text-sm uppercase tracking-wider text-stone-800 flex items-center gap-1.5 align-middle">
                        <Layers className="w-3.5 h-3.5 text-curate-red animate-pulse" />
                        YOUR CUSTOM SHELF RECOMMENDATIONS ({recommendations.length})
                      </h3>
                    </div>

	                    {/* Horizontal Scroller list of vinyl records */}
	                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 md:gap-x-12 gap-y-7">
	                      {recommendations.map((rec, i) => {
	                        const actionState = prototypeActions[getRecommendationKey(rec)];

	                        return (
	                          <div key={`${rec.artist}-${rec.title}`} className="space-y-2">
	                            <VinylDisc
	                              index={i}
	                              album={rec}
	                              isSelected={selectedAlbumIdx === i}
	                              onClick={() => {
	                                setSelectedAlbumIdx(i);
	                              }}
	                            />
	                            <div className={`rounded border px-2.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wide ${
	                              rec.matchConfidence === "exact"
	                                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
	                                : rec.matchConfidence === "low"
	                                  ? "border-amber-200 bg-amber-50 text-amber-800"
	                                  : "border-stone-200 bg-white text-stone-600"
	                            }`}>
	                              {rec.matchLabel ?? "Prototype catalog match"}
	                            </div>
	                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-[1fr_auto_auto]">
	                              <button
	                                type="button"
	                                onClick={() => setPrototypeAction(rec, "interest")}
	                                className={`col-span-2 inline-flex min-h-11 items-center justify-center gap-1.5 rounded border px-3 py-2 text-xs font-bold uppercase shadow-sm transition-colors sm:col-span-1 ${
	                                  actionState?.action === "interest"
	                                    ? "border-sleeve-mustard bg-sleeve-mustard text-vinyl-black"
	                                    : "border-curate-red bg-curate-red text-white hover:bg-vinyl-black"
	                                }`}
	                                aria-label={`Save interest in ${rec.title} by ${rec.artist}`}
	                              >
	                                <Heart
	                                  className={`h-4 w-4 ${
	                                    actionState?.action === "interest" ? "fill-current" : ""
	                                  }`}
	                                />
	                                <span>
	                                  {actionState?.action === "interest" ? "Interest Saved" : "Save Interest"}
	                                </span>
	                              </button>
	                              <button
	                                type="button"
	                                onClick={() => setPrototypeAction(rec, "like")}
	                                className={`inline-flex h-11 w-full items-center justify-center rounded border shadow-sm transition-colors sm:w-11 ${
	                                  actionState?.action === "like"
	                                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
	                                    : "border-stone-300 bg-white text-stone-700 hover:border-curate-red hover:text-curate-red"
	                                }`}
	                                aria-label={`Like ${rec.title} by ${rec.artist}`}
	                              >
	                                <ThumbsUp className="h-4 w-4" />
	                              </button>
	                              <button
	                                type="button"
	                                onClick={() => setPrototypeAction(rec, "dislike")}
	                                className={`inline-flex h-11 w-full items-center justify-center rounded border shadow-sm transition-colors sm:w-11 ${
	                                  actionState?.action === "dislike"
	                                    ? "border-curate-red bg-red-50 text-curate-red"
	                                    : "border-stone-300 bg-white text-stone-700 hover:border-curate-red hover:text-curate-red"
	                                }`}
	                                aria-label={`Dislike ${rec.title} by ${rec.artist}`}
	                              >
	                                <ThumbsDown className="h-4 w-4" />
	                              </button>
	                            </div>
	                            {actionState && (
	                              <p className="rounded border border-stone-200 bg-bone-cream px-2.5 py-1.5 text-xs leading-relaxed text-stone-600">
	                                {actionState.persistence === "saved"
	                                  ? "Response saved to your signed-in prototype account."
	                                  : actionState.persistence === "saving"
	                                    ? "Saving this response to your signed-in prototype account..."
	                                    : actionState.persistence === "error"
	                                      ? "Response is shown here, but the prototype could not save it to your account yet."
	                                      : "Response saved on this screen only. Sign in first to keep it with your prototype account."}
	                              </p>
	                            )}
	                          </div>
	                        );
	                      })}
	                    </div>
                  </div>

                  {/* Active Selected Record Custom Liner notes detailed page */}
                  <div className="bg-white border border-stone-200 rounded-lg shadow-xl overflow-hidden">
                    
                    {/* Spin bar tape info */}
                    <div className="bg-vinyl-black border-b border-stone-800 py-2.5 px-5 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-sleeve-mustard"></span>
                        <span className="text-[10px] font-mono tracking-widest uppercase text-stone-400">
                          Selected Recommendation
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

                      {/* Essay body column - shelf note explanation */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 block">
                          SHELF NOTE
                        </span>
                        
                        <div className="text-stone-800 text-sm md:text-base leading-relaxed space-y-4 whitespace-pre-line font-sans">
                          {activeAlbum.whyThisMatches}
                        </div>
                        
                        <div className="p-3 bg-bone-cream/60 rounded border border-dashed border-stone-300 text-xs text-stone-600 font-mono mt-4 flex items-center gap-2">
                          <Info className="w-4 h-4 text-curate-red" />
                          <span>
                            Sound and mood: <strong className="text-stone-800">{activeAlbum.aestheticVibe}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Suggested starting tracks */}
                      <div className="border-t border-stone-100 pt-5 space-y-3">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-stone-500 block">
                          TRACKS TO START WITH
                        </span>
                        <p className="text-sm text-stone-600">
                          This prototype recommends tracks but does not play audio.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          {activeAlbum.tracksToListenTo.map((track) => (
                            <div
                              key={track}
                              className="text-left p-3 rounded border text-sm bg-bone-cream border-stone-200 text-stone-700 flex items-start gap-2"
                            >
                              <Music2 className="mt-0.5 h-4 w-4 shrink-0 text-curate-red" />
                              <span className="leading-snug">
                                {track}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {collectionInsights && (
                    <div className="rounded-lg border border-sleeve-mustard bg-vinyl-black p-6 text-bone-cream shadow-xl">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sleeve-mustard" />
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase text-sleeve-mustard">
                            Explore beyond these recommendations
                          </span>
                          <h3 className="mt-1 font-display text-xl uppercase tracking-tight text-white">
                            Suggested Exploration Areas
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-stone-300">
                            These broader sections may be worth browsing next based on the artists, genres, and listening choices you shared.
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 flex flex-wrap gap-3">
                        {collectionInsights.explorationAreas.map((area) => (
                          <span
                            key={area}
                            className="rounded-full border border-sleeve-mustard/60 bg-stone-950 px-4 py-2 text-sm font-bold text-bone-cream"
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="rounded-lg border-2 border-curate-red bg-sleeve-white p-5 shadow-lg">
                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-curate-red">
                      Professor walkthrough · customer to owner
                    </span>
                    <h3 className="mt-2 font-display text-xl uppercase text-vinyl-black">
                      See this customer session in Owner Intelligence
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {sessionPersistence?.state === "saved"
                        ? "This recommendation session was saved to Firestore. Open the owner view to see how the same records become a cautious sourcing watchlist."
                        : sessionPersistence?.state === "error"
                          ? "The recommendations worked, but Firestore did not confirm the save. You can still inspect the handoff, clearly labeled as unsaved."
                          : "This session is currently browser-only. Sign in before submitting if you want the walkthrough to demonstrate the Firestore connection."}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveExperience("owner");
                        navigateTo("app");
                      }}
                      className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded bg-curate-red px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-vinyl-black"
                    >
                      View This Session in Owner Intelligence
                      <MoveRight className="h-4 w-4" />
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CURATE COMMUNITY SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="rounded-lg border border-stone-800 bg-vinyl-black p-6 text-bone-cream shadow-xl">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-sleeve-mustard" />
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-widest text-sleeve-mustard">
                    Sample store board · June 26
                  </span>
                  <h2 className="font-display text-lg uppercase text-white">
                    This Week's New Releases
                  </h2>
                </div>
              </div>
              <div className="mt-4 space-y-3">
                {THIS_WEEKS_NEW_RELEASES.map((release) => (
                  <div key={`${release.artist}-${release.title}`} className="border-b border-stone-800 pb-3 last:border-0 last:pb-0">
                    <strong className="block text-sm text-white">{release.title}</strong>
                    <span className="text-sm font-editorial italic text-stone-300">{release.artist}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded border border-sleeve-mustard/40 bg-stone-950 px-3 py-3">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-sleeve-mustard">
                  Coming July 10
                </span>
                <strong className="mt-1 block text-sm text-white">Foreign Tongues</strong>
                <span className="text-sm font-editorial italic text-stone-300">The Rolling Stones</span>
              </div>
            </div>

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
          </aside>

        </div>

        {/* OWNER INSIGHTS SEGMENTED CONTAINER VIEW */}
        <OwnerInsightsView insights={ownerInsights} />

          </>
        )}

      </main>

      {/* Curate Style Footer */}
      <footer className="bg-vinyl-black text-stone-400 py-6 mt-16 border-t-4 border-sleeve-mustard">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-mono">
            &copy; 2026 Curate Records & Books
          </p>
        </div>
      </footer>

    </div>
  );
}
