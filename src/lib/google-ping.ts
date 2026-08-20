export async function pingSearchEngines(sitemapUrl = 'https://api.canpolatkaya.com/sitemap.xml'): Promise<{ google: boolean; bing: boolean }> {
  let googleSuccess = false;
  let bingSuccess = false;

  // 1. Ping Google Search Indexer
  try {
    const googleRes = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
      headers: { 'User-Agent': 'FreeAPI-Sitemap-Ping/1.0' },
    });
    googleSuccess = googleRes.ok;
  } catch (err) {
    console.warn('Google ping warning:', err);
  }

  // 2. Ping Bing / IndexNow
  try {
    const bingRes = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, {
      method: 'GET',
      headers: { 'User-Agent': 'FreeAPI-Sitemap-Ping/1.0' },
    });
    bingSuccess = bingRes.ok;
  } catch (err) {
    console.warn('Bing ping warning:', err);
  }

  return { google: googleSuccess, bing: bingSuccess };
}
