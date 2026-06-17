import "dotenv/config";
import { readFileSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const TOKEN = process.env.DISCOGS_TOKEN;
if (!TOKEN) throw new Error("Missing DISCOGS_TOKEN in .env");

function loadServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  }

  return JSON.parse(readFileSync("./serviceAccount.json", "utf8"));
}

initializeApp({
  credential: cert(loadServiceAccount()),
});

const db = getFirestore();

const SEED = [
  "Miles Davis Kind of Blue",
  "John Coltrane Blue Train",
  "John Coltrane A Love Supreme",
  "Charles Mingus Mingus Ah Um",
  "Bill Evans Trio Waltz For Debby",
  "Herbie Hancock Head Hunters",
  "Weather Report Heavy Weather",
  "Nina Simone Pastel Blues",
  "Ella Fitzgerald Ella And Louis",
  "Thelonious Monk Brilliant Corners",
  "Cannonball Adderley Somethin Else",
  "Alice Coltrane Journey In Satchidananda",
  "Sun Ra Space Is The Place",
  "Kamasi Washington The Epic",
  "Radiohead In Rainbows",
  "Phoebe Bridgers Punisher",
  "Cocteau Twins Heaven or Las Vegas",
  "Nick Drake Pink Moon",
  "Fleetwood Mac Rumours",
  "Dolly Parton Jolene",
  "The Smiths The Queen Is Dead",
  "Sufjan Stevens Illinois",
  "Bon Iver For Emma Forever Ago",
  "Steely Dan Aja",
  "Big Thief Dragon New Warm Mountain I Believe In You",
  "Boygenius The Record",
  "Mitski The Land Is Inhospitable And So Are We",
  "The National High Violet",
  "Wilco Yankee Hotel Foxtrot",
  "Joni Mitchell Blue",
  "Leonard Cohen Songs Of Leonard Cohen",
  "Gillian Welch Time The Revelator",
  "Portishead Dummy",
  "Brian Eno Music For Airports",
  "Mid-Air Thief Crumbling",
  "My Bloody Valentine Loveless",
  "Spiritualized Ladies And Gentlemen We Are Floating In Space",
  "Duster Stratosphere",
  "The Cure Disintegration",
  "New Order Power Corruption And Lies",
  "Talking Heads More Songs About Buildings And Food",
  "David Bowie The Rise And Fall Of Ziggy Stardust",
  "Pink Floyd The Dark Side Of The Moon",
  "The Beatles Abbey Road",
  "The Beach Boys Pet Sounds",
  "The Flying Burrito Brothers The Gilded Palace Of Sin",
  "Jimmy Buffett Equal Strain On All Parts",
  "Led Zeppelin IV",
  "The Rolling Stones Exile On Main St",
  "The Clash London Calling",
  "Patti Smith Horses",
  "Ramones Rocket To Russia",
  "Television Marquee Moon",
  "Black Sabbath Paranoid",
  "Metallica Master Of Puppets",
  "Fugazi Repeater",
  "Nirvana Nevermind",
  "Pixies Doolittle",
  "Sonic Youth Daydream Nation",
  "Bikini Kill Pussy Whipped",
  "Marvin Gaye Whats Going On",
  "Curtis Mayfield Super Fly",
  "Al Green Call Me",
  "Stevie Wonder Innervisions",
  "Aretha Franklin I Never Loved A Man The Way I Love You",
  "Sly And The Family Stone Theres A Riot Goin On",
  "Funkadelic Maggot Brain",
  "Prince Purple Rain",
  "Michael Jackson Off The Wall",
  "Erykah Badu Baduizm",
  "D'Angelo Voodoo",
  "Sade Diamond Life",
  "A Tribe Called Quest The Low End Theory",
  "Nas Illmatic",
  "OutKast Aquemini",
  "The Roots Things Fall Apart",
  "Lauryn Hill The Miseducation Of Lauryn Hill",
  "J Dilla Donuts",
  "Kendrick Lamar To Pimp A Butterfly",
  "Beyonce Lemonade",
  "Taylor Swift Folklore",
  "Harry Styles Harrys House",
  "Kate Bush Hounds Of Love",
  "Bjoerk Homogenic",
  "Daft Punk Discovery",
  "Aphex Twin Selected Ambient Works 85-92",
  "Kraftwerk Trans Europe Express",
  "Boards Of Canada Music Has The Right To Children",
  "Massive Attack Mezzanine",
  "Burial Untrue",
  "LCD Soundsystem Sound Of Silver",
  "Fela Kuti Zombie",
  "Buena Vista Social Club Buena Vista Social Club",
  "Joao Gilberto Chega De Saudade",
  "Caetano Veloso Transa",
  "Milton Nascimento Clube Da Esquina",
  "Bob Marley And The Wailers Exodus",
  "Toots And The Maytals Funky Kingston",
  "Lee Scratch Perry Super Ape",
  "Willie Nelson Red Headed Stranger",
  "Johnny Cash At Folsom Prison",
  "Emmylou Harris Wrecking Ball",
  "Lucinda Williams Car Wheels On A Gravel Road",
  "Kacey Musgraves Golden Hour",
  "Tyler Childers Purgatory",
  "Sturgill Simpson Metamodern Sounds In Country Music",
  "Ryuichi Sakamoto Thousand Knives",
  "Morton Subotnick Silver Apples Of The Moon",
  "Philip Glass Glassworks",
  "Steve Reich Music For 18 Musicians",
  "Arvo Part Tabula Rasa",
];

const HEADERS = {
  "User-Agent": "VinylConcierge/1.0 +https://msuzann3.github.io/capstone-vinyl-concierge/",
  Authorization: `Discogs token=${TOKEN}`,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function searchOne(q) {
  const url = `https://api.discogs.com/database/search?type=release&per_page=1&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) throw new Error(`Discogs ${res.status} for "${q}"`);
  const json = await res.json();
  return json.results?.[0] ?? null;
}

function toAlbum(r) {
  const [artist, ...rest] = (r.title || "").split(" - ");
  return {
    discogsReleaseId: r.id,
    title: (rest.join(" - ") || r.title || "").trim(),
    artist: (artist || "").trim(),
    year: r.year ? Number(r.year) : null,
    genres: r.genre ?? [],
    styles: r.style ?? [],
    moodTags: [],
    contextTags: [],
    thumbUrl: r.cover_image ?? r.thumb ?? null,
    inStock: true,
    stockCount: 6,
    price: 28,
    source: "discogs",
    discogsFetchedAt: FieldValue.serverTimestamp(),
  };
}

for (const q of SEED) {
  try {
    const hit = await searchOne(q);
    if (!hit) {
      console.warn("no result:", q);
      continue;
    }

    const album = toAlbum(hit);
    await db.collection("albums").doc(String(hit.id)).set(album, { merge: true });
    console.log("seeded:", album.artist, "-", album.title);
  } catch (error) {
    console.error(error.message);
  }

  await sleep(1100);
}

console.log(`Done. Attempted ${SEED.length} seed records. Albums cached in Firestore.`);
process.exit(0);
