// sessions.ts — saves a recommendation session AND emits the de-identified
// demand signals that close the customer -> owner loop.
//
// THIS FILE IS THE LOOP. Call saveSessionAndSignals(...) right after the
// recommender produces results in App.tsx.
import {
  collection, addDoc, doc, serverTimestamp, writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";

type Recommendation = {
  albumId: string;
  title: string;
  artist: string;
  type: "familiar" | "discovery";
  matchScore?: number;
};

type SessionInput = {
  artists: string[];
  genres: string[];
  mood: string;
  context?: string;
};

// Rough purchase-intent weight. Discovery picks and explicit genre matches
// signal slightly less intent than a familiar anchor the customer already named.
function intentWeight(rec: Recommendation): number {
  return rec.type === "familiar" ? 1.0 : 0.6;
}

export async function saveSessionAndSignals(
  input: SessionInput,
  recommendations: Recommendation[],
  collectionCoverageScore: number,
) {
  const user = auth.currentUser;
  if (!user) return; // only persist for signed-in customers

  const batch = writeBatch(db);

  // 1) PRIVATE session under the user (owner can never read this).
  const sessionRef = doc(collection(db, "users", user.uid, "sessions"));
  batch.set(sessionRef, {
    input,
    recommendations,
    collectionCoverageScore,
    createdAt: serverTimestamp(),
  });

  // 2) DE-IDENTIFIED demand signals (no uid, no name) the owner side aggregates.
  for (const rec of recommendations) {
    const sigRef = doc(collection(db, "demandSignals"));
    batch.set(sigRef, {
      albumId: rec.albumId,
      artist: rec.artist,
      genre: input.genres[0] ?? null,
      signalType: "rec_request",
      weight: intentWeight(rec),
      createdAt: serverTimestamp(),
      // deliberately NO user id or name here -> privacy-preserving bridge
    });
  }

  await batch.commit();
  return sessionRef.id;
}
