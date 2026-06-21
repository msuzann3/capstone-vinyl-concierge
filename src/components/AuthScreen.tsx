import { X } from "lucide-react";
import { Brandmark } from "./BrandLogo";

interface AuthScreenProps {
  busy: boolean;
  notice: string | null;
  onClose: () => void;
  onGoogle: () => Promise<void>;
}

export default function AuthScreen({
  busy,
  notice,
  onClose,
  onGoogle,
}: AuthScreenProps) {
  return (
    <div className="fixed inset-0 z-50 bg-vinyl-black/70 backdrop-blur-sm px-4 py-6 flex items-center justify-center">
      <section className="w-full max-w-md bg-bone-cream rounded-lg border border-sleeve-mustard/60 p-6 sm:p-8 shadow-2xl relative">
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
          {busy ? "Working..." : "Continue with Google"}
        </button>

        {notice && (
          <p className="mt-4 rounded border border-curate-red/30 bg-white px-3 py-2 text-xs text-curate-red">
            {notice}
          </p>
        )}
      </section>
    </div>
  );
}
