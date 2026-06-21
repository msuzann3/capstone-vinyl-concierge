import type React from "react";
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, ListChecks, PlayCircle, Store } from "lucide-react";

const explainerVideo = new URL("../assets/vinyl-concierge-explainer.mp4", import.meta.url).href;

interface TesterIntroPageProps {
  onStartApp: () => void;
  onOpenFeedback: () => void;
}

export default function TesterIntroPage({ onStartApp, onOpenFeedback }: TesterIntroPageProps) {
  return (
    <section className="max-w-6xl mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="border-l-4 border-curate-red pl-5 py-2">
            <h1 className="font-display text-3xl sm:text-5xl text-vinyl-black tracking-tight leading-none uppercase">
              The Vinyl Concierge Prototype Evaluation Guide
            </h1>
            <p className="font-editorial text-stone-700 italic text-lg sm:text-xl mt-3 max-w-2xl">
              Thank you for helping evaluate my Capstone project, The Vinyl Concierge.
            </p>
          </div>

          <div className="bg-vinyl-black text-bone-cream rounded-lg border border-stone-800 shadow-xl overflow-hidden">
            <div className="aspect-video bg-stone-950 border-b border-stone-800">
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
            <div className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-sleeve-mustard">
                  Tester path
                </span>
                <p className="text-sm text-stone-300 mt-1">
                  Read the guide, access the prototype, then use the anonymous survey link after you have played with the prototype.
                </p>
              </div>
              <button
                onClick={onStartApp}
                className="inline-flex items-center justify-center gap-2 bg-curate-red hover:bg-sleeve-mustard hover:text-vinyl-black text-white px-5 py-3 rounded-md font-bold uppercase text-sm transition-all shadow"
              >
                <PlayCircle className="w-4 h-4" />
                Try the app
              </button>
            </div>
          </div>

          <GuideSection title="Project Background" icon={<Store className="w-5 h-5" />}>
            <p>
              The inspiration for this project comes from a personal goal: someday we hope to open an independent record store in Santa Fe, New Mexico.
            </p>
            <p>
              One of the most enjoyable parts of visiting a great record store is discovering music you did not know you were looking for. A knowledgeable owner or employee can connect customers with albums that match their tastes while introducing them to artists and genres they may never have explored on their own.
            </p>
            <p>The Vinyl Concierge is designed to recreate that discovery experience online.</p>
          </GuideSection>

          <GuideSection title="What Is It?" icon={<CheckCircle2 className="w-5 h-5" />}>
            <p>
              The Vinyl Concierge is a music recommendation engine that helps users discover vinyl records based on their musical preferences.
            </p>
            <p>
              Users provide information about their tastes, favorite genres, artists, and listening habits. The system then generates album recommendations intended to match those preferences and encourage discovery of new music.
            </p>
          </GuideSection>

          <GuideSection title="Current Prototype Status" icon={<ClipboardList className="w-5 h-5" />}>
            <p>This project is currently an early-stage prototype.</p>
            <p>
              The customer-facing recommendation experience is functional, but many planned features have not yet been developed.
            </p>
            <p>At this stage, the goal is to evaluate:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {["Ease of use", "Clarity of the experience", "Overall value of the concept", "Quality of the recommendation process"].map((item) => (
                <li key={item} className="flex items-start gap-2 rounded border border-stone-200 bg-bone-cream px-3 py-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-curate-red mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </GuideSection>

          <GuideSection title="Known Limitations" icon={<AlertCircle className="w-5 h-5" />}>
            <p>Please keep the following limitations in mind while testing:</p>
            <div className="space-y-3">
              <Limitation title="Limited Catalog">
                The recommendation database currently contains approximately 200 albums sourced from Discogs. Because the catalog is intentionally small for this prototype, recommendations may not perfectly align with your preferences.
              </Limitation>
              <Limitation title="Sample Data Available">
                If you prefer not to complete the recommendation questionnaire, sample user data is available for testing purposes.
              </Limitation>
              <Limitation title="Prototype Quality">
                This project is intended to demonstrate the concept and user experience rather than a production-ready recommendation engine.
              </Limitation>
            </div>
          </GuideSection>
        </div>

        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-sleeve-white rounded-lg border border-stone-300 shadow-md p-5">
            <div className="flex items-center gap-2 text-curate-red">
              <ListChecks className="w-5 h-5" />
              <h2 className="font-display text-lg uppercase text-vinyl-black">What to do</h2>
            </div>
            <ol className="mt-4 space-y-3 text-sm text-stone-700">
              <li className="flex gap-3">
                <span className="font-mono text-curate-red font-bold">1</span>
                <span>Read this evaluation guide and, if available, watch the short explainer.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-curate-red font-bold">2</span>
                <span>Use the button to access the prototype and test it with your real music tastes.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-curate-red font-bold">3</span>
                <span>Use the anonymous survey link after you have played with the prototype.</span>
              </li>
            </ol>
          </div>

          <div className="bg-bone-cream rounded-lg border border-kraft/70 p-5">
            <div className="flex items-center gap-2 text-curate-red">
              <ClipboardList className="w-5 h-5" />
              <h2 className="font-display text-lg uppercase text-vinyl-black">After trying it</h2>
            </div>
            <p className="text-sm text-stone-700 leading-relaxed mt-3">
              Honest feedback is far more valuable than positive feedback and will help improve future versions of the experience.
            </p>
            <button
              onClick={onOpenFeedback}
              className="mt-4 inline-flex items-center gap-2 border border-curate-red text-curate-red hover:bg-curate-red hover:text-white px-4 py-2 rounded-md text-sm font-bold uppercase transition-all"
            >
              Open feedback form
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 shadow-md p-5">
            <h2 className="font-display text-lg uppercase text-vinyl-black">What feedback would be most helpful?</h2>
            <ol className="mt-4 space-y-3 text-sm text-stone-700">
              {[
                "Was the purpose of the site clear?",
                "Was the recommendation process easy to understand?",
                "Did the experience feel intuitive?",
                "Were there any points where you felt confused or unsure what to do next?",
                "Did the recommendations feel interesting or relevant?",
                "What would make the experience more useful?",
                "If this were a real product, would you use it?",
              ].map((question, index) => (
                <li key={question} className="flex gap-3">
                  <span className="font-mono text-curate-red font-bold">{index + 1}</span>
                  <span>{question}</span>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </section>
  );
}

function GuideSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-lg border border-stone-200 shadow-md p-5 space-y-3">
      <div className="flex items-center gap-2 text-curate-red">
        {icon}
        <h2 className="font-display text-xl uppercase text-vinyl-black">{title}</h2>
      </div>
      <div className="space-y-3 text-sm sm:text-base text-stone-700 leading-relaxed">
        {children}
      </div>
    </section>
  );
}

function Limitation({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-md border border-kraft/60 bg-bone-cream p-4">
      <h3 className="text-sm font-bold uppercase tracking-wide text-vinyl-black">{title}</h3>
      <p className="text-sm text-stone-700 leading-relaxed mt-2">{children}</p>
    </div>
  );
}
