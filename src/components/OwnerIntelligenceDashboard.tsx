import { ReactNode, useMemo, useState } from "react";
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
  buildOwnerRecommendations,
  initialCustomerRequests,
  initialOwnerInventory,
  initialOwnerRecommendations,
  initialStoreLogs,
  ownerDashboardStats,
  ownerSalesTrends,
} from "../ownerIntelligenceData";
import { PurchaseRecommendation } from "../ownerIntelligenceTypes";

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
    title: "Validate Demand Signals",
    description: "Compare in-store slips and Web Concierge requests against likely purchase intent.",
  },
  {
    id: "recommendations",
    eyebrow: "Step 03",
    title: "Review AI Recommendations",
    description: "Use local synthetic signals to draft a cautious owner buy plan.",
  },
  {
    id: "outcomes",
    eyebrow: "Step 04",
    title: "Track Outcomes",
    description: "Review sales, listening-room signals, and staff notes after decisions are made.",
  },
];

export default function OwnerIntelligenceDashboard() {
  const [activeStep, setActiveStep] = useState<OwnerStep>("inventory");
  const [inventory, setInventory] = useState(initialOwnerInventory);
  const [requests, setRequests] = useState(initialCustomerRequests);
  const [recommendations, setRecommendations] = useState(initialOwnerRecommendations);
  const [logs, setLogs] = useState(initialStoreLogs);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const lowStock = useMemo(() => inventory.filter((item) => item.inStock <= 2), [inventory]);
  const totalDemandUnits = useMemo(
    () => requests.reduce((sum, request) => sum + request.quantity, 0),
    [requests],
  );

  const refreshRecommendations = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    setRecommendations(buildOwnerRecommendations(inventory, requests, "standard", "conservative"));
    setLogs((current) => [
      {
        id: `LOG-${Math.floor(100 + Math.random() * 900)}`,
        date: new Date().toISOString().split("T")[0],
        author: "Kermit",
        text: "Owner plan refreshed from local synthetic signals. Low sample recommendations still need human review.",
        color: "cream",
        category: "Operations",
      },
      ...current,
    ]);
    setIsRefreshing(false);
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
              Business-facing side
            </span>
            <h2 className="font-display text-2xl sm:text-3xl text-vinyl-black uppercase leading-none mt-2">
              Owner Intelligence Dashboard
            </h2>
            <p className="font-editorial text-stone-600 italic text-base sm:text-lg mt-2 max-w-3xl">
              A Week 3 owner workflow for shelf gaps, demand validation, cautious AI buy plans, and outcomes.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
            <Metric label="Revenue" value={`$${ownerDashboardStats.totalRevenue.toLocaleString()}`} />
            <Metric label="Patrons" value={ownerDashboardStats.activePatrons.toLocaleString()} />
            <Metric label="Low Stock" value={lowStock.length.toString()} danger={lowStock.length > 0} />
            <Metric label="Demand Units" value={totalDemandUnits.toString()} />
          </div>
        </header>

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

        {activeStep === "inventory" && (
          <Panel
            icon={<AlertTriangle className="w-5 h-5" />}
            title="Urgent Low Stock Alerts"
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
                      <p className="text-sm text-stone-600">{item.artist} · {item.format}</p>
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
                <h3 className="font-display text-sm uppercase text-vinyl-black">Active Shelf Gaps</h3>
                <Gap label="Post-Bop / Modal Jazz" value={14} />
                <Gap label="Post-War Fiction" value={22} />
                <Gap label="Ambient / Drone" value={38} />
              </div>
            </div>
          </Panel>
        )}

        {activeStep === "demand" && (
          <Panel icon={<ClipboardList className="w-5 h-5" />} title="Active Patron Demand Cards">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          </Panel>
        )}

        {activeStep === "recommendations" && (
          <Panel
            icon={<ShoppingBag className="w-5 h-5" />}
            title="AI Owner Buy Plan"
            actionLabel={isRefreshing ? "Refreshing..." : "Refresh Plan"}
            onAction={refreshRecommendations}
          >
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
          Week 3 note: this side is intentionally local and synthetic. It does not claim real POS,
          purchase-history, Discogs, or live inventory integration yet.
        </div>
      </div>
    </section>
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
