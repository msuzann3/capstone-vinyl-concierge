import { CollectionInsights, RecommendationResponse, UserPreferences } from "./types";
import { collection, doc, getDoc, getDocs, limit, query } from "firebase/firestore";
import { db } from "./firebase";

type Classification = "Familiar Classic" | "Discovery Gem";

interface CatalogRecord {
  albumId?: string;
  title: string;
  artist: string;
  genre: string;
  releaseYear: string;
  classification: Classification;
  vibe: string;
  genreTags: string[];
  moodTags: string[];
  contextTags: string[];
  tracksToListenTo: string[];
  shelfNote: string;
  reviewType?: "staff" | "fit";
}

const CATALOG: CatalogRecord[] = [
  {
    title: "Kind of Blue",
    artist: "Miles Davis",
    genre: "Jazz",
    releaseYear: "1959",
    classification: "Familiar Classic",
    vibe: "late-night jazz masterwork, cool modal progressions",
    genreTags: ["jazz", "modal jazz", "classic jazz"],
    moodTags: ["cool", "reflective", "quiet", "elegant"],
    contextTags: ["late night", "dinner", "rainy evening", "focused listening"],
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
    genreTags: ["alternative", "art rock", "indie rock"],
    moodTags: ["warm", "restless", "intimate", "textural"],
    contextTags: ["headphones", "evening drive", "focused listening", "creative work"],
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
    genreTags: ["indie folk", "singer-songwriter", "alternative"],
    moodTags: ["melancholic", "tender", "haunted", "confessional"],
    contextTags: ["late night", "quiet room", "lyrics-first listening", "solo listening"],
    tracksToListenTo: ["Garden Song", "Chinese Satellite", "I Know the End"],
    shelfNote: "Phoebe writes like she is telling the truth from the next room over. It is intimate without turning precious, and it fits listeners who want something tender, sharp, and a little spectral after midnight."
  },
  {
    title: "Dragon New Warm Mountain I Believe in You",
    artist: "Big Thief",
    genre: "Indie Folk",
    releaseYear: "2022",
    classification: "Familiar Classic",
    vibe: "loose campfire indie, earthy experiments, tender folk-rock",
    genreTags: ["indie", "alternative", "indie folk", "folk rock"],
    moodTags: ["earthy", "tender", "wandering", "warm"],
    contextTags: ["Sunday morning", "road trip", "front porch", "slow browse"],
    tracksToListenTo: ["Simulation Swarm", "Change", "Certainty"],
    shelfNote: "This one feels like the band left the back door open and let the weather play along. It is generous, unruly in the right places, and perfect for someone who wants indie folk with dirt still on its boots."
  },
  {
    title: "The Record",
    artist: "Boygenius",
    genre: "Indie Rock",
    releaseYear: "2023",
    classification: "Familiar Classic",
    vibe: "harmony-rich indie rock, friendship anthems, sharp quiet corners",
    genreTags: ["indie", "alternative", "indie rock", "singer-songwriter"],
    moodTags: ["cathartic", "heartfelt", "bittersweet", "communal"],
    contextTags: ["friend hang", "lyrics-first listening", "car ride", "after work"],
    tracksToListenTo: ["Not Strong Enough", "True Blue", "$20"],
    shelfNote: "A smart pull when a customer wants the feeling of three great songwriters passing the aux cable without losing the plot. It has big sing-along lift, then tucks a quiet line under your ribs."
  },
  {
    title: "The Land Is Inhospitable and So Are We",
    artist: "Mitski",
    genre: "Alternative",
    releaseYear: "2023",
    classification: "Familiar Classic",
    vibe: "cinematic alternative, country shadows, precise heartbreak",
    genreTags: ["alternative", "indie", "art pop", "singer-songwriter"],
    moodTags: ["dramatic", "lonely", "romantic", "aching"],
    contextTags: ["late night", "deep listening", "rainy evening", "solo listening"],
    tracksToListenTo: ["My Love Mine All Mine", "Heaven", "Bug Like an Angel"],
    shelfNote: "Mitski makes a small room feel staged for a full orchestra of feelings. This is the elegant heartbreak pick: spare enough for close listening, dramatic enough to make the walls lean in."
  },
  {
    title: "High Violet",
    artist: "The National",
    genre: "Alternative",
    releaseYear: "2010",
    classification: "Discovery Gem",
    vibe: "baritone indie rock, anxious grandeur, slow-burning drums",
    genreTags: ["alternative", "indie rock", "post-punk", "chamber rock"],
    moodTags: ["brooding", "anxious", "cinematic", "grown-up melancholy"],
    contextTags: ["evening commute", "rainy drive", "headphones", "low light"],
    tracksToListenTo: ["Bloodbuzz Ohio", "Terrible Love", "Conversation 16"],
    shelfNote: "This is the shelf note for customers who want their rock records dressed in a good coat and carrying complicated weather. The drums gather slowly, the voice stays close, and the whole record rewards a second pour."
  },
  {
    title: "Yankee Hotel Foxtrot",
    artist: "Wilco",
    genre: "Alternative Country",
    releaseYear: "2002",
    classification: "Familiar Classic",
    vibe: "weathered Americana, art-rock static, crooked melodies",
    genreTags: ["alternative", "alt-country", "country", "indie rock", "americana"],
    moodTags: ["bittersweet", "restless", "dusty", "curious"],
    contextTags: ["road trip", "weekend morning", "vinyl deep dive", "front room"],
    tracksToListenTo: ["Jesus, Etc.", "I Am Trying to Break Your Heart", "Heavy Metal Drummer"],
    shelfNote: "A wonderful bridge record: rootsy enough to feel handmade, strange enough to keep the needle from getting comfortable. It is ideal for listeners who like a familiar porch with unusual wiring."
  },
  {
    title: "Heaven or Las Vegas",
    artist: "Cocteau Twins",
    genre: "Dream Pop",
    releaseYear: "1990",
    classification: "Discovery Gem",
    vibe: "ethereal guitars, shimmering oceans of sound",
    genreTags: ["dream pop", "alternative", "shoegaze", "post-punk"],
    moodTags: ["ethereal", "romantic", "weightless", "glowing"],
    contextTags: ["headphones", "golden hour", "late night", "wide-speaker listening"],
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
    genreTags: ["folk", "singer-songwriter", "acoustic"],
    moodTags: ["quiet", "melancholic", "intimate", "fragile"],
    contextTags: ["late night", "solo listening", "quiet morning", "close listening"],
    tracksToListenTo: ["Pink Moon", "Place to Be", "Road"],
    shelfNote: "There is almost nowhere for this record to hide. Guitar, voice, a little piano, and that hush that makes a turntable feel like furniture with a memory."
  },
  {
    title: "Blue",
    artist: "Joni Mitchell",
    genre: "Singer-Songwriter",
    releaseYear: "1971",
    classification: "Familiar Classic",
    vibe: "open-hearted songwriting, piano and dulcimer, emotional clarity",
    genreTags: ["singer-songwriter", "folk", "classic folk"],
    moodTags: ["honest", "vulnerable", "bittersweet", "clear-eyed"],
    contextTags: ["morning coffee", "lyrics-first listening", "quiet room", "Sunday reset"],
    tracksToListenTo: ["A Case of You", "River", "California"],
    shelfNote: "If the customer is building a shelf around words that land cleanly, start here. Joni makes the room feel honest without making it heavy, and every side sounds like a letter you were meant to find."
  },
  {
    title: "Songs of Leonard Cohen",
    artist: "Leonard Cohen",
    genre: "Singer-Songwriter",
    releaseYear: "1967",
    classification: "Familiar Classic",
    vibe: "spare poetic folk, candlelit baritone, devotional shadows",
    genreTags: ["singer-songwriter", "folk", "poetic folk"],
    moodTags: ["introspective", "somber", "romantic", "literary"],
    contextTags: ["late night", "reading", "quiet room", "winter evening"],
    tracksToListenTo: ["Suzanne", "So Long, Marianne", "Sisters of Mercy"],
    shelfNote: "This is for the listener who wants the lyric sheet to matter. Cohen keeps the arrangements spare enough that every line has its own chair in the room."
  },
  {
    title: "Time (The Revelator)",
    artist: "Gillian Welch",
    genre: "Americana",
    releaseYear: "2001",
    classification: "Discovery Gem",
    vibe: "old-soul Americana, close harmonies, patient acoustic space",
    genreTags: ["singer-songwriter", "country", "americana", "folk", "country folk"],
    moodTags: ["plainspoken", "haunting", "patient", "earthy"],
    contextTags: ["front porch", "morning coffee", "road trip", "quiet evening"],
    tracksToListenTo: ["Revelator", "My First Lover", "Everything Is Free"],
    shelfNote: "A beautiful slow-burn recommendation for customers who do not need the record to hurry. The harmonies sit close, the guitars are dry and true, and the whole thing feels cut from old wood."
  },
  {
    title: "Jolene",
    artist: "Dolly Parton",
    genre: "Country",
    releaseYear: "1974",
    classification: "Familiar Classic",
    vibe: "crystalline country songwriting, mountain ache, direct storytelling",
    genreTags: ["country", "classic country", "country pop", "singer-songwriter"],
    moodTags: ["heartfelt", "plainspoken", "melancholic", "warm"],
    contextTags: ["morning coffee", "road trip", "lyrics-first listening", "front porch"],
    tracksToListenTo: ["Jolene", "I Will Always Love You", "Early Morning Breeze"],
    shelfNote: "Dolly is the country pull that works for almost anyone who cares about the song first. The voice is bright enough to light the room, but the writing keeps both feet on the floor."
  },
  {
    title: "Dummy",
    artist: "Portishead",
    genre: "Trip-Hop",
    releaseYear: "1994",
    classification: "Discovery Gem",
    vibe: "dusty samples, tense vocals, cinematic atmosphere",
    genreTags: ["trip-hop", "alternative", "electronic", "downtempo"],
    moodTags: ["smoky", "uneasy", "cinematic", "moody"],
    contextTags: ["late night", "low light", "headphones", "after hours"],
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
    genreTags: ["jazz", "spiritual jazz", "modal jazz"],
    moodTags: ["transcendent", "serious", "searching", "emotional"],
    contextTags: ["deep listening", "late night", "reflection", "focused listening"],
    tracksToListenTo: ["Acknowledgement", "Resolution", "Psalm"],
    shelfNote: "A serious record, but not a stiff one. Coltrane turns devotion into motion, and it belongs near anyone who says jazz, reflection, or emotional lift in the same breath."
  },
  {
    title: "Mingus Ah Um",
    artist: "Charles Mingus",
    genre: "Jazz",
    releaseYear: "1959",
    classification: "Familiar Classic",
    vibe: "bluesy hard bop, rowdy elegance, ensemble fire",
    genreTags: ["jazz", "hard bop", "post-bop", "blues"],
    moodTags: ["bold", "swinging", "playful", "alive"],
    contextTags: ["dinner party", "Saturday afternoon", "shop-floor energy", "speaker listening"],
    tracksToListenTo: ["Goodbye Pork Pie Hat", "Better Git It in Your Soul", "Fables of Faubus"],
    shelfNote: "Mingus is the jazz pull when the room needs personality, not wallpaper. It swings, argues, laughs, and still leaves you with one of the most beautiful ballads in the bin."
  },
  {
    title: "Waltz for Debby",
    artist: "Bill Evans Trio",
    genre: "Jazz",
    releaseYear: "1962",
    classification: "Discovery Gem",
    vibe: "lyrical piano trio, live-room intimacy, soft-focus swing",
    genreTags: ["jazz", "piano jazz", "cool jazz"],
    moodTags: ["gentle", "intimate", "reflective", "graceful"],
    contextTags: ["morning coffee", "dinner", "rainy evening", "quiet work"],
    tracksToListenTo: ["My Foolish Heart", "Waltz for Debby", "Detour Ahead"],
    shelfNote: "A perfect recommendation when someone says jazz but means a small table, low conversation, and a little glow from the corner lamp. Bill Evans makes the piano feel like it is thinking out loud."
  },
  {
    title: "Heavy Weather",
    artist: "Weather Report",
    genre: "Jazz Fusion",
    releaseYear: "1977",
    classification: "Discovery Gem",
    vibe: "electric fusion, bass-forward motion, bright studio color",
    genreTags: ["jazz", "jazz fusion", "funk", "electric jazz"],
    moodTags: ["energetic", "colorful", "slick", "adventurous"],
    contextTags: ["weekend drive", "shop-floor energy", "upbeat afternoon", "speaker demo"],
    tracksToListenTo: ["Birdland", "Teen Town", "A Remark You Made"],
    shelfNote: "This is the turn toward jazz with chrome on it. Put it in front of the listener who likes virtuosity, bass lines with a grin, and records that make the shop speakers wake up."
  },
  {
    title: "Head Hunters",
    artist: "Herbie Hancock",
    genre: "Jazz Funk",
    releaseYear: "1973",
    classification: "Familiar Classic",
    vibe: "deep electric groove, jazz-funk pocket, synth swagger",
    genreTags: ["jazz", "jazz funk", "funk", "fusion"],
    moodTags: ["groovy", "confident", "rhythmic", "electric"],
    contextTags: ["party", "weekend afternoon", "crate digging", "speaker demo"],
    tracksToListenTo: ["Chameleon", "Watermelon Man", "Sly"],
    shelfNote: "For anyone who asks whether jazz can move furniture, this is the answer. It keeps the musicianship high and the groove low to the ground."
  },
  {
    title: "Rumours",
    artist: "Fleetwood Mac",
    genre: "Classic Rock",
    releaseYear: "1977",
    classification: "Familiar Classic",
    vibe: "polished classic rock, heartbreak harmonies, evergreen hooks",
    genreTags: ["classic rock", "soft rock", "pop rock"],
    moodTags: ["bittersweet", "warm", "familiar", "singable"],
    contextTags: ["road trip", "dinner party", "weekend cleaning", "first turntable"],
    tracksToListenTo: ["Dreams", "Go Your Own Way", "The Chain"],
    shelfNote: "A familiar classic earns that title by working in almost every room. The harmonies are bright, the feelings are messy, and the hooks still know exactly where to sit."
  },
  {
    title: "The Rise and Fall of Ziggy Stardust and the Spiders from Mars",
    artist: "David Bowie",
    genre: "Glam Rock",
    releaseYear: "1972",
    classification: "Familiar Classic",
    vibe: "glam-rock theater, sharp guitars, cosmic hooks",
    genreTags: ["classic rock", "glam rock", "art rock"],
    moodTags: ["theatrical", "bold", "stylish", "electric"],
    contextTags: ["pre-party", "speaker listening", "weekend night", "collector essential"],
    tracksToListenTo: ["Starman", "Moonage Daydream", "Suffragette City"],
    shelfNote: "Bowie is the staff-pick answer when someone wants classic rock with a little glitter on the jacket. It is dramatic without getting bloated and still feels like a transmission from a better-dressed planet."
  },
  {
    title: "The Dark Side of the Moon",
    artist: "Pink Floyd",
    genre: "Classic Rock",
    releaseYear: "1973",
    classification: "Familiar Classic",
    vibe: "hi-fi classic rock, seamless sides, cosmic studio craft",
    genreTags: ["classic rock", "progressive rock", "psychedelic rock"],
    moodTags: ["immersive", "cosmic", "contemplative", "polished"],
    contextTags: ["headphones", "speaker demo", "late night", "full-album listen"],
    tracksToListenTo: ["Time", "Us and Them", "Money"],
    shelfNote: "Still the cleanest answer for a customer testing the whole room: clocks, voices, bass, and a side that wants to be heard in one sitting. Familiar, yes, but familiar for a reason."
  },
  {
    title: "Aja",
    artist: "Steely Dan",
    genre: "Jazz Rock",
    releaseYear: "1977",
    classification: "Discovery Gem",
    vibe: "immaculate studio sheen, jazz-rock precision, sly sophistication",
    genreTags: ["classic rock", "jazz rock", "soft rock", "audiophile"],
    moodTags: ["smooth", "sophisticated", "precise", "late-summer"],
    contextTags: ["dinner party", "speaker demo", "cocktail hour", "focused listening"],
    tracksToListenTo: ["Deacon Blues", "Peg", "Aja"],
    shelfNote: "Aja is for the listener who notices the drum sound and the cut of the jacket. It is polished to a mirror shine, but there is enough mischief under the hood to keep it from behaving too politely."
  },
  {
    title: "More Songs About Buildings and Food",
    artist: "Talking Heads",
    genre: "New Wave",
    releaseYear: "1978",
    classification: "Discovery Gem",
    vibe: "nervy new wave, art-school rhythm, bright angles",
    genreTags: ["classic rock", "new wave", "post-punk", "art rock"],
    moodTags: ["quirky", "upbeat", "wired", "clever"],
    contextTags: ["party", "shop-floor energy", "cooking", "weekend afternoon"],
    tracksToListenTo: ["Take Me to the River", "Found a Job", "The Good Thing"],
    shelfNote: "This is the classic-rock side door for someone who wants rhythm, wit, and a little angular furniture in the room. It is friendly on the surface and wonderfully odd underneath."
  },
  {
    title: "Pet Sounds",
    artist: "The Beach Boys",
    genre: "Baroque Pop",
    releaseYear: "1966",
    classification: "Familiar Classic",
    vibe: "sunlit harmonies, studio-pop invention, tender coming-of-age ache",
    genreTags: ["classic rock", "baroque pop", "sunshine pop", "psychedelic pop"],
    moodTags: ["nostalgic", "tender", "bittersweet", "sunny"],
    contextTags: ["Sunday morning", "first turntable", "full-album listen", "golden hour"],
    tracksToListenTo: ["Wouldn't It Be Nice", "God Only Knows", "I Just Wasn't Made for These Times"],
    shelfNote: "Pet Sounds is the familiar classic that still feels handmade every time the needle drops. It has sunshine on the sleeve and a complicated little heart underneath, which makes it perfect for customers who want beauty with real ache inside it."
  },
  {
    title: "Abbey Road",
    artist: "The Beatles",
    genre: "Classic Rock",
    releaseYear: "1969",
    classification: "Familiar Classic",
    vibe: "polished late-period Beatles, melodic craft, side-two studio magic",
    genreTags: ["classic rock", "pop rock", "psychedelic rock", "british invasion"],
    moodTags: ["timeless", "warm", "melodic", "polished"],
    contextTags: ["first turntable", "family listening", "full-album listen", "weekend morning"],
    tracksToListenTo: ["Come Together", "Something", "Here Comes the Sun"],
    shelfNote: "Abbey Road is the Beatles pull when the customer wants the famous name and the record still has to earn the space. The songs are immediate, the studio craft is gleaming, and Side Two makes a very good case for listening all the way through."
  },
  {
    title: "The Gilded Palace of Sin",
    artist: "The Flying Burrito Brothers",
    genre: "Country Rock",
    releaseYear: "1969",
    classification: "Discovery Gem",
    vibe: "cosmic country rock, pedal steel ache, dusty harmonies",
    genreTags: ["country", "country rock", "classic rock", "americana"],
    moodTags: ["dusty", "bittersweet", "loose", "warm"],
    contextTags: ["road trip", "front porch", "weekend afternoon", "crate digging"],
    tracksToListenTo: ["Christine's Tune", "Sin City", "Hot Burrito #1"],
    shelfNote: "This is the side-door country pick for rock listeners and the side-door rock pick for country listeners. The pedal steel bends the light, the harmonies stay dusty, and the whole record feels pulled from a well-loved jacket."
  },
  {
    title: "Equal Strain on All Parts",
    artist: "Jimmy Buffett",
    genre: "Gulf & Western",
    releaseYear: "2023",
    classification: "Discovery Gem",
    vibe: "salt-air country rock, easygoing stories, late-career warmth",
    genreTags: ["classic rock", "country", "country rock", "americana", "trop rock"],
    moodTags: ["relaxed", "breezy", "warm", "reflective"],
    contextTags: ["road trip", "weekend afternoon", "porch listening", "vacation mood"],
    tracksToListenTo: ["Bubbles Up", "My Gummie Just Kicked In", "Like My Dog"],
    shelfNote: "This is the sunny left-field pull for someone who wants the room to loosen its shoulders. Buffett keeps the edges easy, but there is a sweet late-career reflection here that makes it more than a novelty-bin wink."
  },
  {
    title: "Harry's House",
    artist: "Harry Styles",
    genre: "Pop",
    releaseYear: "2022",
    classification: "Discovery Gem",
    vibe: "sleek modern pop, soft-rock polish, bright domestic grooves",
    genreTags: ["pop", "soft rock", "modern pop", "dance pop"],
    moodTags: ["sunny", "romantic", "breezy", "playful"],
    contextTags: ["dinner party", "weekend afternoon", "car ride", "casual hang"],
    tracksToListenTo: ["As It Was", "Late Night Talking", "Music for a Sushi Restaurant"],
    shelfNote: "This is a friendly modern-pop bridge for customers who want hooks without giving up a little taste. It is bright, clean, and easy to put on when the room needs charm before anyone has overthought the playlist."
  },
  {
    title: "Folklore",
    artist: "Taylor Swift",
    genre: "Singer-Songwriter",
    releaseYear: "2020",
    classification: "Familiar Classic",
    vibe: "indie-leaning storytelling, hushed production, autumnal pop craft",
    genreTags: ["pop", "singer-songwriter", "indie folk", "alternative"],
    moodTags: ["intimate", "autumnal", "wistful", "literary"],
    contextTags: ["lyrics-first listening", "rainy evening", "quiet room", "solo listening"],
    tracksToListenTo: ["Cardigan", "Exile", "The Last Great American Dynasty"],
    shelfNote: "Folklore is the Taylor record for the customer who wants the writing right up front. It trades stadium shine for lamplight, keeps the melodies close, and slips neatly beside modern indie folk without losing the pop instinct."
  },
  {
    title: "What's Going On",
    artist: "Marvin Gaye",
    genre: "Soul",
    releaseYear: "1971",
    classification: "Familiar Classic",
    vibe: "socially conscious soul, velvet vocals, flowing suite",
    genreTags: ["soul", "r&b", "classic soul"],
    moodTags: ["compassionate", "lush", "reflective", "hopeful"],
    contextTags: ["Sunday morning", "dinner", "full-album listen", "quiet reflection"],
    tracksToListenTo: ["What's Going On", "Mercy Mercy Me", "Inner City Blues"],
    shelfNote: "A cornerstone soul record that moves like one long conversation. Marvin keeps it beautiful without sanding off the ache, which makes it essential for customers who want warmth with a conscience."
  },
  {
    title: "Super Fly",
    artist: "Curtis Mayfield",
    genre: "Soul",
    releaseYear: "1972",
    classification: "Discovery Gem",
    vibe: "cinematic soul, streetwise falsetto, deep pocket funk",
    genreTags: ["soul", "r&b", "funk", "soundtrack"],
    moodTags: ["cool", "gritty", "sleek", "streetwise"],
    contextTags: ["evening drive", "party", "crate digging", "speaker listening"],
    tracksToListenTo: ["Pusherman", "Freddie's Dead", "Superfly"],
    shelfNote: "Curtis brings a whole film into the bins: strings, congas, falsetto, and a groove that knows more than it says. A great pick when soul needs a little smoke and motion."
  },
  {
    title: "Call Me",
    artist: "Al Green",
    genre: "Soul",
    releaseYear: "1973",
    classification: "Familiar Classic",
    vibe: "silky Memphis soul, intimate vocals, warm organ glow",
    genreTags: ["soul", "r&b", "Memphis soul"],
    moodTags: ["romantic", "warm", "smooth", "tender"],
    contextTags: ["dinner", "date night", "Sunday morning", "slow evening"],
    tracksToListenTo: ["Call Me", "Here I Am", "You Ought to Be with Me"],
    shelfNote: "Al Green is the reliable recommendation when the customer wants the lights lower and the room kinder. The voice floats, the band never overplays, and the whole record knows how to lean close."
  },
  {
    title: "Illinois",
    artist: "Sufjan Stevens",
    genre: "Indie Folk",
    releaseYear: "2005",
    classification: "Discovery Gem",
    vibe: "orchestral indie folk, literary, generous",
    genreTags: ["indie folk", "baroque pop", "singer-songwriter"],
    moodTags: ["literary", "generous", "melancholic", "ornate"],
    contextTags: ["deep listening", "Sunday morning", "reading", "lyrics-first listening"],
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
    genreTags: ["ambient", "electronic", "minimalism"],
    moodTags: ["calm", "spacious", "patient", "weightless"],
    contextTags: ["reading", "background listening", "focused work", "quiet morning"],
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
    genreTags: ["psychedelic folk", "indie", "electronic", "experimental"],
    moodTags: ["glowing", "restless", "curious", "warm"],
    contextTags: ["headphones", "late night", "discovery shelf", "creative work"],
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

type FirestoreAlbum = {
  title?: string;
  artist?: string;
  year?: number | string | null;
  releaseYear?: number | string | null;
  genre?: string;
  genres?: string[];
  styles?: string[];
  moodTags?: string[];
  contextTags?: string[];
  thumbUrl?: string | null;
  inStock?: boolean;
};

const RECOMMENDATION_LIMIT = 5;
const FIRESTORE_CATALOG_READ_LIMIT = 300;
const MIN_PERSONALIZED_SCORE = 4;
const BROAD_ANCHOR_TERMS = new Set(["rock", "pop", "electronic", "jazz", "folk, world, & country", "folk"]);
const BROAD_DISPLAY_GENRES = new Set(["rock", "pop", "electronic", "folk, world, & country"]);

function normalizeTerm(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeTokens(value: string): string[] {
  return normalizeTerm(value)
    .split(/[^a-z0-9&/]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 3);
}

function parseArtistList(value: string): string[] {
  return value
    .split(",")
    .map(normalizeTerm)
    .filter(Boolean);
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function getFallbackJitter(preferences: UserPreferences, record: CatalogRecord): number {
  const preferenceSeed = [
    preferences.artists,
    preferences.genres.join("|"),
    preferences.mood,
    preferences.listeningHabit,
    preferences.customPrompt,
  ].join("::");
  const recordSeed = `${record.artist}::${record.title}`;

  return (stableHash(`${preferenceSeed}::${recordSeed}`) / 0xffffffff) * 0.25;
}

function expandGenreTerms(genre: string): string[] {
  const normalized = normalizeTerm(genre);
  if (!normalized) return [];

  const expanded = new Set([normalized]);
  if (normalized === "country") {
    expanded.add("folk, world, & country");
    expanded.add("country rock");
    expanded.add("country pop");
    expanded.add("americana");
    expanded.add("folk rock");
  }
  if (normalized === "indie folk") {
    expanded.add("indie rock");
    expanded.add("folk rock");
    expanded.add("acoustic");
    expanded.add("singer-songwriter");
  }
  if (normalized === "classic rock") {
    expanded.add("rock & roll");
    expanded.add("pop rock");
    expanded.add("folk rock");
    expanded.add("soft rock");
  }
  if (normalized === "pop / top 40") {
    expanded.add("pop");
    expanded.add("top 40");
    expanded.add("modern pop");
    expanded.add("dance pop");
    expanded.add("contemporary r&b");
    expanded.add("pop rock");
  }
  if (normalized === "ambient") {
    expanded.add("ambient / drone");
    expanded.add("drone");
    expanded.add("minimalism");
    expanded.add("electronic");
  }
  if (normalized === "soul / funk") {
    expanded.add("soul");
    expanded.add("funk");
    expanded.add("r&b");
    expanded.add("funk / soul");
    expanded.add("neo soul");
  }
  if (normalized === "hip-hop") {
    expanded.add("hip hop");
    expanded.add("rap");
    expanded.add("conscious hip hop");
    expanded.add("r&b");
  }

  return Array.from(expanded);
}

function normalizeList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function fieldMatchesTerm(fields: string[], term: string): boolean {
  const normalizedTerm = normalizeTerm(term);
  if (!normalizedTerm) return false;

  return fields.some((field) => {
    const normalizedField = normalizeTerm(field);
    return normalizedField === normalizedTerm ||
      normalizedField.includes(normalizedTerm) ||
      normalizedTerm.includes(normalizedField);
  });
}

function inferClassification(index: number): Classification {
  return index < 2 ? "Familiar Classic" : "Discovery Gem";
}

function findCuratedCatalogRecord(album: FirestoreAlbum): CatalogRecord | undefined {
  const title = album.title?.toLowerCase();
  const artist = album.artist?.toLowerCase();
  if (!title || !artist) return undefined;

  return CATALOG.find((record) =>
    record.title.toLowerCase() === title &&
    artist.includes(record.artist.toLowerCase())
  );
}

function chooseDisplayGenre(genres: string[], styles: string[], fallback?: string): string {
  const candidates = [fallback, ...styles, ...genres].filter((item): item is string => Boolean(item));
  return candidates.find((item) => !BROAD_DISPLAY_GENRES.has(item.toLowerCase())) || candidates[0] || "Staff Pick";
}

function buildAestheticVibe(primaryGenre: string, tags: string[]): string {
  const usefulTags = Array.from(new Set([primaryGenre, ...tags]))
    .filter((tag) => !BROAD_DISPLAY_GENRES.has(tag.toLowerCase()))
    .slice(0, 3);

  return usefulTags.length > 0 ? usefulTags.join(", ") : `${primaryGenre} shelf discovery`;
}

function buildTrackCues(primaryGenre: string): string[] {
  return [
    "Start with the opening side",
    `Listen for the ${primaryGenre.toLowerCase()} texture`,
    "Compare it with the next shelf over"
  ];
}

function buildLiveShelfNote(album: FirestoreAlbum, primaryGenre: string, tags: string[]): string {
  const vibe = buildAestheticVibe(primaryGenre, tags).split(", ")[0]?.toLowerCase() || primaryGenre.toLowerCase();

  return `${album.title} lands in that useful space between a familiar bin pull and a small discovery. ${album.artist} keeps the record close to ${primaryGenre.toLowerCase()}, but there is enough ${vibe} texture around the edges to make it feel like more than the obvious answer.`;
}

function buildFitContext(preferences: UserPreferences, shelfPhrase: string): string {
  const placement = shelfPhrase
    ? `near the ${shelfPhrase} shelves`
    : preferences.artists
      ? "alongside records connected to the artists you named"
      : "with the nearby staff picks";

  if (!preferences.mood) {
    return `For this listener, I would place it ${placement}.`;
  }

  return `For this listener, I would place it ${placement} and try it during ${preferences.mood.charAt(0).toLowerCase() + preferences.mood.slice(1)}.`;
}

function toCatalogRecord(id: string, album: FirestoreAlbum, index: number): CatalogRecord | null {
  if (!album.title || !album.artist) return null;

  const curatedRecord = findCuratedCatalogRecord(album);
  const genres = normalizeList(album.genres);
  const styles = normalizeList(album.styles);
  const moodTags = normalizeList(album.moodTags);
  const contextTags = normalizeList(album.contextTags);
  const primaryGenre = curatedRecord?.genre || chooseDisplayGenre(genres, styles, album.genre);
  const releaseYear = String(album.releaseYear ?? album.year ?? "TBD");
  const searchTags = [...genres, ...styles, ...(curatedRecord?.genreTags ?? []), primaryGenre].filter(Boolean);
  const aestheticVibe = curatedRecord?.vibe || buildAestheticVibe(primaryGenre, searchTags);

  return {
    albumId: id,
    title: album.title,
    artist: album.artist,
    genre: primaryGenre,
    releaseYear,
    classification: curatedRecord?.classification || inferClassification(index),
    vibe: aestheticVibe,
    genreTags: searchTags,
    moodTags: [...moodTags, ...(curatedRecord?.moodTags ?? [])],
    contextTags: [...contextTags, ...(curatedRecord?.contextTags ?? [])],
    tracksToListenTo: curatedRecord?.tracksToListenTo || buildTrackCues(primaryGenre),
    shelfNote: curatedRecord?.shelfNote || buildLiveShelfNote(album, primaryGenre, searchTags),
    reviewType: curatedRecord ? "staff" : "fit",
  };
}

async function getRecommendationsEnabled(): Promise<boolean> {
  try {
    const snap = await getDoc(doc(db, "config", "system"));
    if (!snap.exists()) return true;
    return snap.data().recommendationsEnabled !== false;
  } catch (error) {
    console.warn("Using local recommendation fallback; config read failed.", error);
    return true;
  }
}

async function getFirestoreCatalog(): Promise<CatalogRecord[]> {
  try {
    const snap = await getDocs(query(collection(db, "albums"), limit(FIRESTORE_CATALOG_READ_LIMIT)));
    return snap.docs
      .map((albumDoc, index) => toCatalogRecord(albumDoc.id, albumDoc.data() as FirestoreAlbum, index))
      .filter((record): record is CatalogRecord => Boolean(record));
  } catch (error) {
    console.warn("Using local recommendation fallback; catalog read failed.", error);
    return [];
  }
}

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

function buildRecommendationsFromCatalog(
  preferences: UserPreferences,
  activeCatalog: CatalogRecord[],
  recommendationsEnabled: boolean,
): RecommendationResponse {
  const requestedGenres = Array.isArray(preferences.genres) ? preferences.genres : [];
  const requestedArtists = parseArtistList(preferences.artists);
  const contextQuery = [
    preferences.mood,
    preferences.listeningHabit,
    preferences.customPrompt
  ].join(" ").toLowerCase();
  const artistAnchorTerms = new Set(
    activeCatalog
      .filter((record) => requestedArtists.some((artist) => record.artist.toLowerCase().includes(artist)))
      .flatMap((record) => [record.genre, ...record.genreTags])
      .map(normalizeTerm)
      .filter((term) => term && !BROAD_ANCHOR_TERMS.has(term))
  );

  const ranked = activeCatalog.map((record) => {
    const recordArtist = record.artist.toLowerCase();
    const recordTitle = record.title.toLowerCase();
    const genreFields = [record.genre, ...record.genreTags];
    const contextFields = [...record.moodTags, ...record.contextTags, record.vibe];
    const genreScore = requestedGenres.reduce((score, genre) => {
      const terms = expandGenreTerms(genre);
      const directHit = fieldMatchesTerm(genreFields, genre);
      const adjacentHits = terms
        .filter((term) => term !== normalizeTerm(genre) && fieldMatchesTerm(genreFields, term))
        .length;
      return score + (directHit ? 5 : 0) + Math.min(adjacentHits * 2, 4);
    }, 0);
    const directArtistScore = requestedArtists.some((artist) => recordArtist.includes(artist)) ? 12 : 0;
    const falseArtistTitlePenalty = requestedArtists.some((artist) =>
      recordTitle.includes(artist) && !recordArtist.includes(artist)
    ) ? -10 : 0;
    const artistAnchorScore = Array.from(artistAnchorTerms)
      .filter((term) => fieldMatchesTerm(genreFields, term))
      .slice(0, 4)
      .length * 2;
    const moodScore = normalizeTokens(contextQuery)
      .filter((word) => fieldMatchesTerm(contextFields, word))
      .length;
    const score = genreScore +
      directArtistScore +
      artistAnchorScore +
      moodScore +
      falseArtistTitlePenalty +
      getFallbackJitter(preferences, record);

    const confidence: "exact" | "adjacent" | "low" = directArtistScore > 0
      ? "exact"
      : score >= MIN_PERSONALIZED_SCORE && (genreScore >= 5 || artistAnchorScore > 0 || moodScore >= 2)
        ? "adjacent"
        : "low";
    const matchLabel = confidence === "exact"
      ? "Exact artist match in prototype catalog"
      : confidence === "adjacent"
        ? "Adjacent match from genre and listening context"
        : "Loose prototype match from limited catalog";

    return {
      record,
      score,
      confidence,
      matchLabel,
      isPersonalized: score >= MIN_PERSONALIZED_SCORE,
    };
  }).sort((a, b) => b.score - a.score);

  const personalizedMatches = ranked.filter((item) => item.isPersonalized);
  const fallbackMatches = ranked
    .filter((item) => !item.isPersonalized)
    .map((item) => ({
      ...item,
      matchLabel: recommendationsEnabled
        ? "Staff fallback from limited prototype catalog"
        : "Staff pick while personalized ranking is paused",
    }));
  const rankedSelection = recommendationsEnabled
    ? [...personalizedMatches, ...fallbackMatches]
    : fallbackMatches;
  const shelfPhrase = requestedGenres.slice(0, 2).join(" and ");

  const selectedRecords = rankedSelection.slice(0, RECOMMENDATION_LIMIT);

  return {
    recommendations: selectedRecords.map(({ record, score, confidence, matchLabel, isPersonalized }) => ({
      albumId: record.albumId ?? `${record.artist}-${record.title}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: record.title,
      artist: record.artist,
      genre: record.genre,
      releaseYear: record.releaseYear,
      classification: record.classification,
      matchScore: score,
      aestheticVibe: record.vibe.split(",").slice(0, 2).join(","),
      tracksToListenTo: record.tracksToListenTo,
      reviewType: record.reviewType || "staff",
      matchConfidence: confidence,
      matchLabel,
      whyThisMatches: recommendationsEnabled
        ? `${record.shelfNote}\n\n${isPersonalized ? buildFitContext(preferences, shelfPhrase) : "The prototype catalog did not find a strong structured match here, so treat this as a staff fallback rather than a personalized ranking."}`
        : `${record.shelfNote}\n\nThe recommendation kill switch is off, so this is a staff-pick shelf pull rather than a personalized ranking.`
    })),
    ownerInsights: {
      trendsSummary: recommendationsEnabled
        ? `This customer is clustering around ${requestedGenres.slice(0, 3).join(", ") || "mood-led discovery"} with a ${preferences.mood || "slow-browse"} listening frame. Treat that as a signal for records that feel personal, tactile, and playable in quiet domestic settings.`
        : "Recommendations are paused by the Firestore config kill switch, so this session should be treated as a staff-pick browse rather than an AI-ranked demand signal.",
      inventoryOpportunities: "Keep dependable copies of Miles Davis, Radiohead, Phoebe Bridgers, Nick Drake, Dolly Parton, Fleetwood Mac, and Cocteau Twins in view, then deepen the adjacent bins with classic country, country rock, spiritual jazz, ambient folk, and contemporary psychedelic folk.",
      underrepresentedAreas: "The likely gaps are country foundations, classic-rock side-door discoveries, spiritual jazz beyond the obvious classics, and small-label dream pop reissues.",
      merchandisingStrategy: "Chalkcard title: 'Records for Low Light and Good Headphones.' Place one familiar classic beside two discovery records so the table feels welcoming rather than obscure."
    },
    collectionInsights: buildCollectionInsights(preferences, selectedRecords.map(({ record }) => record))
  };
}

export async function buildRecommendations(preferences: UserPreferences): Promise<RecommendationResponse> {
  try {
    const recommendationsEnabled = await getRecommendationsEnabled();
    const liveCatalog = recommendationsEnabled ? await getFirestoreCatalog() : [];
    const activeCatalog = liveCatalog.length > 0 ? liveCatalog : CATALOG;
    return buildRecommendationsFromCatalog(preferences, activeCatalog, recommendationsEnabled);
  } catch (error) {
    console.warn("Using local recommendation fallback; recommendation build failed.", error);
    return buildRecommendationsFromCatalog(preferences, CATALOG, true);
  }
}
