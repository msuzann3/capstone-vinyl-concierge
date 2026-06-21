import { collection, doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { auth, db } from "./firebase";

export type RecommendationAction = "interest" | "like" | "dislike";

type SavedRecommendation = {
  albumId: string;
  title: string;
  artist: string;
  type: "familiar" | "discovery";
  matchScore?: number;
};

type SavedSessionInput = {
  artists: string[];
  genres: string[];
  mood: string;
  context?: string;
};

function intentWeight(rec: SavedRecommendation): number {
  return rec.type === "familiar" ? 1 : 0.6;
}

export async function saveSessionAndSignals(
  input: SavedSessionInput,
  recommendations: SavedRecommendation[],
  collectionCoverageScore: number,
) {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const batch = writeBatch(db);
    const sessionRef = doc(collection(db, "users", user.uid, "sessions"));

    batch.set(sessionRef, {
      input,
      recommendations,
      collectionCoverageScore,
      createdAt: serverTimestamp(),
    });

    for (const rec of recommendations) {
      const sigRef = doc(collection(db, "demandSignals"));
      batch.set(sigRef, {
        albumId: rec.albumId,
        artist: rec.artist,
        genre: input.genres[0] ?? null,
        signalType: "rec_request",
        weight: intentWeight(rec),
        createdAt: serverTimestamp(),
      });
    }

    await batch.commit();
    return sessionRef.id;
  } catch (error) {
    console.warn("Session was not saved; recommendations can still display.", error);
    return null;
  }
}

export async function saveRecommendationAction(action: {
  albumId: string;
  title: string;
  artist: string;
  action: RecommendationAction;
}) {
  try {
    const user = auth.currentUser;
    if (!user) return null;

    const batch = writeBatch(db);
    const actionRef = doc(collection(db, "users", user.uid, "recommendationActions"));

    batch.set(actionRef, {
      albumId: action.albumId,
      title: action.title,
      artist: action.artist,
      action: action.action,
      createdAt: serverTimestamp(),
    });

    await batch.commit();
    return actionRef.id;
  } catch (error) {
    console.warn("Recommendation action was not saved; local UI state can still display.", error);
    return null;
  }
}
