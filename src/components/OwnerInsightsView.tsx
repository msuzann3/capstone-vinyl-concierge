import { useState } from "react";
import { OwnerInsights } from "../types";
import { Lock, Unlock, Database, RefreshCw, BarChart4, TrendingUp, Compass, ShoppingBag, EyeOff, Radio } from "lucide-react";

interface OwnerInsightsViewProps {
  insights: OwnerInsights;
}

export default function OwnerInsightsView({ insights }: OwnerInsightsViewProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<"insights" | "workflow">("insights");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([
    "Curate POS Database connected (Local Mock Mode)",
    "Discogs OAuth Token: valid",
    "Shelf inventory current status: 1,421 physical vinyl sleeves scanned",
  ]);

  const triggerMockSync = () => {
    setIsSyncing(true);
    setSyncLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] Triggering active inventory sync...`]);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncLogs((prev) => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] Discogs master release matched and matched with shop catalog!`,
        `[${new Date().toLocaleTimeString()}] 4 gaps auto-inserted to backlog draft shelf ordering.`
      ]);
    }, 1500);
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
              This panel contains local custom analytics, inventory shelf predictions, gaps, and modular AI pipeline maps for owner and shop curator planning. Click "Unlock Staff Ledger" above to read.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: preference trend + gaps */}
              <div className="space-y-6">
                
                {/* Preference Trends Summary */}
                <div className="bg-stone-950 p-5 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-orange-400" />
                    Customer Taste Trend Summary
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {insights.trendsSummary}
                  </p>
                </div>

                {/* Underrepresented genres/areas */}
                <div className="bg-stone-950 p-5 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400 mb-2">
                    <Compass className="w-3.5 h-3.5 text-sleeve-mustard" />
                    Underrepresented Shelf Gaps
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {insights.underrepresentedAreas}
                  </p>
                </div>

              </div>

              {/* Right Column: Inventory Opportunities + Merchandising display */}
              <div className="space-y-6">
                
                {/* Catalog Opportunities / Reissue Orders */}
                <div className="bg-stone-950 p-5 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400 mb-2">
                    <Database className="w-3.5 h-3.5 text-teal-400" />
                    Active Distributor Ordering List
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {insights.inventoryOpportunities}
                  </p>
                </div>

                {/* Merchandising & Bin placement cards */}
                <div className="bg-stone-950 p-5 rounded border border-stone-800">
                  <span className="flex items-center gap-2 text-xs font-mono uppercase text-stone-400 mb-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-rose-400" />
                    Wall Display & Chalkcard Titles
                  </span>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    {insights.merchandisingStrategy}
                  </p>
                </div>

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
                  Illustrating the schema where this Gemini LLM orchestrates with physical POS barcode inventories (such as Lightspeed or Square) and public datasets (such as Discogs) to cross-reference stock-levels.
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
                    <span className="text-xs font-bold text-stone-100 uppercase font-mono">POS Database Search</span>
                    <span className="text-[10px] text-stone-500 mt-1">Filters matches against local POS stock quantities</span>
                  </div>

                  {/* Step 3 */}
                  <div className="bg-stone-900 duration-200 p-4 border border-stone-800 rounded flex flex-col items-center text-center">
                    <div className="w-8 h-8 rounded-full bg-curate-red text-white flex items-center justify-center text-xs font-bold mb-2">3</div>
                    <span className="text-xs font-bold text-stone-100 uppercase font-mono">Discogs API Pipeline</span>
                    <span className="text-[10px] text-stone-500 mt-1">Pulls cover designs, pressing notes, and user ratings</span>
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
                      MOCK API STREAM & INTEGRATION CONSOLE
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
