import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  ClipboardList,
  PackagePlus,
  RefreshCw,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import {
  buildLiveDemandRecommendations,
  buildOwnerRecommendations,
  initialCustomerRequests,
  initialOwnerInventory,
  initialOwnerRecommendations,
  initialStoreLogs,
  ownerDashboardStats,
  ownerSalesTrends,
} from "../ownerIntelligenceData";
import { PurchaseRecommendation } from "../ownerIntelligenceTypes";
import { getDemandSummary, type DemandSummary } from "../ownerSignals";
import type { ProfessorSessionHandoff, Recommendation } from "../types";

type OwnerStep = "inventory" | "demand" | "recommendations" | "outcomes";

const steps: Array<{
  id: OwnerStep;
  eyebrow: string;
  title: string;
  description: string;
}> = [
  {
    id: "inventory",
    eyebrow: "Step 01",
    title: "Identify Inventory Issues",
    description: "Find low-stock titles and category gaps before reacting to request noise.",
  },
  {
    id: "demand",
    eyebrow: "Step 02",
    title: "Validate Interest Signals",
    description: "Compare in-store slips and Web Concierge requests before treating them as purchase intent.",
  },
  {
    id: "recommendations",
    eyebrow: "Step 03",
    title: "Review AI Recommendations",
    description: "Turn live recommendation activity into a cautious sourcing watchlist for human review.",
  },
  {
    id: "outcomes",
    eyebrow: "Step 04",
    title: "Track Outcomes",
    description: "Review sales, listening-room signals, and staff notes after decisions are made.",
  },
];

const commercialRoadmap = [
  { label: "Recommendation Engine", status: "ready" },
  { label: "Customer Profiles", status: "ready" },
  { label: "Owner Intelligence Dashboard", status: "ready" },
  { label: "Recommendation History", status: "ready" },
  { label: "Live Inventory Integration", status: "future" },
  { label: "Shopify / Square / Lightspeed Integration", status: "future" },
  { label: "Shopping Cart & Checkout", status: "future" },
  { label: "Purchase Analytics", status: "future" },
  { label: "Demand Forecasting", status: "future" },
];

const syntheticBusinessInsights = [
  {
    label: "Potential Lost Sales",
    value: "12",
    detail: "Recommendation requests did not match available demo inventory.",
  },
  {
    label: "High Demand Category",
    value: "Japanese City Pop",
    detail: "17 recommendation signals, with 2 demo titles available for review.",
  },
];

export default function OwnerIntelligenceDashboard({
  latestSession,
}: {
  latestSession?: ProfessorSessionHandoff | null;
}) {
  const [activeStep, setActiveStep] = useState<OwnerStep>(latestSession ? "recommendations" : "inventory");
  const [inventory, setInventory] = useState(initialOwnerInventory);
  const [requests, setRequests] = useState(initialCustomerRequests);
  const [recommendations, setRecommendations] = useState(initialOwnerRecommendations);
  const [recommendationSource, setRecommendationSource] = useState<"live" | "demo">("demo");
  const [logs, setLogs] = useState(initialStoreLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveDemand, setLiveDemand] = useState<DemandSummary | null>(null);
  const [liveDemandError, setLiveDemandError] = useState<string | null>(null);

  const lowStock = useMemo(() => inventory.filter((item) => item.inStock <= 2), [inventory]);
  const latestSessionRecommendations = useMemo(
    () => latestSession ? buildSessionRecommendations(latestSession) : [],
    [latestSession],
  );
  useEffect(() => {
    let ignore = false;

    getDemandSummary()
      .then((summary) => {
        if (!ignore) {
          setLiveDemand(summary);
          setLiveDemandError(null);
          const liveRecommendations = buildLiveDemandRecommendations(summary.topAlbums);
          if (liveRecommendations.length > 0) {
            setRecommendations(liveRecommendations);
            setRecommendationSource("live");
          }
        }
      })
      .catch((error) => {
        if (!ignore) {
          const message = error instanceof Error && error.message.includes("permissions")
            ? "Sign in as owner to read live interest signals."
            : "Live interest signals are unavailable right now.";
          setLiveDemandError(message);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const refreshRecommendations = async () => {
    setIsRefreshing(true);
    try {
      const summary = await getDemandSummary();
      const liveRecommendations = buildLiveDemandRecommendations(summary.topAlbums);
      setLiveDemand(summary);
      setLiveDemandError(null);

      if (liveRecommendations.length > 0) {
        setRecommendations(liveRecommendations);
        setRecommendationSource("live");
        setLogs((current) => [
          {
            id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
            date: new Date().toISOString().split("T")[0],
            author: "Kermit",
            text: `Owner plan refreshed from ${summary.sampleSize} de-identified customer recommendation signals. Human review is still required.`,
            color: "cream",
            category: "Operations",
          },
          ...current,
        ]);
      } else {
        setRecommendations(buildOwnerRecommendations(inventory, requests, "standard", "conservative"));
        setRecommendationSource("demo");
      }
    } catch (error) {
      const message = error instanceof Error && error.message.includes("permissions")
        ? "Sign in as owner to refresh live interest signals."
        : "Live interest signals are unavailable right now.";
      setLiveDemandError(message);
      setRecommendations(buildOwnerRecommendations(inventory, requests, "standard", "conservative"));
      setRecommendationSource("demo");
    } finally {
      setIsRefreshing(false);
    }
  };

  const restockItem = (id: string) => {
    setInventory((items) =>
      items.map((item) =>
        item.id === id ? { ...item, inStock: item.inStock + 10, status: "Restocked" as const } : item,
      ),
    );
  };

  const addDemoRequest = () => {
    setRequests((current) => [
      {
        id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split("T")[0],
        patronName: "Demo Patron",
        artist: "John Coltrane",
        title: "A Love Supreme",
        format: "LP",
        notes: "Asked at the counter after browsing the jazz shelf. Good candidate for validation against actual purchase behavior.",
        source: "In-store Slip",
        quantity: 2,
        genre: "Post-Bop Jazz",
      },
      ...current,
    ]);
    setActiveStep("demand");
  };

  return (
    <section className="rounded-lg border border-vinyl-black/10 bg-bone-cream shadow-xl overflow-hidden">
      <div className="p-5 sm:p-7 lg:p-8 space-y-8">
        <header className="flex flex-col gap-4 border-b border-vinyl-black/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="font-mono text-[10px] text-curate-red uppercase tracking-widest font-bold">
              Owner demo
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-vinyl-black uppercase leading-none mt-2">
              Owner Intelligence Dashboard
            </h2>
            <p className="font-editorial text-stone-600 italic text-base sm:text-lg mt-2 max-w-3xl">
              Customer recommendation activity now feeds a live, de-identified sourcing watchlist. Inventory, sales, and outcomes remain demonstration data.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <Metric label="Revenue" value={`$${ownerDashboardStats.totalRevenue.toLocaleString()}`} />
            <Metric label="Patrons" value={ownerDashboardStats.activePatrons.toLocaleString()} />
            <Metric label="Low Stock" value={lowStock.length.toString()} danger={lowStock.length > 0} />
            <Metric
              label="Interest Signals"
              value={liveDemand ? liveDemand.sampleSize.toString() : liveDemandError ? "—" : "0"}
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <section className="rounded border border-vinyl-black/10 bg-paper-white p-5 lg:col-span-3">
            <div className="flex items-start gap-3">
              <PackagePlus className="mt-0.5 h-5 w-5 shrink-0 text-curate-red" />
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-curate-red">
                  Commercial Roadmap
                </span>
                <p className="mt-1 text-sm leading-relaxed text-stone-600">
                  The prototype demonstrates the customer-to-owner decision loop. Commerce and live operating-system
                  integrations are intentionally deferred for a production SaaS version.
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {commercialRoadmap.map((item) => (
                <div key={item.label} className="flex items-center gap-2 rounded border border-vinyl-black/10 bg-bone-cream px-3 py-2">
                  <span className={`flex h-6 w-14 shrink-0 items-center justify-center rounded-full text-[9px] font-bold uppercase ${
                    item.status === "ready"
                      ? "bg-vinyl-black text-bone-cream"
                      : "bg-sleeve-mustard text-vinyl-black"
                  }`}>
                    {item.status === "ready" ? "Built" : "Future"}
                  </span>
                  <span className="text-xs font-bold text-vinyl-black">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded border border-vinyl-black/10 bg-vinyl-black p-5 text-bone-cream lg:col-span-2">
            <div className="flex items-start gap-3">
              <TrendingUp className="mt-0.5 h-5 w-5 shrink-0 text-sleeve-mustard" />
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-sleeve-mustard">
                  Strategic Owner Signals
                </span>
                <p className="mt-1 text-sm leading-relaxed text-stone-300">
                  Synthetic examples showing how future inventory connections could turn recommendation activity into buying decisions.
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {syntheticBusinessInsights.map((insight) => (
                <article key={insight.label} className="rounded border border-sleeve-mustard/30 bg-stone-950 px-4 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-sleeve-mustard">
                    {insight.label}
                  </span>
                  <strong className="mt-1 block font-display text-lg uppercase text-white">
                    {insight.value}
                  </strong>
                  <p className="mt-1 text-xs leading-relaxed text-stone-300">{insight.detail}</p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <nav className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {steps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`text-left rounded border p-4 transition-all ${
                activeStep === step.id
                  ? "border-curate-red bg-sleeve-white shadow-md"
                  : "border-vinyl-black/10 bg-paper-white hover:border-vinyl-black/30"
              }`}
            >
              <span className="font-mono text-[10px] uppercase tracking-widest text-curate-red font-bold">
                {step.eyebrow}
              </span>
              <strong className="block font-display text-sm uppercase text-vinyl-black mt-1">
                {step.title}
              </strong>
              <span className="block text-xs text-stone-500 leading-snug mt-2">
                {step.description}
              </span>
            </button>
          ))}
        </nav>

        {latestSession && (
          <section className="rounded-lg border-2 border-curate-red bg-sleeve-white p-5 shadow-lg">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-curate-red">
                  Same-session handoff
                </span>
                <h2 className="mt-2 font-display text-xl uppercase text-vinyl-black">
                  Customer Recommendations → Owner Review
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-stone-600">
                  These are the exact records generated in the customer view during this browser session.
                  Owner Intelligence converts them into cautious sourcing suggestions without exposing a customer name or profile.
                </p>
              </div>
              <span className={`rounded border px-3 py-2 text-[10px] font-bold uppercase tracking-wider ${
                latestSession.persistence === "saved"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : latestSession.persistence === "error"
                    ? "border-curate-red/20 bg-curate-red/10 text-curate-red"
                    : "border-sleeve-mustard/50 bg-sleeve-mustard/20 text-amber-900"
              }`}>
                {latestSession.persistence === "saved"
                  ? "Saved to Firestore"
                  : latestSession.persistence === "error"
                    ? "Firestore save failed"
                    : "Browser-only session"}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
              {latestSession.recommendations.map((recommendation) => {
                const key = getRecommendationKey(recommendation);
                const action = latestSession.actions[key];
                return (
                  <article key={key} className="rounded border border-vinyl-black/10 bg-paper-white p-4">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">
                      {recommendation.genre}
                    </span>
                    <strong className="mt-1 block text-sm text-vinyl-black">{recommendation.title}</strong>
                    <span className="block text-xs text-stone-500">{recommendation.artist}</span>
                    <span className="mt-3 inline-block rounded bg-vinyl-black px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-bone-cream">
                      {action ? `Customer: ${action}` : "Recommendation signal"}
                    </span>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeStep === "inventory" && (
          <Panel
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Demo Low Stock Alerts"
            actionLabel="Add Demo Request"
            onAction={addDemoRequest}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded border border-vinyl-black/10 bg-paper-white overflow-hidden">
                {lowStock.map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 border-b border-vinyl-black/10 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-stone-500 uppercase tracking-widest">
                        {item.id} · {item.genre}
                      </span>
                      <h3 className="font-bold text-vinyl-black">{item.title}</h3>
                      <p className="text-xs text-stone-500 mt-2">{item.notes}</p>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3">
                      <span className="font-display text-3xl text-curate-red">{item.inStock}</span>
                      <button
                        onClick={() => restockItem(item.id)}
                        className="rounded bg-vinyl-black px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-bone-cream hover:bg-stone-800"
                      >
                        +10 Restock
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded border border-vinyl-black/10 bg-paper-white p-5">
                <h3 className="font-display text-sm uppercase text-vinyl-black">Demo Shelf Gaps</h3>
                <Gap label="Post-Bop / Modal Jazz" value={14} />
                <Gap label="Post-War Fiction" value={22} />
                <Gap label="Ambient / Drone" value={38} />
              </div>
            </div>
          </Panel>
        )}

        {activeStep === "demand" && (
          <Panel icon={<ClipboardList className="w-5 h-5" />} title="Prototype Interest Cards">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="rounded border border-vinyl-black/10 bg-sleeve-white p-5 lg:col-span-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-sm uppercase text-vinyl-black">Live Firestore Interest Signals</h3>
                  <span className="rounded bg-vinyl-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-bone-cream">
                    {liveDemand?.sampleSize ?? 0} signals
                  </span>
                </div>
                {liveDemandError ? (
                  <p className="mt-4 text-xs text-stone-500">{liveDemandError}</p>
                ) : (
                  <div className="mt-4 space-y-5">
                    <DemandList
                      title="Top Recommended Albums"
                      emptyLabel="No recommendation activity yet"
                      items={(liveDemand?.topAlbums ?? []).slice(0, 5).map((item) => ({
                        label: `${item.artist} — ${item.title}`,
                        value: `${item.weight.toFixed(1)} score`,
                      }))}
                    />
                    <DemandList
                      title="Top Genres"
                      emptyLabel="No saved sessions yet"
                      items={(liveDemand?.topGenres ?? []).slice(0, 5).map((item) => ({
                        label: item.genre,
                        value: `${item.count} requests`,
                      }))}
                    />
                    <DemandList
                      title="Top Artists"
                      emptyLabel="No saved artists yet"
                      items={(liveDemand?.topArtists ?? []).slice(0, 5).map((item) => ({
                        label: item.artist,
                        value: `${item.count} requests`,
                      }))}
                    />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:col-span-2">
              {requests.map((request) => (
                <article key={request.id} className="rounded border border-vinyl-black/10 bg-paper-white p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] text-stone-500">{request.id}</span>
                    <span className="rounded border border-curate-red/20 bg-curate-red/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-curate-red">
                      {request.source}
                    </span>
                    <span className="font-mono text-[10px] text-stone-400">{request.date}</span>
                  </div>
                  <h3 className="font-display text-base uppercase text-vinyl-black mt-3">{request.title}</h3>
                  <p className="text-sm font-bold text-stone-600">
                    {request.artist} · {request.format} · {request.genre}
                  </p>
                  <p className="font-editorial italic text-stone-600 mt-3 border-l-2 border-curate-red pl-3">
                    "{request.notes}"
                  </p>
                  <div className="mt-4 flex justify-between text-xs text-stone-500">
                    <span>Requested by {request.patronName}</span>
                    <span className="font-mono">{request.quantity} unit signal</span>
                  </div>
                </article>
              ))}
              </div>
            </div>
          </Panel>
        )}

        {activeStep === "recommendations" && (
          <Panel
            icon={<ShoppingBag className="w-5 h-5" />}
            title={recommendationSource === "live" ? "Live Customer-Demand Watchlist" : "Prototype Owner Buy Plan"}
            actionLabel={isRefreshing ? "Refreshing..." : "Refresh Plan"}
            onAction={refreshRecommendations}
          >
            {latestSessionRecommendations.length > 0 && (
              <div className="space-y-3 rounded border border-curate-red/20 bg-curate-red/5 p-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-curate-red">
                  Current professor walkthrough session
                </span>
                {latestSessionRecommendations.map((recommendation) => (
                  <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                ))}
              </div>
            )}
            <div className={`rounded border px-4 py-3 text-xs ${
              recommendationSource === "live"
                ? "border-green-200 bg-green-50 text-green-900"
                : "border-sleeve-mustard/40 bg-sleeve-mustard/10 text-stone-600"
            }`}>
              {recommendationSource === "live"
                ? "Built from de-identified customer recommendation appearances, saved interest, and thumbs responses stored in Firestore. These signals support cautious review; they do not prove a sale."
                : "No usable live album signals are available yet, so this view is showing the local demonstration plan."}
            </div>
            <div className="grid grid-cols-1 gap-4">
              {recommendations.map((recommendation) => (
                <RecommendationCard key={recommendation.id} recommendation={recommendation} />
              ))}
            </div>
          </Panel>
        )}

        {activeStep === "outcomes" && (
          <Panel icon={<BarChart3 className="w-5 h-5" />} title="Outcomes And Staff Notes">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 rounded border border-vinyl-black/10 bg-paper-white p-5">
                <h3 className="font-display text-sm uppercase text-vinyl-black">Monthly Signals</h3>
                <div className="mt-5 flex items-end gap-2 h-44 border-b border-vinyl-black/10">
                  {ownerSalesTrends.map((point) => (
                    <div key={point.month} className="flex-1 flex flex-col items-center justify-end gap-1">
                      <div className="w-full rounded-t bg-curate-red/80" style={{ height: `${point.sales / 2}px` }} />
                      <div className="w-full rounded-t bg-vinyl-black/80" style={{ height: `${point.listening / 2}px` }} />
                      <span className="font-mono text-[9px] text-stone-500">{point.month}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-4 text-[10px] font-mono uppercase tracking-wider text-stone-500">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 bg-curate-red" /> Sales</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 bg-vinyl-black" /> Listening room</span>
                </div>
              </div>
              <div className="space-y-3">
                {logs.map((log) => (
                  <article key={log.id} className="rounded border border-vinyl-black/10 bg-sleeve-white p-4 shadow-sm">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-curate-red">
                      {log.category} · {log.date}
                    </span>
                    <p className="font-hand text-2xl leading-tight text-vinyl-black mt-2">{log.text}</p>
                    <p className="text-xs text-stone-500 mt-3">- {log.author}</p>
                  </article>
                ))}
              </div>
            </div>
          </Panel>
        )}

        <div className="rounded border border-dashed border-vinyl-black/20 bg-paper-white p-4 text-xs text-stone-500">
          Backend connection: signed-in customer recommendation sessions and response controls now create de-identified Firestore signals for signed-in owner review.
          Inventory, revenue, sales trends, and outcomes remain demonstration data until Curate's operating systems are connected.
        </div>
      </div>
    </section>
  );
}

function getRecommendationKey(recommendation: Recommendation) {
  return recommendation.albumId ?? `${recommendation.artist}-${recommendation.title}`;
}

function buildSessionRecommendations(session: ProfessorSessionHandoff): PurchaseRecommendation[] {
  return session.recommendations.map((recommendation) => {
    const action = session.actions[getRecommendationKey(recommendation)];
    const actionWeight = action === "interest" ? 1 : action === "like" ? 0.75 : action === "dislike" ? -1 : 0;
    const confidenceScore = Math.max(30, Math.min(82, 52 + actionWeight * 20));
    const actionSummary = action
      ? ` The customer marked this recommendation as ${action}.`
      : " The customer has not added a response to this record yet.";

    return {
      id: `SESSION-${getRecommendationKey(recommendation)}`,
      artist: recommendation.artist,
      title: recommendation.title,
      genre: recommendation.genre,
      format: "LP",
      action: action === "dislike"
        ? "Do not source from this session alone"
        : action === "interest" || action === "like"
          ? "Add to the owner watchlist for a small test buy"
          : "Watch for repeat interest before sourcing",
      reason: `This title appeared in the current customer recommendation session.${actionSummary} Treat it as one de-identified prototype signal, not confirmed purchase demand.`,
      confidenceScore,
      sampleSizeWarning: "Single-session evidence: useful for demonstrating the connected workflow, but insufficient for a deep inventory decision.",
      sampleSizeSignificant: "Low",
      requestVolume: 1,
      trendSignalQuality: action === "interest" || action === "like" ? "Moderate" : "Weak",
      estCost: 16,
      estRetail: 31.99,
      isAIResult: true,
    };
  });
}

function DemandList({
  title,
  emptyLabel,
  items,
}: {
  title: string;
  emptyLabel: string;
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
        {title}
      </span>
      <div className="mt-2 space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 rounded border border-vinyl-black/10 bg-paper-white px-3 py-2">
              <span className="text-sm font-bold text-vinyl-black">{item.label}</span>
              <span className="font-mono text-[10px] text-stone-500">{item.value}</span>
            </div>
          ))
        ) : (
          <p className="rounded border border-dashed border-vinyl-black/20 bg-paper-white px-3 py-2 text-xs text-stone-500">
            {emptyLabel}
          </p>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, danger = false }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className="rounded border border-vinyl-black/10 bg-paper-white px-3 py-2">
      <span className="block font-mono text-[9px] uppercase tracking-widest text-stone-500">{label}</span>
      <strong className={`block font-display text-lg leading-tight ${danger ? "text-curate-red" : "text-vinyl-black"}`}>
        {value}
      </strong>
    </div>
  );
}

function Panel({
  icon,
  title,
  children,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <section className="space-y-5 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-vinyl-black/10 pb-4">
        <h2 className="flex items-center gap-2 font-display text-lg uppercase text-vinyl-black">
          <span className="text-curate-red">{icon}</span>
          {title}
        </h2>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 rounded bg-vinyl-black px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-bone-cream hover:bg-stone-800"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Gap({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-5">
      <div className="flex justify-between font-mono text-[10px] uppercase text-vinyl-black">
        <span>{label}</span>
        <span className={value < 25 ? "text-curate-red" : "text-stone-500"}>{value}% stock</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-bone-cream overflow-hidden">
        <div className={value < 25 ? "h-full bg-curate-red" : "h-full bg-vinyl-black"} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }: { recommendation: PurchaseRecommendation; key?: string }) {
  const margin = recommendation.estRetail - recommendation.estCost;
  const significanceStyles = {
    High: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-sleeve-mustard/20 text-amber-900 border-sleeve-mustard/40",
    Low: "bg-curate-red/10 text-curate-red border-curate-red/20",
  };

  return (
    <article className="rounded border border-vinyl-black/10 bg-paper-white p-5">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-stone-500">
            {recommendation.id} · {recommendation.genre}
          </span>
          <h3 className="font-display text-lg uppercase text-vinyl-black mt-1">
            {recommendation.title}
          </h3>
          <p className="text-sm font-bold text-stone-600">{recommendation.artist} · {recommendation.format}</p>
          <p className="text-sm text-stone-600 mt-3">{recommendation.reason}</p>
        </div>
        <div className="min-w-44 rounded border border-vinyl-black/10 bg-bone-cream p-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500">Action</span>
          <strong className="block text-sm text-vinyl-black mt-1">{recommendation.action}</strong>
          <span className="mt-3 block font-mono text-[10px] text-stone-500">
            Est. margin: ${margin.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded bg-vinyl-black px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-bone-cream">
          {recommendation.confidenceScore}% confidence
        </span>
        <span className={`rounded border px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${significanceStyles[recommendation.sampleSizeSignificant]}`}>
          {recommendation.sampleSizeSignificant} sample
        </span>
        <span className="text-xs text-stone-500">{recommendation.sampleSizeWarning}</span>
      </div>
    </article>
  );
}
