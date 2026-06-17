// auth.ts — sign-in helpers + first-login profile creation.
import {
  signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider } from "./firebase";

// Create the users/{uid} profile on first sign-in. Default role = "customer".
// The "owner" role is granted out-of-band (see CODEX_HANDOFF.md); it is never self-assigned here.
async function ensureUserDoc(user: User) {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      email: user.email ?? null,
      displayName: user.displayName ?? null,
      photoURL: user.photoURL ?? null,
      role: "customer",
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    });
  } else {
    await setDoc(ref, { lastActiveAt: serverTimestamp() }, { merge: true });
  }
}

export async function signInWithGoogle() {
  const { user } = await signInWithPopup(auth, googleProvider);
  await ensureUserDoc(user);
  return user;
}

export async function signUpWithEmail(email: string, password: string) {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(user);
  return user;
}

export async function signInWithEmail(email: string, password: string) {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserDoc(user);
  return user;
}

export function logOut() {
  return signOut(auth);
}

// Subscribe to auth state. Returns the unsubscribe function.
export function watchAuth(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}
