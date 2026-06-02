export interface Recommendation {
  title: string;
  artist: string;
  genre: string;
  releaseYear: string;
  classification: "Familiar Classic" | "Discovery Gem";
  whyThisMatches: string;
  aestheticVibe: string;
  tracksToListenTo: string[];
}

export interface OwnerInsights {
  trendsSummary: string;
  inventoryOpportunities: string;
  underrepresentedAreas: string;
  merchandisingStrategy: string;
}

export interface RecommendationResponse {
  recommendations: Recommendation[];
  ownerInsights: OwnerInsights;
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
