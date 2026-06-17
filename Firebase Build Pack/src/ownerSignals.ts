// ownerSignals.ts — owner side reads aggregated demand (no customer identities).
// Use this to replace the synthetic owner data with the live loop.
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "./firebase";

export type GenreDemand = { genre: string; count: number; weight: number };

// Aggregate recent demand signals into top-genre / top-artist demand.
// For 100k+ users this should become a scheduled rollup (see CODEX_HANDOFF.md),
// but a direct read is fine at prototype scale.
export async function getDemandSummary(maxSignals = 500) {
  const q = query(
    collection(db, "demandSignals"),
    orderBy("createdAt", "desc"),
    limit(maxSignals),
  );
  const snap = await getDocs(q);

  const byGenre = new Map<string, GenreDemand>();
  const byArtist = new Map<string, { artist: string; count: number; weight: number }>();

  snap.forEach((d) => {
    const s = d.data() as { genre?: string; artist?: string; weight?: number };
    const w = s.weight ?? 1;
    if (s.genre) {
      const g = byGenre.get(s.genre) ?? { genre: s.genre, count: 0, weight: 0 };
      g.count += 1; g.weight += w; byGenre.set(s.genre, g);
    }
    if (s.artist) {
      const a = byArtist.get(s.artist) ?? { artist: s.artist, count: 0, weight: 0 };
      a.count += 1; a.weight += w; byArtist.set(s.artist, a);
    }
  });

  const topGenres = [...byGenre.values()].sort((a, b) => b.weight - a.weight);
  const topArtists = [...byArtist.values()].sort((a, b) => b.weight - a.weight);
  return { topGenres, topArtists, sampleSize: snap.size };
}
