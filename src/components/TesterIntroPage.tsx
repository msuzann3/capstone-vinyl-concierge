import { ArrowRight, PlayCircle } from "lucide-react";

const explainerVideo = new URL("../assets/vinyl-concierge-explainer.mp4", import.meta.url).href;

interface TesterIntroPageProps {
  appHref: string;
  feedbackHref: string;
}

export default function TesterIntroPage({ appHref, feedbackHref }: TesterIntroPageProps) {
  return (
    <section className="max-w-6xl mx-auto w-full space-y-6">
      <div className="border-l-4 border-curate-red pl-5 py-2">
        <h1 className="font-display text-3xl sm:text-5xl text-vinyl-black tracking-tight leading-none uppercase">
          The Vinyl Concierge Prototype Evaluation Guide
        </h1>
        <p className="font-editorial text-stone-700 italic text-lg sm:text-xl mt-3 max-w-3xl">
          Please watch the short video, try the prototype, then complete the feedback form.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href={appHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 bg-curate-red hover:bg-vinyl-black text-white px-5 py-3 rounded-md font-bold uppercase text-sm transition-all shadow"
        >
          <PlayCircle className="w-4 h-4" />
          Try the app
        </a>
        <a
          href={feedbackHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-2 border border-curate-red text-curate-red hover:bg-curate-red hover:text-white px-5 py-3 rounded-md text-sm font-bold uppercase transition-all"
        >
          Open feedback form
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 bg-sleeve-white rounded-lg border border-stone-300 shadow-md p-5 space-y-5">
          <div>
            <h2 className="font-display text-lg uppercase text-vinyl-black">How to test</h2>
            <ol className="mt-3 space-y-3 text-sm text-stone-700">
              <li className="flex gap-3">
                <span className="font-mono text-curate-red font-bold">1</span>
                <span>Watch the short explainer video.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-curate-red font-bold">2</span>
                <span>Try the customer recommendation experience with your real music tastes.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-curate-red font-bold">3</span>
                <span>Complete the feedback form after using the app. Please focus on the app itself, not this intro page.</span>
              </li>
            </ol>
          </div>

          <div className="border-t border-stone-300 pt-4">
            <h2 className="font-display text-lg uppercase text-vinyl-black">Caveats</h2>
            <ul className="mt-3 space-y-3 text-sm text-stone-700">
              <li>
                <strong className="text-vinyl-black">Limited catalog:</strong> about 200 albums in a demo catalog, so please do not judge the prototype by whether it finds the perfect record for you.
              </li>
              <li>
                <strong className="text-vinyl-black">Sample data:</strong> if you prefer not to complete the questionnaire, sample user data is available.
              </li>
              <li>
                <strong className="text-vinyl-black">Prototype quality:</strong> this demonstrates the concept and user experience, not a production-ready recommendation engine.
              </li>
            </ul>
          </div>

          <p className="border-t border-stone-300 pt-4 text-sm text-stone-700 leading-relaxed">
            Honest feedback is more useful than positive feedback. Please focus on usability: what is clear, where you hesitate, whether the process makes sense, and what would make the app easier or more useful.
          </p>
        </div>

        <div className="lg:col-span-7 bg-vinyl-black text-bone-cream rounded-lg border border-stone-800 shadow-xl overflow-hidden">
          <div className="aspect-video bg-stone-950">
            <video
              className="h-full w-full object-contain bg-black"
              controls
              preload="metadata"
              playsInline
              src={explainerVideo}
            >
              Your browser does not support embedded video playback.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
