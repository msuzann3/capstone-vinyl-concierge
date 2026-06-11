export type FormatType = "LP" | "BOOK" | "7\" Single" | "10\" LP" | "Cassette";

export interface InventoryItem {
  id: string;
  artist: string;
  title: string;
  format: FormatType;
  genre: string;
  status: "Trending" | "Steady" | "Restocked" | "Critical" | "Warning";
  inStock: number;
  reserved: number;
  price: number;
  coverUrl?: string; // Optional URL for the sleeve image
  isbn?: string; // For books
  releaseYear?: number;
  notes?: string;
  edition?: string;
  condition?: string;
}

export interface CustomerRequest {
  id: string;
  date: string;
  patronName: string;
  artist: string;
  title: string;
  format: FormatType;
  notes: string;
  source: "In-store Slip" | "Web Concierge" | "Phone Inquiry";
  quantity: number;
  genre?: string;
}

export interface PurchaseRecommendation {
  id: string;
  artist: string;
  title: string;
  genre: string;
  format: FormatType;
  action: string; // e.g. "Order 12 units", "Skip Restock", "Source 2 used copies"
  reason: string; // Detail reasoning
  confidenceScore: number; // 0-100%
  sampleSizeWarning: string; // sample size message
  sampleSizeSignificant: "High" | "Medium" | "Low";
  requestVolume: number; // custom base size
  trendSignalQuality: "Strong" | "Moderate" | "Weak";
  estCost: number;
  estRetail: number;
  isAIResult?: boolean; // dynamic generation marker
}

export interface SalesTrendPoint {
  month: string;
  sales: number;
  listening: number;
}

export interface DashboardStats {
  totalRevenue: number;
  revenueChangePct: number;
  activePatrons: number;
  patronsChangeCount: number;
  vinylUnitsCount: number;
  bookUnitsCount: number;
  sellThruRate: number;
  avgTicket: number;
}

export interface StoreLog {
  id: string;
  date: string;
  author: string;
  text: string;
  color: "yellow" | "mustard" | "kraft" | "cream";
  category: "General" | "Sourcing" | "Operations" | "Event";
}
