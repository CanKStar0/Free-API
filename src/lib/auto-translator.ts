/**
 * Automated Neural Translation Helper (Zero-API Key, Ultra-fast)
 * Supports translating between Turkish and English automatically.
 */
export async function autoTranslate(text: string, targetLang: 'tr' | 'en' = 'en'): Promise<string> {
  if (!text || !text.trim()) return '';

  try {
    const cleanText = text.trim();
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(cleanText)}`;

    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!res.ok) {
      throw new Error(`Translate status: ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0].map((item: any) => (item && item[0] ? item[0] : '')).join('');
      return translated.trim() || cleanText;
    }

    return cleanText;
  } catch (error) {
    console.warn('Auto translation warning:', error);
    return text;
  }
}
