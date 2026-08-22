// ============================================================================
// FreeAPI TTL & Semi-Static Revalidation Registry
// Custom TTL (Freshness Lifetime) per API service
// ============================================================================

export interface DatasetTtlConfig {
  slug: string;
  ttlSeconds: number; // Maximum freshness lifetime before requiring upstream sync
  isSemiStatic: boolean;
  category: string;
  description: string;
  upstreamUrl?: string;
  syncFetcher?: () => Promise<any[]>;
}

// ⏱️ Per-Service Custom TTL Table (in Seconds)
export const TTL_REGISTRY: Record<string, number> = {
  // 🕌 Religious & Daily Schedules (24 Hours - Once per day)
  'prayer-times': 60 * 60 * 24, // 24 Hours
  'islamic-calendar': 60 * 60 * 24,
  'horoscope-daily': 60 * 60 * 24,

  // 💱 Forex & Currency Exchange (4 Hours during market hours)
  'exchange-rates': 60 * 60 * 4, // 4 Hours
  'fx-cross-rates': 60 * 60 * 4,

  // 🪙 Cryptocurrency Live Prices (5 Minutes)
  'crypto-prices': 60 * 5, // 5 Minutes
  'crypto-top-100': 60 * 5,
  'gas-fees-tracker': 60 * 3, // 3 Minutes

  // ⛽ Commodities & Energy (1 Hour)
  'commodity-rates': 60 * 60 * 1, // 1 Hour
  'gold-silver-prices': 60 * 60 * 1,

  // ☁️ Weather & Atmospheric (30 Minutes)
  'weather-forecast': 60 * 30, // 30 Minutes
  'air-quality-index': 60 * 60 * 2, // 2 Hours

  // 📈 Trends & News (6 Hours)
  'trending-repos': 60 * 60 * 6,
  'hacker-news-top': 60 * 60 * 2,

  // 📚 Static Datasets Default (30 Days)
  'rest-countries': 60 * 60 * 24 * 30,
  'world-cities': 60 * 60 * 24 * 30,
  'world-airports': 60 * 60 * 24 * 30,
  'world-universities': 60 * 60 * 24 * 30,
  'periodic-table': 60 * 60 * 24 * 30,
  'pokemon-pokedex': 60 * 60 * 24 * 30,
  'superheroes-universe': 60 * 60 * 24 * 30,
  'programming-languages': 60 * 60 * 24 * 30,
  'nobel-laureates': 60 * 60 * 24 * 30,
  'quotes-library': 60 * 60 * 24 * 30,
  'free-to-play-games': 60 * 60 * 24 * 7, // 7 Days
  'mime-types': 60 * 60 * 24 * 30,
  'cocktails-recipes': 60 * 60 * 24 * 30,
  'dnd-5e-spells': 60 * 60 * 24 * 30,
  'rick-and-morty': 60 * 60 * 24 * 30,
  'world-public-holidays': 60 * 60 * 24 * 30,
};

// Default fallback TTLs
export const DEFAULT_STATIC_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 Days
export const DEFAULT_SEMI_STATIC_TTL_SECONDS = 60 * 60 * 2; // 2 Hours

/**
 * Returns the exact TTL lifetime for any dataset slug
 */
export function getDatasetTtl(slug: string): number {
  if (TTL_REGISTRY[slug] !== undefined) {
    return TTL_REGISTRY[slug];
  }
  return DEFAULT_SEMI_STATIC_TTL_SECONDS;
}

/**
 * Checks if a dataset is configured as semi-static
 */
export function isSemiStaticSlug(slug: string): boolean {
  const ttl = getDatasetTtl(slug);
  return ttl <= 60 * 60 * 24 * 7; // Less than 7 days is considered semi-static/dynamic
}
