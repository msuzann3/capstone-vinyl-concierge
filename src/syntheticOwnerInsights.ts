export interface CustomerSession {
  id: string;
  persona: string;
  primaryGenre: string;
  secondaryGenres: string[];
  requestedArtists: string[];
  listeningContext: string;
  purchaseIntent: "browse" | "gift" | "same-day purchase" | "wishlist";
  sessionHour: number;
}

export interface RankedMetric {
  label: string;
  count: number;
  detail: string;
}

export interface InventoryAlert {
  title: string;
  detail: string;
  severity: "high" | "medium" | "watch";
}

export interface PersonaMetric {
  label: string;
  count: number;
}

export interface OwnerDashboardMetrics {
  sessions: CustomerSession[];
  topGenres: RankedMetric[];
  topArtists: RankedMetric[];
  inventoryAlerts: InventoryAlert[];
  trendSummary: string[];
  personaMix: PersonaMetric[];
  lateNightSessions: number;
  sameDayPurchaseSessions: number;
}

const PERSONAS = [
  {
    name: "Indie Folk listeners",
    weight: 19,
    primaryGenre: "Indie Folk",
    secondaryGenres: ["Singer-songwriter", "Folk", "Alternative"],
    artists: ["Phoebe Bridgers", "Sufjan Stevens", "Big Thief", "Bon Iver", "Nick Drake"],
    contexts: ["late-night apartment listening", "Sunday morning coffee", "quiet dinner shelf browsing"]
  },
  {
    name: "Jazz collectors",
    weight: 18,
    primaryGenre: "Jazz",
    secondaryGenres: ["Jazz Fusion", "Soul Jazz", "Audiophile"],
    artists: ["Miles Davis", "John Coltrane", "Herbie Hancock", "Alice Coltrane", "Bill Evans"],
    contexts: ["after-hours listening room", "focused headphone session", "first pressing comparison"]
  },
  {
    name: "Classic Rock fans",
    weight: 15,
    primaryGenre: "Classic Rock",
    secondaryGenres: ["Blues Rock", "Folk Rock", "Audiophile"],
    artists: ["Fleetwood Mac", "The Rolling Stones", "Led Zeppelin", "Neil Young", "Pink Floyd"],
    contexts: ["weekend speaker test", "gift for a longtime collector", "familiar Saturday pull"]
  },
  {
    name: "Alternative listeners",
    weight: 18,
    primaryGenre: "Alternative",
    secondaryGenres: ["Indie Rock", "Dream Pop", "Post-Punk"],
    artists: ["Radiohead", "The Cure", "Cocteau Twins", "Portishead", "The Smiths"],
    contexts: ["rainy evening reset", "used-bin discovery", "low-light room listening"]
  },
  {
    name: "Audiophile collectors",
    weight: 14,
    primaryGenre: "Audiophile",
    secondaryGenres: ["Jazz", "Classic Rock", "Ambient"],
    artists: ["Steely Dan", "Miles Davis", "Pink Floyd", "Brian Eno", "Bill Evans"],
    contexts: ["turntable calibration", "pressing quality comparison", "quiet reference listen"]
  },
  {
    name: "Singer-songwriter fans",
    weight: 17,
    primaryGenre: "Singer-songwriter",
    secondaryGenres: ["Indie Folk", "Folk", "Americana"],
    artists: ["Joni Mitchell", "Nick Drake", "Phoebe Bridgers", "Elliott Smith", "Adrianne Lenker"],
    contexts: ["lyric-forward evening", "gift for a reader", "solo morning listen"]
  }
] as const;

const INVENTORY_BY_GENRE: Record<string, number> = {
  "Indie Folk": 12,
  Jazz: 10,
  Alternative: 11,
  "Singer-songwriter": 12,
  "Classic Rock": 58,
  Audiophile: 27,
  "Jazz Fusion": 9,
  "Dream Pop": 16,
  Ambient: 14
};

function buildSyntheticSessions(): CustomerSession[] {
  const sessions: CustomerSession[] = [];
  const intents: CustomerSession["purchaseIntent"][] = ["browse", "same-day purchase", "wishlist", "gift"];
  const hours = [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  PERSONAS.forEach((persona, personaIndex) => {
    for (let index = 0; index < persona.weight; index += 1) {
      const artistOffset = index + personaIndex;
      sessions.push({
        id: `session-${String(sessions.length + 1).padStart(3, "0")}`,
        persona: persona.name,
        primaryGenre: persona.primaryGenre,
        secondaryGenres: [
          persona.secondaryGenres[index % persona.secondaryGenres.length],
          persona.secondaryGenres[(index + 1) % persona.secondaryGenres.length]
        ],
        requestedArtists: [
          persona.artists[index % 2 === 0 ? 0 : artistOffset % persona.artists.length],
          persona.artists[(artistOffset + 2) % persona.artists.length]
        ],
        listeningContext: persona.contexts[index % persona.contexts.length],
        purchaseIntent: intents[(index + personaIndex) % intents.length],
        sessionHour: hours[(index * 2 + personaIndex) % hours.length]
      });
    }
  });

  return sessions;
}

function countBy(values: string[]) {
  return values.reduce<Record<string, number>>((counts, value) => {
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function toRankedMetrics(counts: Record<string, number>, details: Record<string, string>, limit: number): RankedMetric[] {
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({
      label,
      count,
      detail: details[label] || "Strong repeat customer signal"
    }));
}

function buildMetrics(): OwnerDashboardMetrics {
  const sessions = buildSyntheticSessions();
  const genreCounts = countBy(sessions.map((session) => session.primaryGenre));
  const artistCounts = countBy(sessions.flatMap((session) => session.requestedArtists));
  const personaCounts = countBy(sessions.map((session) => session.persona));

  const topGenres = toRankedMetrics(
    genreCounts,
    {
      "Indie Folk": "Crossover demand from folk, lyric-led, and alternative shoppers",
      Jazz: "Collectors are asking for modal, spiritual, and fusion-adjacent titles",
      Alternative: "Strong pull from Radiohead, dream pop, and post-punk requests",
      "Singer-songwriter": "Closely tied to indie folk and bookshop gift browsing"
    },
    5
  );

  const topArtists = toRankedMetrics(
    artistCounts,
    {
      Radiohead: "Frequent anchor artist for alternative and audiophile sessions",
      "Phoebe Bridgers": "Bridges indie folk, singer-songwriter, and younger gift requests",
      "Miles Davis": "Top jazz entry point and pressing-quality comparison title",
      "Nick Drake": "Shared signal between folk, audiophile, and lyric-led shoppers",
      "Sufjan Stevens": "Reliable indie folk expansion path"
    },
    5
  );

  const inventoryAlerts = topGenres.slice(0, 4).map((genre) => {
    const stock = INVENTORY_BY_GENRE[genre.label] || 18;
    const gap = genre.count - stock;
    const severity: InventoryAlert["severity"] = gap > 18 ? "high" : gap > 8 ? "medium" : "watch";
    const title = gap > 0
      ? `${genre.label} demand exceeds current inventory`
      : `${genre.label} demand is close to current inventory`;

    return {
      title,
      detail: `${genre.count} synthetic session signals against ${stock} representative shelf copies. ${gap > 0 ? "Increase stock depth and visible staff picks." : "Keep monitoring before the next ordering pass."}`,
      severity
    };
  });

  const lateNightSessions = sessions.filter((session) => session.sessionHour >= 20).length;
  const sameDayPurchaseSessions = sessions.filter((session) => session.purchaseIntent === "same-day purchase").length;

  return {
    sessions,
    topGenres,
    topArtists,
    inventoryAlerts,
    trendSummary: [
      "Late-night listening is increasing across jazz, alternative, and indie folk sessions.",
      "Interest in jazz fusion is growing beyond standard Miles Davis and John Coltrane entry points.",
      "Strong crossover appears between indie folk and singer-songwriter listeners.",
      "Audiophile shoppers often use jazz and classic rock as pressing-quality reference categories."
    ],
    personaMix: Object.entries(personaCounts).map(([label, count]) => ({ label, count })),
    lateNightSessions,
    sameDayPurchaseSessions
  };
}

export const ownerDashboardMetrics = buildMetrics();
