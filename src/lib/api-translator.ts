import { ApiService } from '@/data/apis';
import { Language } from '@/data/translations';

// Exact English translations for specific API descriptions
const EXACT_API_TRANSLATIONS_EN: Record<string, { description: string; rateLimit?: string }> = {
  // Weather
  'Open-Meteo': { description: 'Zero authentication required, completely free, 16-day forecast, unlimited requests', rateLimit: 'Unlimited' },
  'OpenWeatherMap': { description: '7-day weather forecast, current conditions, and historical records', rateLimit: '1,000 req/day' },
  'WeatherAPI': { description: 'Comprehensive real-time weather and astronomical datasets', rateLimit: '1M req/month' },
  'Visual Crossing': { description: '50-year historical weather records and global meteorological forecasts', rateLimit: '1,000 req/day' },
  'Tomorrow.io': { description: 'Advanced hyperlocal weather intelligence, wind vectors, and alert feeds', rateLimit: '500 req/day' },
  'Meteostat': { description: 'Open meteorological historical weather data archive and climate trends', rateLimit: 'Variable' },
  'AccuWeather': { description: 'Enterprise-grade weather forecasts and high-resolution radar feeds', rateLimit: '50 req/day' },
  'Weatherbit': { description: 'High-resolution historical and current weather and solar telemetry', rateLimit: '500 req/day' },
  'Weatherstack': { description: 'Real-time global weather and geolocation lookup engine', rateLimit: '250 req/month' },
  'World Weather Online': { description: 'Global worldwide weather, marine, and ski resort forecasting', rateLimit: '500 req/day' },
  'NOAA (ABD Hava Servisi)': { description: 'Official US National Weather Service open API, zero key needed', rateLimit: 'Unlimited' },
  'Yr.no (Norveç)': { description: 'Norwegian Meteorological Institute open public weather feeds', rateLimit: 'Unlimited' },
  'AirVisual': { description: 'Global real-time air quality index (AQI) and pollution sensor datasets', rateLimit: '10k req/month' },
  'OpenAQ': { description: 'Global community air quality open environmental data platform', rateLimit: '5,000 req/day' },

  // Crypto
  'CoinGecko': { description: 'Zero authentication required, comprehensive crypto market datasets', rateLimit: '10-50 req/min' },
  'CoinCap': { description: 'Real-time crypto market cap, exchange volume, and live pricing feeds', rateLimit: '200 req/min' },
  'CoinMarketCap': { description: 'Industry-leading cryptocurrency index and market valuations', rateLimit: '10k req/month' },
  'CoinPaprika': { description: '100% free crypto price ticker and decentralized token analytics', rateLimit: 'Unlimited' },
  'CoinLore': { description: 'Free cryptocurrency market data, coin list and global trading volume', rateLimit: 'Unlimited' },
  'CryptoCompare': { description: 'Comprehensive crypto market streaming and historical pricing analytics', rateLimit: '100k req/month' },
  'Binance API': { description: 'Official Binance spot, futures, and real-time market depth endpoints', rateLimit: '1,200 req/min' },
  'Coinbase API': { description: 'US largest regulated crypto exchange developer API endpoints', rateLimit: '10k req/hour' },
  'Etherscan': { description: 'Ethereum blockchain explorer, smart contract telemetry and gas tracker', rateLimit: '5 req/sec' },
  'Alchemy': { description: 'Complete Web3 development suite and high-throughput RPC node infrastructure', rateLimit: '300M compute/mo' },
  'Moralis': { description: 'Enterprise Web3 APIs, NFT indexers, and cross-chain wallet data streaming', rateLimit: '40k req/month' },
  'DeFi Llama': { description: 'Open DeFi TVL protocol data and yield analytics, 100% free', rateLimit: 'Unlimited' },
  'OpenSea': { description: 'NFT marketplace listings, bids, collection stats, and sales events', rateLimit: '4 req/sec' },
  'The Graph': { description: 'Decentralized indexing protocol for querying blockchain networks via GraphQL', rateLimit: '100k req/month' },
  'Infura': { description: 'High-availability Ethereum and IPFS infrastructure gateway', rateLimit: '100k req/day' },
  'QuickNode': { description: 'Multi-chain node infrastructure and real-time Web3 RPC streaming', rateLimit: '10M req/month' },
  'Blockfrost': { description: 'Cardano blockchain developer API and token telemetry', rateLimit: '50k req/day' },
  'CoinRanking': { description: 'Live coin rankings, interactive price charts, and exchange metrics', rateLimit: '10k req/month' },
  'CoinDesk': { description: 'Bitcoin price index (BPI) and crypto financial news ticker', rateLimit: 'Unlimited' },
  'Kraken': { description: 'Institutional-grade crypto exchange REST & WebSocket data feeds', rateLimit: '1 req/sec' },
  'KuCoin': { description: 'Spot and margin cryptocurrency trading market endpoints', rateLimit: '200 req/sec' },

  // Gaming
  'RAWG': { description: 'Massive database of 500,000+ video games with metadata and player reviews', rateLimit: '20k req/month' },
  'IGDB': { description: 'Twitch video game database with cover artwork, genres, and ratings', rateLimit: '4 req/sec' },
  'CheapShark': { description: 'Video game deal finder and digital store price comparison, zero auth', rateLimit: 'Unlimited' },
  'Free-to-Play Games': { description: 'Categorized database of free-to-play MMO, RPG and action games', rateLimit: 'Unlimited' },
  'GamerPower': { description: 'Real-time video game giveaways, promotions, and free DLC alerts', rateLimit: 'Unlimited' },
  'Steam API': { description: 'Official Valve Steam user profiles, inventory, and game telemetry', rateLimit: '100k req/day' },
  'Giant Bomb': { description: 'Community video game encyclopedia, wiki, and podcast archive', rateLimit: '200 req/hour' },
  'Pokémon API': { description: 'Complete Pokémon catalog, moves, abilities, species, and sprites', rateLimit: '100 req/min' },
  'League of Legends (Riot)': { description: 'Official Riot Games LoL match history, champions, and rankings', rateLimit: '100 req/2 min' },
  'Valorant API': { description: 'Valorant weapon skins, playable agents, maps, and battlepass tiers', rateLimit: 'Unlimited' },
  'Genshin Impact': { description: 'Comprehensive Genshin Impact characters, weapons, and artifact stats', rateLimit: 'Unlimited' },
  'Elden Ring': { description: 'Elden Ring bosses, weapons, armor, talismans, and lore encyclopedia', rateLimit: '300 req/min' },
  'Honkai: Star Rail': { description: 'Honkai Star Rail characters, light cones, and relic set telemetry', rateLimit: 'Unlimited' },
  'D&D 5e API': { description: 'Dungeons & Dragons 5th Edition SRD spells, classes, rules, and monsters', rateLimit: 'Unlimited' },
  'Yu-Gi-Oh! API': { description: 'Complete Yu-Gi-Oh card database with artwork, prices, and sets', rateLimit: '20 req/sec' },
  'Scryfall': { description: 'High-speed Magic: The Gathering card catalog with ruling syntax', rateLimit: '10 req/sec' },
  'Chess.com API': { description: 'Player rankings, live chess matches, tournaments, and club stats', rateLimit: 'Unlimited' },
};

// Direct Live REST Endpoints
const DIRECT_ENDPOINTS: Record<string, string> = {
  'Open-Meteo': 'https://api.open-meteo.com/v1/forecast?latitude=41.01&longitude=28.97&current_weather=true',
  'CoinGecko': 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd',
  'CoinCap': 'https://api.coincap.io/v2/assets',
  'Binance API': 'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
  'DeFi Llama': 'https://api.llama.fi/protocols',
  'Pokémon API': 'https://pokeapi.co/api/v2/pokemon/ditto',
  'CheapShark': 'https://www.cheapshark.com/api/1.0/deals?storeID=1&upperPrice=15',
  'Free-to-Play Games': 'https://www.freetogame.com/api/games',
  'Scryfall': 'https://api.scryfall.com/cards/random',
  'D&D 5e API': 'https://www.dnd5eapi.co/api/spells/acid-arrow',
  'JSONPlaceholder': 'https://jsonplaceholder.typicode.com/posts/1',
  'ReqRes': 'https://reqres.in/api/users/2',
  'HTTPBin': 'https://httpbin.org/get',
  'IP-API': 'http://ip-api.com/json/',
  'OpenAQ': 'https://api.openaq.org/v2/locations',
  'NASA APOD': 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY',
  'Etherscan': 'https://api.etherscan.io/api?module=stats&action=ethprice',
  'Yu-Gi-Oh! API': 'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=Tornado%20Dragon',
  'Chuck Norris Jokes': 'https://api.chucknorris.io/jokes/random',
  'Cat Facts': 'https://catfact.ninja/fact',
  'Dog CEO': 'https://dog.ceo/api/breeds/image/random',
};

export function getDirectEndpoint(api: ApiService): string {
  return DIRECT_ENDPOINTS[api.name] || api.url;
}

// Clean Rate Limit Translator

export function translateRateLimit(rateLimit: string, language: Language): string {
  if (language === 'tr') return rateLimit;

  let str = rateLimit;
  str = str.replace(/\bSınırsız\b/gi, 'Unlimited');
  str = str.replace(/\bDeğişken\b/gi, 'Variable');
  
  // Specific compound units first
  str = str.replace(/(?:istek|çağrı)\s*\/\s*2\s*(?:dk|dakika)/gi, 'req/2 min');
  str = str.replace(/(?:istek|çağrı)\s*\/\s*gün/gi, 'req/day');
  str = str.replace(/(?:istek|çağrı)\s*\/\s*ay/gi, 'req/month');
  str = str.replace(/(?:istek|çağrı)\s*\/\s*(?:dk|dakika)/gi, 'req/min');
  str = str.replace(/(?:istek|çağrı)\s*\/\s*(?:sn|saniye)/gi, 'req/sec');
  str = str.replace(/(?:istek|çağrı)\s*\/\s*saat/gi, 'req/hour');
  str = str.replace(/ünite\s*\/\s*ay/gi, 'units/month');

  // Single word boundary units (isolated words only)
  str = str.replace(/\b(?:istek|çağrı)\b/gi, 'req');
  str = str.replace(/\bgün\b/gi, 'day');
  str = str.replace(/\bay\b/gi, 'month');
  str = str.replace(/\bsaat\b/gi, 'hour');
  str = str.replace(/\b(?:dk|dakika)\b/gi, 'min');
  str = str.replace(/\b(?:sn|saniye)\b/gi, 'sec');
  return str;
}


// Smart Description Translator
export function translateDescription(api: ApiService, language: Language): string {
  // 1. Direct bilingual fields from community submissions or database
  if (language === 'en' && api.description_en) {
    return api.description_en;
  }
  if (language === 'tr') {
    return api.description_tr || api.description;
  }

  // 2. Check exact dictionary
  if (EXACT_API_TRANSLATIONS_EN[api.name]) {
    return EXACT_API_TRANSLATIONS_EN[api.name].description;
  }

  // 3. Automated Smart Phrase Translation
  let desc = api.description;

  const phraseReplacements: [RegExp, string][] = [
    [/Kayıt gerektirmez, tamamen ücretsiz, 16 günlük tahmin, sınırsız kullanım/gi, 'Zero registration required, completely free, 16-day forecast, unlimited requests'],
    [/Kayıt gerektirmez, tamamen ücretsiz/gi, 'Zero registration required, 100% free to use'],
    [/Kayıt gerektirmez, ücretsiz/gi, 'No auth required, free access'],
    [/Kayıt gerektirmez/gi, 'No registration required'],
    [/kayıt yok, tamamen ücretsiz/gi, 'Zero auth, 100% free'],
    [/kayıt yok/gi, 'No registration required'],
    [/Tamamen ücretsiz, sınırsız/gi, '100% free with unlimited requests'],
    [/Tamamen ücretsiz/gi, '100% free and open'],
    [/ücretsiz/gi, 'free to use'],
    [/sınırsız kullanım/gi, 'unlimited requests'],
    [/sınırsız/gi, 'unlimited access'],
    [/7 günlük tahmin/gi, '7-day weather forecast'],
    [/16 günlük tahmin/gi, '16-day weather forecast'],
    [/50 yıllık tarihi veri/gi, '50-year historical climate dataset'],
    [/Tarihi hava verileri/gi, 'Historical weather datasets'],
    [/Tarihi veri/gi, 'Historical records'],
    [/Kapsamlı hava durumu verileri/gi, 'Comprehensive weather datasets'],
    [/Gelişmiş hava tahminleri/gi, 'Advanced weather forecasts'],
    [/Profesyonel hava durumu servisi/gi, 'Professional weather service'],
    [/Detaylı hava verileri/gi, 'Detailed meteorological telemetry'],
    [/Gerçek zamanlı hava durumu/gi, 'Real-time live weather feeds'],
    [/Global hava verileri/gi, 'Global meteorological datasets'],
    [/Hava kalitesi verileri/gi, 'Real-time air quality index (AQI) data'],
    [/Hava kalitesi açık veri/gi, 'Open air quality environmental datasets'],
    [/kapsamlı kripto verileri/gi, 'comprehensive cryptocurrency market datasets'],
    [/gerçek zamanlı fiyatlar/gi, 'real-time ticker pricing and exchange feeds'],
    [/En büyük kripto veri sağlayıcısı/gi, 'Leading cryptocurrency data aggregator'],
    [/Tamamen ücretsiz kripto verileri/gi, '100% free cryptocurrency endpoints'],
    [/Kapsamlı kripto karşılaştırma/gi, 'Comprehensive cryptocurrency market comparison'],
    [/Dünyanın en büyük borsası/gi, 'Global cryptocurrency exchange endpoints'],
    [/Ethereum blockchain verisi/gi, 'Ethereum blockchain explorer telemetry'],
    [/Web3 geliştirme platformu/gi, 'Web3 developer infrastructure platform'],
    [/Web3 geliştirme/gi, 'Web3 application development'],
    [/DeFi protokol verileri/gi, 'Decentralized finance (DeFi) analytics'],
    [/Bitcoin haberleri/gi, 'Bitcoin news and price indices'],
    [/Popüler borsa/gi, 'Popular crypto exchange platform'],
    [/Güvenilir borsa API/gi, 'Institutional-grade crypto exchange API'],
    [/oyun veritabanı/gi, 'video game catalog database'],
    [/Oyun wiki ve incelemeler/gi, 'Video game wiki and editorial reviews'],
    [/Oyun fiyat karşılaştırma/gi, 'Game price comparison and deals'],
    [/Ücretsiz oyunlar listesi/gi, 'Curated free-to-play games directory'],
    [/Oyun hediyeleri ve promosyonlar/gi, 'Game giveaways and active promotions'],
    [/Steam platform verileri/gi, 'Steam platform and user profile telemetry'],
    [/LoL oyuncu ve maç verileri/gi, 'League of Legends player and match stats'],
    [/Elden Ring oyun verileri/gi, 'Elden Ring bosses and equipment data'],
    [/HSR karakter ve silah verileri/gi, 'HSR characters and lightcone stats'],
    [/Dungeons & Dragons verileri/gi, 'Dungeons & Dragons 5e SRD datasets'],
    [/Yu-Gi-Oh kart veritabanı/gi, 'Yu-Gi-Oh card database and pricing'],
    [/harita servisleri/gi, 'mapping and navigation services'],
    [/coğrafi kodlama/gi, 'geocoding and location search'],
    [/IP konum/gi, 'IP geolocation and ASN lookup'],
  ];

  for (const [pattern, replacement] of phraseReplacements) {
    desc = desc.replace(pattern, replacement);
  }

  return desc;
}
