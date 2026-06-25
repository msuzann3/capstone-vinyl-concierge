import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export type GenreDemand = { genre: string; count: number; weight: number };
export type ArtistDemand = { artist: string; count: number; weight: number };
export type AlbumDemand = {
  albumId: string;
  title: string;
  artist: string;
  genre: string;
  count: number;
  weight: number;
  requestCount: number;
  interestCount: number;
  likeCount: number;
  dislikeCount: number;
};

export type DemandSummary = {
  topGenres: GenreDemand[];
  topArtists: ArtistDemand[];
  topAlbums: AlbumDemand[];
  sampleSize: number;
};

export async function getDemandSummary(maxSignals = 500): Promise<DemandSummary> {
  const q = query(
    collection(db, "demandSignals"),
    orderBy("createdAt", "desc"),
    limit(maxSignals),
  );
  const snap = await getDocs(q);

  const byGenre = new Map<string, GenreDemand>();
  const byArtist = new Map<string, ArtistDemand>();
  const byAlbum = new Map<string, AlbumDemand>();
  const albumCatalog = new Map<string, { title: string; artist: string; genre: string }>();

  try {
    const albumSnap = await getDocs(collection(db, "albums"));
    albumSnap.forEach((albumDoc) => {
      const album = albumDoc.data() as {
        title?: string;
        artist?: string;
        genres?: string[];
        styles?: string[];
      };
      albumCatalog.set(albumDoc.id, {
        title: album.title ?? "",
        artist: album.artist ?? "",
        genre: album.styles?.[0] ?? album.genres?.[0] ?? "",
      });
    });
  } catch (error) {
    console.warn("Album titles could not be added to the owner demand summary.", error);
  }

  snap.forEach((d) => {
    const s = d.data() as {
      albumId?: string;
      title?: string;
      genre?: string;
      artist?: string;
      signalType?: "rec_request" | "rec_interest" | "rec_like" | "rec_dislike";
      weight?: number;
    };
    const w = s.weight ?? 1;
    const catalogAlbum = s.albumId ? albumCatalog.get(s.albumId) : undefined;
    const artist = s.artist || catalogAlbum?.artist || "";
    const genre = catalogAlbum?.genre || s.genre || "";

    if (genre) {
      const g = byGenre.get(genre) ?? { genre, count: 0, weight: 0 };
      g.count += 1;
      g.weight += w;
      byGenre.set(genre, g);
    }

    if (artist) {
      const a = byArtist.get(artist) ?? { artist, count: 0, weight: 0 };
      a.count += 1;
      a.weight += w;
      byArtist.set(artist, a);
    }

    if (s.albumId && artist) {
      const album = byAlbum.get(s.albumId) ?? {
        albumId: s.albumId,
        title: s.title || catalogAlbum?.title || "Recommended album",
        artist,
        genre: genre || "Uncategorized",
        count: 0,
        weight: 0,
        requestCount: 0,
        interestCount: 0,
        likeCount: 0,
        dislikeCount: 0,
      };
      album.count += 1;
      album.weight += w;
      if (s.signalType === "rec_interest") album.interestCount += 1;
      else if (s.signalType === "rec_like") album.likeCount += 1;
      else if (s.signalType === "rec_dislike") album.dislikeCount += 1;
      else album.requestCount += 1;
      byAlbum.set(s.albumId, album);
    }
  });

  const topGenres = [...byGenre.values()].sort((a, b) => b.weight - a.weight);
  const topArtists = [...byArtist.values()].sort((a, b) => b.weight - a.weight);
  const topAlbums = [...byAlbum.values()]
    .filter((album) => album.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  return { topGenres, topArtists, topAlbums, sampleSize: snap.size };
}
