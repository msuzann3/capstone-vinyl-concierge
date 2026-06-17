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

console.log("Done. Albums cached in Firestore.");
process.exit(0);
