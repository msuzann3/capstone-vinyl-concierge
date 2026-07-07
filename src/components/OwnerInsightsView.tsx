import { useState } from "react";
import { OwnerInsights } from "../types";
import { Lock, Unlock, Database, RefreshCw, BarChart4, TrendingUp, Compass, ShoppingBag, EyeOff, Radio, Users, Clock, AlertTriangle, Star, Music2 } from "lucide-react";
import { ownerDashboardMetrics } from "../syntheticOwnerInsights";

interface OwnerInsightsViewProps {
  insights: OwnerInsights;
}

export default function OwnerInsightsView({ insights }: OwnerInsightsViewProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"insights" | "workflow">("insights");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    "Prototype catalog and synthetic owner sample loaded",
    `Synthetic recommendation sessions loaded: ${ownerDashboardMetrics.sessions.length}`,
    "Representative shelf-status sample ready for owner planning",
  ]);
  const maxGenreCount = Math.max(...ownerDashboardMetrics.topGenres.map((genre) => genre.count));
  const maxArtistCount = Math.max(...ownerDashboardMetrics.topArtists.map((artist) => artist.count));
  const maxPersonaCount = Math.max(...ownerDashboardMetrics.personaMix.map((persona) => persona.count));

  const triggerMockSync = () => {
    setIsSyncing(true);
    setSyncLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Recalculating synthetic session trends...`]);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Top demand clusters refreshed from local sample sessions.`,
        `[${new Date().toLocaleTimeString()}] 4 ordering opportunities added to owner review.`
      ]);
    }, 1500);
  };

  const alertStyles = {
    high: "border-curate-red/70 bg-curate-red/10 text-red-200",
    medium: "border-sleeve-mustard/70 bg-sleeve-mustard/10 text-amber-100",
    watch: "border-teal-500/60 bg-teal-500/10 text-teal-100"
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-lg shadow-2xl overflow-hidden text-stone-200 mt-12">
      {/* Top Ledger Header */}
      <div className="bg-stone-950 px-6 py-4 flex justify-between items-center border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-sleeve-mustard animate-ping"></div>
          <h3 className="text-sm font-mono tracking-widest uppercase text-sleeve-mustard">
            [INTERNAL STORE INSIGHT - OWNER VIEW]
          </h3>
        </div>
        
        {/* Unlock Button */}
        <button
          onClick={() => setIsUnlocked(!isUnlocked)}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md font-mono text-xs transition-all cursor-pointer ${
            isUnlocked
              ? "bg-curate-red text-white border border-curate-red/50 animate-pulse"
              : "bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700 hover:text-white"
          }`}
        >
          {isUnlocked ? (
            <>
              <Unlock className="w-3.5 h-3.5 text-sleeve-mustard" />
              <span>Lock Staff Door</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Staff Ledger</span>
            </>
          )}
        </button>
      </div>

      {!isUnlocked ? (
        <div className="p-8 text-center space-y-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-stone-800 flex items-center justify-center border border-stone-700">
            <EyeOff className="w-5 h-5 text-stone-500" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-sm font-bold uppercase text-stone-100 tracking-wider">
              Staff Only Backroom Portal
            </h4>
            <p className="text-xs text-stone-400 font-editorial italic mt-1 leading-relaxed">
              This panel contains synthetic analytics, inventory-planning examples, gaps, and modular AI pipeline maps for owner and shop curator planning. Click "Unlock Staff Ledger" above to read.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-8">
          {/* Inner Navigation Tabs */}
          <div className="flex border-b border-stone-800 gap-1">
            <button
              onClick={() => setActiveTab("insights")}
              className={`pb-3 px-4 text-xs font-mono uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === "insights"
                  ? "border-sleeve-mustard text-white font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <BarChart4 className="w-3.5 h-3.5" />
                Preference Analytics & Gaps
              </span>
            </button>
            <button
              onClick={() => setActiveTab("workflow")}
              className={`pb-3 px-4 text-xs font-mono uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === "workflow"
                  ? "border-sleeve-mustard text-white font-bold"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              <span className="flex items-center gap-2">
                <Compass className="w-3.5 h-3.5" />
                Future Database Workflow
              </span>
            </button>
          </div>

          {activeTab === "insights" ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-stone-950 p-4 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-[10px] font-mono uppercase text-stone-500 tracking-wider">
                    <Users className="w-3.5 h-3.5 text-sleeve-mustard" />
                    Sessions Sampled
                  </span>
                  <strong className="block font-display text-3xl text-white mt-2">
                    {ownerDashboardMetrics.sessions.length}
                  </strong>
                  <span className="text-[11px] text-stone-400">
                    synthetic customer recommendation sessions
                  </span>
                </div>
                <div className="bg-stone-950 p-4 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-[10px] font-mono uppercase text-stone-500 tracking-wider">
                    <Clock className="w-3.5 h-3.5 text-teal-300" />
                    Late-Night Signals
                  </span>
                  <strong className="block font-display text-3xl text-white mt-2">
                    {ownerDashboardMetrics.lateNightSessions}
                  </strong>
                  <span className="text-[11px] text-stone-400">
                    sessions after 8pm listening intent
                  </span>
                </div>
                <div className="bg-stone-950 p-4 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-[10px] font-mono uppercase text-stone-500 tracking-wider">
                    <ShoppingBag className="w-3.5 h-3.5 text-rose-300" />
                    Same-Day Intent
                  </span>
                  <strong className="block font-display text-3xl text-white mt-2">
                    {ownerDashboardMetrics.sameDayPurchaseSessions}
                  </strong>
                  <span className="text-[11px] text-stone-400">
                    customers ready for a shelf pull today
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-stone-950 p-5 rounded border border-stone-800">
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400">
                      <BarChart4 className="w-3.5 h-3.5 text-sleeve-mustard" />
                      Top Requested Genres
                    </span>
                    <span className="text-[10px] font-mono uppercase text-stone-500">
                      All personas
                    </span>
                  </div>
                  <div className="space-y-4">
                    {ownerDashboardMetrics.topGenres.map((genre, index) => (
                      <div key={genre.label} className="space-y-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="w-5 h-5 rounded-full bg-stone-900 border border-stone-700 text-[10px] font-mono flex items-center justify-center text-sleeve-mustard">
                              {index + 1}
                            </span>
                            <span className="text-sm font-bold text-stone-100 truncate">{genre.label}</span>
                          </div>
                          <span className="text-xs font-mono text-stone-400">{genre.count}</span>
                        </div>
                        <div className="h-2 rounded-full bg-stone-900 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-sleeve-mustard"
                            style={{ width: `${Math.max(16, (genre.count / maxGenreCount) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug">{genre.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-950 p-5 rounded border border-stone-800">
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400">
                      <Star className="w-3.5 h-3.5 text-rose-300" />
                      Top Requested Artists
                    </span>
                    <span className="text-[10px] font-mono uppercase text-stone-500">
                      Repeat mentions
                    </span>
                  </div>
                  <div className="space-y-3">
                    {ownerDashboardMetrics.topArtists.map((artist) => (
                      <div key={artist.label} className="bg-stone-900/70 border border-stone-800 rounded p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-bold text-stone-100">{artist.label}</span>
                          <span className="text-[10px] font-mono bg-stone-950 border border-stone-700 text-stone-300 px-2 py-0.5 rounded">
                            {artist.count} asks
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-950 overflow-hidden mt-2">
                          <div
                            className="h-full rounded-full bg-curate-red"
                            style={{ width: `${Math.max(18, (artist.count / maxArtistCount) * 100)}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-stone-500 leading-snug mt-2">{artist.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3 bg-stone-950 p-5 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400 mb-4">
                    <AlertTriangle className="w-3.5 h-3.5 text-sleeve-mustard" />
                    Inventory Opportunity Alerts
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ownerDashboardMetrics.inventoryAlerts.map((alert) => (
                      <div key={alert.title} className={`rounded border p-3 ${alertStyles[alert.severity]}`}>
                        <span className="text-[10px] font-mono uppercase tracking-wider opacity-80">
                          {alert.severity === "high" ? "Order Soon" : alert.severity === "medium" ? "Next Buy List" : "Watch"}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1 leading-snug">{alert.title}</h4>
                        <p className="text-[11px] text-stone-300 leading-snug mt-1">{alert.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-2 bg-stone-950 p-5 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400 mb-4">
                    <Music2 className="w-3.5 h-3.5 text-teal-300" />
                    Persona Mix
                  </span>
                  <div className="space-y-3">
                    {ownerDashboardMetrics.personaMix.map((persona) => (
                      <div key={persona.label}>
                        <div className="flex justify-between gap-3 text-[11px] text-stone-300 mb-1">
                          <span>{persona.label}</span>
                          <span className="font-mono text-stone-500">{persona.count}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-stone-900 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-teal-400"
                            style={{ width: `${Math.max(14, (persona.count / maxPersonaCount) * 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-stone-950 p-5 rounded border border-stone-800">
                <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-orange-300" />
                  Customer Trend Summary
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ownerDashboardMetrics.trendSummary.map((trend) => (
                    <div key={trend} className="bg-stone-900 border border-stone-800 rounded p-3 text-xs text-stone-300 leading-relaxed">
                      {trend}
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-4 border-t border-stone-900 pt-3">
                  Current customer request note: {insights.trendsSummary}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Future Integration Map Explained */}
              <div className="bg-stone-950 p-5 rounded border border-stone-800 relative">
                <h4 className="text-xs font-mono text-white uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sleeve-mustard" />
                  Proposed Modular AI & Music Catalog System Map
                </h4>
                <p className="text-xs text-stone-400 font-editorial italic leading-relaxed mb-6">
                  Illustrating a future local-first workflow where recommendation sessions, representative inventory, and staff shelf notes can inform owner planning without adding external music APIs.
                </p>

                {/* Interactive map visualization */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                  
                  {/* Step 1 */}
                  <div className="bg-stone-900 duration-200 p-4 border border-stone-800 rounded flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-curate-red text-white flex items-center justify-center text-xs font-bold mb-2">1</div>
                    <span className="text-xs font-bold text-stone-100 uppercase font-mono">Concierge AI Clerk</span>
                    <span className="text-[10px] text-stone-500 mt-1">Interviews client & returns JSON query parameters</span>
                  </div>

                  {/* Step 2 */}
                  <div className="bg-stone-900 duration-200 p-4 border border-stone-800 rounded flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-curate-red text-white flex items-center justify-center text-xs font-bold mb-2">2</div>
                    <span className="text-xs font-bold text-stone-100 uppercase font-mono">Future POS Inventory Check</span>
                    <span className="text-[10px] text-stone-500 mt-1">Would filter matches against live stock quantities in a production version</span>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-stone-900 duration-200 p-4 border border-stone-800 rounded flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-curate-red text-white flex items-center justify-center text-xs font-bold mb-2">3</div>
                    <span className="text-xs font-bold text-stone-100 uppercase font-mono">Synthetic Demand Ledger</span>
                    <span className="text-[10px] text-stone-500 mt-1">Summarizes local sample sessions and staff request notes</span>
                  </div>

                  {/* Step 4 */}
                  <div className="bg-stone-900 duration-200 p-4 border border-stone-800 rounded flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-curate-red text-white flex items-center justify-center text-xs font-bold mb-2">4</div>
                    <span className="text-xs font-bold text-stone-100 uppercase font-mono">Generative Output</span>
                    <span className="text-[10px] text-stone-500 mt-1">Compiles precise stock bins and custom owner checklists</span>
                  </div>

                </div>

                {/* Sync Simulator Console */}
                <div className="mt-6 bg-stone-900 rounded p-4 border border-stone-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-mono text-stone-400 tracking-wider">
                      LOCAL SYNTHETIC ANALYTICS CONSOLE
                    </span>
                    <button
                      onClick={triggerMockSync}
                      disabled={isSyncing}
                      className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-[10px] font-mono uppercase px-2 py-1 rounded border border-stone-700 transition cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin text-sleeve-mustard" : ""}`} />
                      Trigger Catalog Scan
                    </button>
                  </div>
                  <div className="bg-stone-950 p-3 rounded font-mono text-[11px] text-stone-400 space-y-1 h-28 overflow-y-auto border border-stone-900">
                    {syncLogs.map((log, i) => (
                      <div key={i} className="leading-tight">
                        <span className="text-sleeve-mustard">#</span> {log}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
