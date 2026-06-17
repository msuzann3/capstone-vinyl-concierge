export interface Recommendation {
  albumId?: string;
  title: string;
  artist: string;
  genre: string;
  releaseYear: string;
  classification: "Familiar Classic" | "Discovery Gem";
  whyThisMatches: string;
  aestheticVibe: string;
  tracksToListenTo: string[];
  reviewType?: "staff" | "fit";
  matchScore?: number;
}

export interface OwnerInsights {
  trendsSummary: string;
  inventoryOpportunities: string;
  underrepresentedAreas: string;
  merchandisingStrategy: string;
}

export interface CollectionOpportunity {
  title: string;
  artist: string;
  genre: string;
  reason: string;
  shelfTag: string;
}

export interface CollectionInsights {
  coverageScore: number;
  scoreNote: string;
  opportunities: CollectionOpportunity[];
  explorationAreas: string[];
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  ownerInsights: OwnerInsights;
  collectionInsights: CollectionInsights;
}

export interface UserPreferences {
  artists: string;
  genres: string[];
  mood: string;
  listeningHabit: string;
  customPrompt: string;
}

export interface SyntheticInventoryItem {
  title: string;
  artist: string;
  genre: string;
  year: string;
  vibe: string;
}
