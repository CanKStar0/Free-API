# Developer Instructions (Proje Geliştirici & AI Anayasası)

<!-- DCM_GLOBAL_GUIDELINES_ROOT: C:\Users\canpo\OneDrive\Desktop\GUIDELINES -->

## 📌 Kapsam & Proje Tanımı
- **Proje:** API Showcase (`api-showcase`)
- **Kök Dizin:** `C:\Users\canpo\OneDrive\Desktop\API APP`
- **Proje Amacı:** Geliştiriciler için 47+ kategoride 500'den fazla ücretsiz API'yi (Free APIs) listeleyen, arama, filtreleme, kategori ve servis detay sayfaları (SSG), TR/EN çoklu dil desteği, karanlık/aydınlık tema ve bot/scraper koruması sunan modern, yüksek performanslı web platformu.

---

## 🏛️ Merkezi DCM Yetenek & Kural Referansı (SSOT)

Bu projede çalışırken tüm temel kurallar ve uzmanlıklar aşağıdaki merkezi kütüphaneden okunur. Proje içinde gereksiz yerel skill klasörleri (`.codex`, `.agents/skills` vb.) barındırılmaz.

- **Merkezi Anayasa:** `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\MASTER_AGENT_CONSTITUTION.md`
- **Global Yetenekler:** `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\`

### Proje İhtiyacına Göre Devreye Alınacak Başlıca Global Yetenekler:
- **🎨 Frontend Master (UI/UX, Glassmorphism, Tailwind, Animasyonlar):**  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\frontend-design-master\SKILL.md`
- **🏗️ Backend Architect (Next.js App Router API Routes, Route Handlers, Proxy):**  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\backend-architect\SKILL.md`
- **🔍 SEO Specialist & Auditor (Programmatic SEO, Dynamic Metadata, Sitemap, JSON-LD):**  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\seo-specialist\SKILL.md`  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\performance-seo-auditor\SKILL.md`
- **🛡️ Security Auditor (Anti-Scraping, Bot Tespiti, Rate Limiting, Honeypot Trap, IP Blacklist):**  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\security-auditor\SKILL.md`
- **🌍 i18n Sync Validator (TR & EN Çoklu Dil Eşitliği ve Çeviri Bütünlüğü):**  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\i18n-sync-validator\SKILL.md`
- **🚀 Superpowers (Ampirik Doğrulama, Sıfır Tahmin, Kod Disiplini):**  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\superpowers\SKILL.md`
- **👁️ Web App & Visual QA (UI Bütünlüğü, Layout Taşma ve Kırılma Denetimi):**  
  ➔ `C:\Users\canpo\OneDrive\Desktop\GUIDELINES\skills\web-app-audit\SKILL.md`

---

## 🛠️ Doğrulanmış Teknoloji Yığını (Tech Stack)

- **Dil / Çalışma Zamanı:** TypeScript 5.x, Node.js 18+
- **Framework / Platform:** Next.js 15.5+ (App Router, SSG static generation & Server/Client Components)
- **UI & Stil:** Tailwind CSS 3.4+, PostCSS, Lucide React (`lucide-react`), Framer Motion (`framer-motion`), `clsx`, `tailwind-merge`
- **Tema Yönetimi:** `next-themes` (Dark / Light / System mode desteği)
- **Çoklu Dil (i18n):** `LanguageContext`, `data/translations.ts`, dynamic route `/en` ve `/en/service/[slug]`
- **Veri Kaynağı:** `src/data/apis.ts` (500+ statik ve dinamik doğrulanmış API listesi, 47 kategori)
- **Paket & Derleme Araçları:** npm, Next.js Compiler (SWC), PostCSS, Autoprefixer
- **Linter & Tip Kontrolü:** ESLint (`eslint-config-next`), TypeScript `tsc`

---

## 🔒 Güvenlik & Mimari Kuralları

1. **Anti-Scraping & Bot Koruması:**
   - `src/middleware.ts` ve `src/lib/security.ts` üzerinde tanımlı `BLOCKED_USER_AGENTS` (Python, Scrapy, Puppeteer, AI scraper botları vb.) ve `isIpBanned` kontrolleri korunmalıdır.
   - Hassas toplu veri çekme girişimleri için tuzak (honeypot) endpoint'i olan `/api/trap/v1/dump-all-apis` ve `banIp` mantığı muhafaza edilmelidir.
   - Harici linkler için `obfuscateUrl` / `deobfuscateUrl` ve proxy mekanizması üzerinden koruma sağlanır.
   - `X-Robots-Tag: noai, noimageai`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN` güvenlik başlıkları gönderilir.

2. **Sayfa Üretimi & SEO (SSG & ISR):**
   - 500+ servis detay sayfası (`/service/[slug]` ve `/en/service/[slug]`) ve 47 kategori sayfası (`/category/[id]`) Next.js `generateStaticParams` ile derleme anında statik olarak üretilir (SSG - 1070+ sayfa).
   - Dynamic metadata (`generateMetadata`), OpenGraph, `sitemap.ts`, `robots.ts` ve `manifest.ts` standartlarına tavizsiz uyulmalıdır.

3. **Veri & UI Bütünlüğü:**
   - Yeni API veya kategori eklenirken `src/data/apis.ts` içindeki tip şemalarına (`APICategory`, `APIItem`) kesinlikle sadık kalınmalıdır.
   - `CategoryGrid.tsx` ve `CategoryPageClient.tsx` renk/gradyan eşleştirmeleri senkronize tutulmalıdır.
   - Asla hassas API anahtarlarını, token'ları veya gizli verileri istemci tarafına (`NEXT_PUBLIC_` harici) veya commit'lere açığa çıkarma.

---

## ⚡ Doğrulama Komutları (Verification Commands)

Yapılan değişikliklerden sonra çalıştırılacak ampirik test ve build komutları:

```bash
# Geliştirme sunucusu
npm run dev

# Tip kontrolü ve statik üretim (SSG - 1070+ sayfa doğrulaması)
npm run build

# Kod biçimi ve lint denetimi
npm run lint
```
