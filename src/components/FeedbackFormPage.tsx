import React, { useMemo, useState } from "react";
import { CheckCircle2, Info, Send } from "lucide-react";
import { FeedbackPayload, hasFeedbackWebhook, submitFeedbackToWebhook } from "../feedbackSubmission";

type FeedbackFormState = {
  name: string;
  email: string;
  musicBuyerType: string;
  usedSimilarBefore: string;
  similarToolsUsed: string;
  likedBefore: string;
  frustratingBefore: string;
  firstStepClarity: string;
  confusingMoment: string;
  recommendationClarity: string;
  uiEase: string;
  uiFriction: string;
  notColors: string;
  feltConnected: string;
  notesHelpful: string;
  trustSignal: string;
  wantedToExplore: string;
  expectedBetterUnderstanding: string;
  mostUsefulChange: string;
  wouldUseAtStore: string;
  guidedVsAllAtOnce: string;
  finalComment: string;
};

const initialForm: FeedbackFormState = {
  name: "",
  email: "",
  musicBuyerType: "",
  usedSimilarBefore: "",
  similarToolsUsed: "",
  likedBefore: "",
  frustratingBefore: "",
  firstStepClarity: "",
  confusingMoment: "",
  recommendationClarity: "",
  uiEase: "",
  uiFriction: "",
  notColors: "",
  feltConnected: "",
  notesHelpful: "",
  trustSignal: "",
  wantedToExplore: "",
  expectedBetterUnderstanding: "",
  mostUsefulChange: "",
  wouldUseAtStore: "",
  guidedVsAllAtOnce: "",
  finalComment: "",
};

const buyerTypes = [
  "I buy records often",
  "I buy records sometimes",
  "I mostly stream music but would consider records",
  "I am mainly helping as a music listener",
];

const similarUse = ["Yes, recently", "Yes, but not recently", "No", "Not sure"];
const clarityScale = ["Very clear", "Mostly clear", "A little confusing", "Very confusing"];
const helpfulScale = ["Helpful", "Somewhat helpful", "Too technical", "Too vague", "Not useful"];
const useScale = ["Yes", "Maybe", "Probably not", "No"];
const guidedScale = ["One page was fine", "I would prefer step-by-step", "I am not sure"];

interface FeedbackFormPageProps {
  onBackToIntro: () => void;
  onTryApp: () => void;
}

export default function FeedbackFormPage({ onBackToIntro, onTryApp }: FeedbackFormPageProps) {
  const [form, setForm] = useState<FeedbackFormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const webhookReady = hasFeedbackWebhook();

  const payload = useMemo<FeedbackPayload>(() => ({
    submittedAt: new Date().toISOString(),
    source: "vinyl-concierge-week-5-feedback",
    respondent: {
      name: form.name,
      email: form.email,
      musicBuyerType: form.musicBuyerType,
    },
    priorExperience: {
      usedSimilarBefore: form.usedSimilarBefore,
      similarToolsUsed: form.similarToolsUsed,
      likedBefore: form.likedBefore,
      frustratingBefore: form.frustratingBefore,
    },
    usability: {
      firstStepClarity: form.firstStepClarity,
      confusingMoment: form.confusingMoment,
      recommendationClarity: form.recommendationClarity,
      uiEase: form.uiEase,
      uiFriction: form.uiFriction,
      notColors: form.notColors,
    },
    recommendationQuality: {
      feltConnected: form.feltConnected,
      notesHelpful: form.notesHelpful,
      trustSignal: form.trustSignal,
      wantedToExplore: form.wantedToExplore,
      expectedBetterUnderstanding: form.expectedBetterUnderstanding,
    },
    decisionSignals: {
      mostUsefulChange: form.mostUsefulChange,
      wouldUseAtStore: form.wouldUseAtStore,
      guidedVsAllAtOnce: form.guidedVsAllAtOnce,
      finalComment: form.finalComment,
    },
    metadata: {
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
    },
  }), [form]);

  const setField = (field: keyof FeedbackFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setStatusMessage("");

    try {
      await submitFeedbackToWebhook(payload);
      setStatus("sent");
      setStatusMessage("Thank you. Your feedback was sent to Michelle's response sheet.");
      setForm(initialForm);
    } catch (error: any) {
      setStatus("error");
      setStatusMessage(error.message || "The response could not be sent yet. Please let Michelle know.");
    }
  };

  return (
    <section className="max-w-5xl mx-auto w-full">
      <div className="border-l-4 border-curate-red pl-5 py-2 mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-vinyl-black tracking-tight leading-tight uppercase">
          The Vinyl Concierge Feedback Form
        </h1>
        <p className="font-editorial text-stone-700 italic text-lg mt-2 max-w-3xl">
          Please answer from your real experience using the prototype. Short, honest answers are more useful than compliments.
        </p>
        <p className="text-sm text-stone-700 leading-relaxed mt-3 max-w-3xl">
          Since we are working with a limited database, this is not about the recommendations you received. It is about the ease of using the app. Although if the recommendations are correct, that is cool too!
        </p>
      </div>

      <div className="bg-sleeve-white rounded-lg border border-stone-300 p-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-curate-red mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-vinyl-black">
              Please answer these questions about the app itself.
            </p>
            <p className="text-xs text-stone-600 mt-1">
              The intro page is just background. The catalog is small, so please do not judge the app by whether it finds the perfect record. Focus on whether the app is clear, easy to use, and understandable.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onBackToIntro} className="border border-stone-300 bg-bone-cream hover:bg-white px-3 py-2 rounded text-xs font-bold uppercase">
            Intro
          </button>
          <button onClick={onTryApp} className="border border-curate-red text-curate-red hover:bg-curate-red hover:text-white px-3 py-2 rounded text-xs font-bold uppercase">
            Try app
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-stone-200 shadow-xl overflow-hidden">
        <div className="p-6 space-y-8">
          <QuestionGroup title="About you">
            <TextField label="Name or initials (optional)" value={form.name} onChange={(value) => setField("name", value)} />
            <TextField label="Email (optional, only if Michelle may follow up)" value={form.email} onChange={(value) => setField("email", value)} type="email" />
            <ChoiceField label="How would you describe yourself as a music or record buyer?" value={form.musicBuyerType} options={buyerTypes} onChange={(value) => setField("musicBuyerType", value)} required />
          </QuestionGroup>

          <QuestionGroup title="Similar tools you have used">
            <ChoiceField label="Have you used a similar recommendation engine before?" value={form.usedSimilarBefore} options={similarUse} onChange={(value) => setField("usedSimilarBefore", value)} required />
            <TextArea label="Which one did you use, and what were you trying to find?" value={form.similarToolsUsed} onChange={(value) => setField("similarToolsUsed", value)} />
            <TextArea label="What did you like about that past experience?" value={form.likedBefore} onChange={(value) => setField("likedBefore", value)} />
            <TextArea label="What was frustrating or unhelpful about it?" value={form.frustratingBefore} onChange={(value) => setField("frustratingBefore", value)} />
          </QuestionGroup>

          <QuestionGroup title="Using this prototype">
            <ChoiceField label="How clear was the first step in The Vinyl Concierge?" value={form.firstStepClarity} options={clarityScale} onChange={(value) => setField("firstStepClarity", value)} required />
            <TextArea label="Where, if anywhere, did you pause, reread, or wonder what to do next?" value={form.confusingMoment} onChange={(value) => setField("confusingMoment", value)} />
            <ChoiceField label="Once recommendations appeared, how clear was the results page?" value={form.recommendationClarity} options={clarityScale} onChange={(value) => setField("recommendationClarity", value)} required />
            <ChoiceField label="How easy was the interface to use? Please ignore color preferences." value={form.uiEase} options={clarityScale} onChange={(value) => setField("uiEase", value)} required />
            <TextArea label="What felt too long, too small, too hidden, or hard to scan? Please do not focus on colors." value={form.uiFriction} onChange={(value) => setField("uiFriction", value)} />
            <TextArea label="Was there any button, label, section, or wording that did not make sense?" value={form.notColors} onChange={(value) => setField("notColors", value)} />
          </QuestionGroup>

          <QuestionGroup title="Understanding the results">
            <ChoiceField label="Was it clear why the app showed you a set of record recommendations?" value={form.feltConnected} options={clarityScale} onChange={(value) => setField("feltConnected", value)} required />
            <ChoiceField label="Were the shelf notes easy to understand?" value={form.notesHelpful} options={helpfulScale} onChange={(value) => setField("notesHelpful", value)} required />
            <TextArea label="What helped or hurt your confidence while using the results page?" value={form.trustSignal} onChange={(value) => setField("trustSignal", value)} />
            <ChoiceField label="After seeing the results, did you know what you were supposed to do next?" value={form.wantedToExplore} options={clarityScale} onChange={(value) => setField("wantedToExplore", value)} required />
            <TextArea label="What would make the results page easier to understand or use?" value={form.expectedBetterUnderstanding} onChange={(value) => setField("expectedBetterUnderstanding", value)} />
          </QuestionGroup>

          <QuestionGroup title="What should change">
            <TextArea label="If Michelle could improve one thing this week, what should it be?" value={form.mostUsefulChange} onChange={(value) => setField("mostUsefulChange", value)} required />
            <ChoiceField label="If this were on a record store website, would you use it?" value={form.wouldUseAtStore} options={useScale} onChange={(value) => setField("wouldUseAtStore", value)} required />
            <ChoiceField label="Would you rather answer everything on one page, or be guided one step at a time?" value={form.guidedVsAllAtOnce} options={guidedScale} onChange={(value) => setField("guidedVsAllAtOnce", value)} required />
            <TextArea label="Other comments?" value={form.finalComment} onChange={(value) => setField("finalComment", value)} />
          </QuestionGroup>
        </div>

        <div className="bg-stone-50 border-t border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-h-6">
            {statusMessage && (
              <p className={`text-sm ${status === "error" ? "text-deep-rust" : "text-stone-700"} flex items-center gap-2`}>
                {status !== "error" && <CheckCircle2 className="w-4 h-4 text-curate-red" />}
                {statusMessage}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={status === "submitting" || !webhookReady}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded text-xs font-bold uppercase shadow ${
              status === "submitting" || !webhookReady
                ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                : "bg-curate-red text-white hover:bg-vinyl-black"
            }`}
          >
            <Send className="w-4 h-4" />
            {status === "submitting" ? "Sending" : "Send feedback"}
          </button>
        </div>
      </form>
    </section>
  );
}

function QuestionGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="space-y-4">
      <legend className="font-display text-lg uppercase text-vinyl-black border-b border-stone-200 w-full pb-2">
        {title}
      </legend>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {children}
      </div>
    </fieldset>
  );
}

function TextField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-sm font-bold text-stone-900 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-bone-cream border border-stone-300 rounded px-3.5 py-2 text-stone-900 focus:outline-none focus:border-curate-red focus:ring-1 focus:ring-curate-red text-sm"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, required = false }: { label: string; value: string; onChange: (value: string) => void; required?: boolean }) {
  return (
    <label className="block md:col-span-2">
      <span className="block text-sm font-bold text-stone-900 mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={3}
        className="w-full bg-bone-cream border border-stone-300 rounded px-3.5 py-2 text-stone-900 focus:outline-none focus:border-curate-red focus:ring-1 focus:ring-curate-red text-sm"
      />
    </label>
  );
}

function ChoiceField({
  label,
  value,
  options,
  onChange,
  required = false,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  required?: boolean;
}) {
  return (
    <div className="block">
      <span className="block text-sm font-bold text-stone-900 mb-2">{label}</span>
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-start gap-2 rounded border border-stone-200 bg-bone-cream px-3 py-2 text-sm text-stone-800 cursor-pointer hover:bg-white">
            <input
              type="radio"
              name={label}
              value={option}
              checked={value === option}
              required={required}
              onChange={() => onChange(option)}
              className="mt-1 accent-curate-red"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
