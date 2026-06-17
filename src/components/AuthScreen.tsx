import { useState } from "react";
import type { FormEvent } from "react";
import { KeyRound, Mail, X } from "lucide-react";
import { Brandmark } from "./BrandLogo";

interface AuthScreenProps {
  busy: boolean;
  notice: string | null;
  onClose: () => void;
  onGoogle: () => Promise<void>;
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  onEmailSignUp: (email: string, password: string) => Promise<void>;
}

export default function AuthScreen({
  busy,
  notice,
  onClose,
  onGoogle,
  onEmailSignIn,
  onEmailSignUp,
}: AuthScreenProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitEmail = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === "signin") {
      await onEmailSignIn(email, password);
    } else {
      await onEmailSignUp(email, password);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-vinyl-black/70 backdrop-blur-sm px-4 py-6 flex items-center justify-center">
      <section className="w-full max-w-5xl bg-bone-cream border border-sleeve-mustard/60 shadow-2xl rounded-lg overflow-hidden">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-vinyl-black p-4 sm:p-6 flex items-center justify-center">
            <div className="w-full max-w-md bg-bone-cream rounded-lg border border-stone-200 p-6 sm:p-8 shadow-xl relative">
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 rounded-full border border-stone-300 bg-white p-1.5 text-stone-500 hover:text-curate-red"
                aria-label="Close sign-in panel"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center mb-8">
                <div className="mx-auto mb-4 h-16 w-16">
                  <Brandmark />
                </div>
                <h2 className="font-display text-2xl uppercase text-vinyl-black">
                  Welcome to Curate
                </h2>
                <p className="font-editorial italic text-stone-600 mt-1">
                  Sign in to save your stacks and shelf history.
                </p>
              </div>

              <button
                type="button"
                onClick={onGoogle}
                disabled={busy}
                className="w-full flex items-center justify-center gap-3 rounded-md border-2 border-vinyl-black bg-white px-4 py-3 text-sm font-bold text-vinyl-black hover:bg-stone-100 disabled:opacity-60"
              >
                <span className="h-5 w-5 rounded-full border-2 border-curate-red" />
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3 text-xs text-stone-500">
                <span className="h-px flex-1 bg-sleeve-mustard/50" />
                or
                <span className="h-px flex-1 bg-sleeve-mustard/50" />
              </div>

              <form onSubmit={submitEmail} className="space-y-4">
                <label className="block">
                  <span className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-curate-red">
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-md border border-sleeve-mustard/60 bg-white px-3 py-2.5 text-sm text-vinyl-black focus:border-curate-red focus:outline-none focus:ring-1 focus:ring-curate-red"
                  />
                </label>

                <label className="block">
                  <span className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-curate-red">
                    <KeyRound className="h-3.5 w-3.5" />
                    Password
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    minLength={6}
                    required
                    className="w-full rounded-md border border-sleeve-mustard/60 bg-white px-3 py-2.5 text-sm text-vinyl-black focus:border-curate-red focus:outline-none focus:ring-1 focus:ring-curate-red"
                  />
                </label>

                {notice && (
                  <p className="rounded border border-curate-red/30 bg-white px-3 py-2 text-xs text-curate-red">
                    {notice}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-md bg-curate-red px-4 py-3 font-display text-sm uppercase tracking-wide text-white shadow-md hover:bg-red-700 disabled:opacity-60"
                >
                  {busy ? "Working..." : mode === "signin" ? "Sign in" : "Create account"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="mt-4 w-full text-center text-xs font-bold text-stone-600 hover:text-curate-red"
              >
                {mode === "signin"
                  ? "Need an account? Create one"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-bone-cream">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-curate-red">
              Curate Records & Books · Authentication
            </span>
            <h3 className="mt-2 font-display text-2xl uppercase text-vinyl-black">
              Sign-in & Registration Flow
            </h3>
            <div className="mt-8 space-y-4">
              {[
                ["1 · Identity provider", "Firebase Authentication handles sign-in. Google OAuth is the primary method; email and password are available as the fallback."],
                ["2 · Credentials stay out of Firestore", "Passwords are handled by Firebase Auth. The app stores only a user profile, role, saved sessions, and aggregate demand signals."],
                ["3 · Profile created on first sign-in", "New users receive a customer profile at users/{uid}. Owner access is granted manually, not self-assigned."],
                ["4 · Rules authorize access", "Firestore rules use request.auth.uid and role checks to control customer sessions, demand signals, catalog edits, and owner dashboard reads."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-md border border-sleeve-mustard/70 bg-bone-cream/80 p-4 shadow-sm border-l-4 border-l-curate-red">
                  <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-curate-red">
                    {title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-stone-700">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
