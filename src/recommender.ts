import { CollectionInsights, RecommendationResponse, UserPreferences } from "./types";

type Classification = "Familiar Classic" | "Discovery Gem";

interface CatalogRecord {
  title: string;
  artist: string;
  genre: string;
  releaseYear: string;
  classification: Classification;
  vibe: string;
  tracksToListenTo: string[];
  shelfNote: string;
}

const CATALOG: CatalogRecord[] = [
  {
    title: "Kind of Blue",
    artist: "Miles Davis",
    genre: "Jazz",
    releaseYear: "1959",
    classification: "Familiar Classic",
    vibe: "late-night jazz masterwork, cool modal progressions",
    tracksToListenTo: ["So What", "Blue in Green", "Flamenco Sketches"],
    shelfNote: "Miles leaves so much air around the notes that the whole room starts listening back. It is the safest first pull for someone chasing quiet focus, midnight light, and a record that gets better when nobody is talking."
  },
  {
    title: "In Rainbows",
    artist: "Radiohead",
    genre: "Alternative",
    releaseYear: "2007",
    classification: "Familiar Classic",
    vibe: "warm textures, art rock, intricate rhythms",
    tracksToListenTo: ["Nude", "Weird Fishes/Arpeggi", "Reckoner"],
    shelfNote: "This is the Radiohead record with the warmest pulse. The drums feel close, the guitars flicker at the edge of the lampshade, and the whole thing has that beautiful tension between human touch and machine precision."
  },
  {
    title: "Punisher",
    artist: "Phoebe Bridgers",
    genre: "Indie Folk",
    releaseYear: "2020",
    classification: "Familiar Classic",
    vibe: "melancholic, intimate, haunted indie songwriting",
    tracksToListenTo: ["Garden Song", "Chinese Satellite", "I Know the End"],
    shelfNote: "Phoebe writes like she is telling the truth from the next room over. It is intimate without turning precious, and it fits listeners who want something tender, sharp, and a little spectral after midnight."
  },
  {
    title: "Heaven or Las Vegas",
    artist: "Cocteau Twins",
    genre: "Dream Pop",
    releaseYear: "1990",
    classification: "Discovery Gem",
    vibe: "ethereal guitars, shimmering oceans of sound",
    tracksToListenTo: ["Cherry-coloured Funk", "Fifty-fifty Clown", "Heaven or Las Vegas"],
    shelfNote: "A good copy of this record can make the speakers feel twice as wide. Elizabeth Fraser does not so much sing lyrics as bend light around them, which makes it a strong bridge from indie melancholy into dreamier bins."
  },
  {
    title: "Pink Moon",
    artist: "Nick Drake",
    genre: "Folk",
    releaseYear: "1972",
    classification: "Familiar Classic",
    vibe: "stark acoustic guitar, intimate late-night confessions",
    tracksToListenTo: ["Pink Moon", "Place to Be", "Road"],
    shelfNote: "There is almost nowhere for this record to hide. Guitar, voice, a little piano, and that hush that makes a turntable feel like furniture with a memory."
  },
  {
    title: "Dummy",
    artist: "Portishead",
    genre: "Trip-Hop",
    releaseYear: "1994",
    classification: "Discovery Gem",
    vibe: "dusty samples, tense vocals, cinematic atmosphere",
    tracksToListenTo: ["Sour Times", "Roads", "Glory Box"],
    shelfNote: "For customers asking for low lighting and uneasy beauty, this is the bin pull. The samples crackle, the bass sits low, and Beth Gibbons sounds like she is singing from the last booth in the room."
  },
  {
    title: "A Love Supreme",
    artist: "John Coltrane",
    genre: "Jazz",
    releaseYear: "1965",
    classification: "Familiar Classic",
    vibe: "spiritual jazz, transcendent, deeply emotional",
    tracksToListenTo: ["Acknowledgement", "Resolution", "Psalm"],
    shelfNote: "A serious record, but not a stiff one. Coltrane turns devotion into motion, and it belongs near anyone who says jazz, reflection, or emotional lift in the same breath."
  },
  {
    title: "Illinois",
    artist: "Sufjan Stevens",
    genre: "Indie Folk",
    releaseYear: "2005",
    classification: "Discovery Gem",
    vibe: "orchestral indie folk, literary, generous",
    tracksToListenTo: ["Chicago", "Casimir Pulaski Day", "The Predatory Wasp of the Palisades Is Out to Get Us!"],
    shelfNote: "This is the record for someone who wants a whole bookcase inside the album sleeve. It is ornate, strange, and humane, with enough small details to reward a slow second side."
  },
  {
    title: "Music for Airports",
    artist: "Brian Eno",
    genre: "Ambient",
    releaseYear: "1978",
    classification: "Discovery Gem",
    vibe: "soft loops, suspended time, calm architecture",
    tracksToListenTo: ["1/1", "2/1", "1/2"],
    shelfNote: "Useful for customers who want the room changed more than the song changed. It is patient, almost architectural music, and a good reminder that quiet records can still have a spine."
  },
  {
    title: "Crumbling",
    artist: "Mid-Air Thief",
    genre: "Psychedelic Folk",
    releaseYear: "2018",
    classification: "Discovery Gem",
    vibe: "glowing acoustic electronics, restless folk",
    tracksToListenTo: ["These Chains", "Gameun Deut", "Crumbling Together"],
    shelfNote: "A left-field recommendation when folk, Radiohead, and dream texture overlap. It keeps shifting under your hand, but it never loses its warmth."
  }
];

const COLLECTION_OPPORTUNITIES = [
  {
    title: "Blue Train",
    artist: "John Coltrane",
    genre: "Jazz",
    area: "Jazz Classics",
    shelfTag: "blue-note-staple",
    keywords: ["jazz", "miles", "coltrane", "late", "night", "deep", "study", "rain"],
    reason: "If Kind of Blue is already on your shelf, this is the next sturdy spine. It adds a harder bop edge without losing that after-hours room tone."
  },
  {
    title: "Head Hunters",
    artist: "Herbie Hancock",
    genre: "Jazz Funk",
    area: "Jazz-Funk Crossovers",
    shelfTag: "rhythm-section-upgrade",
    keywords: ["jazz", "funk", "soul", "high", "energy", "weekend", "groove", "miles"],
    reason: "A smart gap-filler for jazz listeners who want the section to move a little. It opens the door from modal classics into electric, bass-forward records."
  },
  {
    title: "Close to the Edge",
    artist: "Yes",
    genre: "Progressive Rock",
    area: "Progressive Rock Essentials",
    shelfTag: "side-long-listening",
    keywords: ["radiohead", "alternative", "rock", "deep", "listening", "headphones", "focused", "intricate"],
    reason: "For a Radiohead or art-rock listener, this gives the shelf a long-form ancestor: patient builds, careful musicianship, and a full Side A commitment."
  },
  {
    title: "For Emma, Forever Ago",
    artist: "Bon Iver",
    genre: "Indie Folk",
    area: "Singer-Songwriter Foundations",
    shelfTag: "winter-cabin-core",
    keywords: ["indie", "folk", "phoebe", "bridgers", "melancholic", "intimate", "acoustic", "haunted"],
    reason: "This belongs near lyric-forward indie records because it keeps the room small and emotionally plainspoken. A good copy fills the quiet without crowding it."
  },
  {
    title: "Blue",
    artist: "Joni Mitchell",
    genre: "Singer-Songwriter",
    area: "Singer-Songwriter Foundations",
    shelfTag: "first-pressing-soul",
    keywords: ["folk", "singer", "songwriter", "nick", "drake", "melancholic", "morning", "coffee", "papers"],
    reason: "A foundational pull for anyone building a shelf around direct writing and a voice close to the microphone. It makes the rest of the folk bin easier to read."
  },
  {
    title: "Ladies and Gentlemen We Are Floating in Space",
    artist: "Spiritualized",
    genre: "Dream Pop",
    area: "Dream Pop Deep Shelf",
    shelfTag: "wide-speaker-record",
    keywords: ["dream", "pop", "cocteau", "ambient", "late", "night", "headphones", "space"],
    reason: "This is a useful bridge from shimmer into gospel-sized space-rock. It widens the collection without leaving the dreamy shelf completely behind."
  },
  {
    title: "Another Green World",
    artist: "Brian Eno",
    genre: "Ambient Art Rock",
    area: "Ambient Foundations",
    shelfTag: "quiet-room-tool",
    keywords: ["ambient", "drone", "eno", "focused", "study", "background", "textural", "room"],
    reason: "If you use records to change the room, this is an essential next stop. It sits between song and texture, which makes it more playable than pure ambient for many shelves."
  },
  {
    title: "Carrie, Come On",
    artist: "Duster",
    genre: "Modern Indie",
    area: "Modern Indie Discovery",
    shelfTag: "slow-burn-staff-pick",
    keywords: ["indie", "alternative", "melancholic", "low", "lighting", "warm", "not overly polished"],
    reason: "A strong staff-pick move for listeners who like imperfect edges, soft volume, and records that feel lived-in. It adds a modern slowcore lane to the rack."
  },
  {
    title: "Loveless",
    artist: "My Bloody Valentine",
    genre: "Shoegaze",
    area: "Shoegaze Essentials",
    shelfTag: "speaker-wall",
    keywords: ["dream", "pop", "alternative", "cocteau", "high", "reverb", "texture", "headphones"],
    reason: "For dream-pop listeners, this is the thicker, louder wall on the next shelf over. It is a meaningful gap if the collection has shimmer but no shoegaze weight yet."
  }
];

function buildCollectionInsights(preferences: UserPreferences, recommendations: CatalogRecord[]): CollectionInsights {
  const requestedGenres = Array.isArray(preferences.genres) ? preferences.genres : [];
  const query = [
    preferences.artists,
    requestedGenres.join(" "),
    preferences.mood,
    preferences.listeningHabit,
    preferences.customPrompt
  ].join(" ").toLowerCase();
  const recommendedTitles = new Set(recommendations.map((record) => record.title.toLowerCase()));
  const recommendedGenres = new Set(recommendations.map((record) => record.genre.toLowerCase()));
  const requestedGenreHits = requestedGenres.filter((genre) => {
    const normalizedGenre = genre.toLowerCase();
    return recommendedGenres.has(normalizedGenre) || Array.from(recommendedGenres).some((recGenre) => recGenre.includes(normalizedGenre));
  }).length;

  const rankedOpportunities = COLLECTION_OPPORTUNITIES.map((opportunity, index) => {
    const keywordScore = opportunity.keywords.filter((keyword) => query.includes(keyword)).length * 3;
    const genreScore = requestedGenres.some((genre) => opportunity.genre.toLowerCase().includes(genre.toLowerCase())) ? 5 : 0;
    const artistScore = preferences.artists.toLowerCase().includes(opportunity.artist.toLowerCase()) ? -3 : 0;
    const duplicatePenalty = recommendedTitles.has(opportunity.title.toLowerCase()) ? -10 : 0;

    return {
      opportunity,
      score: keywordScore + genreScore + artistScore + duplicatePenalty + (COLLECTION_OPPORTUNITIES.length - index) / 100
    };
  }).sort((a, b) => b.score - a.score);

  const opportunities = rankedOpportunities.slice(0, 5).map(({ opportunity }) => ({
    title: opportunity.title,
    artist: opportunity.artist,
    genre: opportunity.genre,
    shelfTag: opportunity.shelfTag,
    reason: opportunity.reason
  }));

  const explorationAreas = Array.from(new Set(rankedOpportunities.map(({ opportunity }) => opportunity.area))).slice(0, 3);
  const breadthScore = Math.min(24, new Set(requestedGenres).size * 6);
  const matchScore = Math.min(28, requestedGenreHits * 7);
  const habitScore = preferences.listeningHabit ? 12 : 0;
  const artistScore = preferences.artists.split(",").filter((artist) => artist.trim().length > 0).length >= 2 ? 14 : 8;
  const noteScore = preferences.customPrompt && preferences.customPrompt.length > 30 ? 12 : 4;
  const discoveryScore = recommendations.some((record) => record.classification === "Discovery Gem") ? 10 : 4;
  const coverageScore = Math.max(42, Math.min(92, breadthScore + matchScore + habitScore + artistScore + noteScore + discoveryScore));

  const scoreNote = coverageScore >= 78
    ? "A well-started shelf with good taste signals. The next gains come from adding foundation records around the edges."
    : coverageScore >= 62
      ? "A promising shelf with a few clear blanks. Add one classic anchor and one side-door discovery before the next Saturday browse."
      : "A young shelf with plenty of room to grow. Start with one familiar cornerstone, then build outward by mood and listening context.";

  return {
    coverageScore,
    scoreNote,
    opportunities,
    explorationAreas
  };
}

export function buildRecommendations(preferences: UserPreferences): RecommendationResponse {
  const requestedGenres = Array.isArray(preferences.genres) ? preferences.genres : [];
  const query = [
    preferences.artists,
    requestedGenres.join(" "),
    preferences.mood,
    preferences.listeningHabit,
    preferences.customPrompt
  ].join(" ").toLowerCase();

  const ranked = CATALOG.map((record, index) => {
    const haystack = [record.artist, record.genre, record.vibe, record.shelfNote, record.title].join(" ").toLowerCase();
    const genreScore = requestedGenres.some((genre) => haystack.includes(genre.trim().toLowerCase())) ? 4 : 0;
    const artistScore = preferences.artists
      .split(",")
      .some((artist) => artist.trim() && haystack.includes(artist.trim().toLowerCase())) ? 5 : 0;
    const moodScore = query
      .split(/\s+/)
      .filter((word) => word.length > 4 && haystack.includes(word))
      .length;

    return { record, score: genreScore + artistScore + moodScore + (CATALOG.length - index) / 100 };
  }).sort((a, b) => b.score - a.score);

  const familiar = ranked.filter(({ record }) => record.classification === "Familiar Classic").slice(0, 2);
  const discoveries = ranked.filter(({ record }) => record.classification === "Discovery Gem").slice(0, 3);
  const shelfPhrase = requestedGenres.slice(0, 2).join(" and ") || "the late-night listening stack";

  const selectedRecords = [...familiar, ...discoveries].slice(0, 5).map(({ record }) => record);

  return {
    recommendations: selectedRecords.map((record) => ({
      title: record.title,
      artist: record.artist,
      genre: record.genre,
      releaseYear: record.releaseYear,
      classification: record.classification,
      aestheticVibe: record.vibe.split(",").slice(0, 2).join(","),
      tracksToListenTo: record.tracksToListenTo,
      whyThisMatches: `${record.shelfNote}\n\nFor this request, I would file it beside ${shelfPhrase} and cue it up for a ${preferences.mood || "reflective"} room. It gives the customer something recognizable to hold onto while still opening a side door into a deeper shelf.`
    })),
    ownerInsights: {
      trendsSummary: `This customer is clustering around ${requestedGenres.slice(0, 3).join(", ") || "mood-led discovery"} with a ${preferences.mood || "slow-browse"} listening frame. Treat that as a signal for records that feel personal, tactile, and playable in quiet domestic settings.`,
      inventoryOpportunities: "Keep dependable copies of Miles Davis, Radiohead, Phoebe Bridgers, Nick Drake, and Cocteau Twins in view, then deepen the adjacent bins with Portishead, Brian Eno, spiritual jazz, ambient folk, and contemporary psychedelic folk.",
      underrepresentedAreas: "The likely gaps are ambient-adjacent folk, quiet trip-hop, spiritual jazz beyond the obvious classics, and small-label dream pop reissues.",
      merchandisingStrategy: "Chalkcard title: 'Records for Low Light and Good Headphones.' Place one familiar classic beside two discovery records so the table feels welcoming rather than obscure."
    },
    collectionInsights: buildCollectionInsights(preferences, selectedRecords)
  };
}
