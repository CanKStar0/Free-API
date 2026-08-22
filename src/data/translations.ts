export type Language = 'tr' | 'en';

export interface TranslationDictionary {
  nav: {
    backToMain: string;
    home: string;
    explorer: string;
    categories: string;
    github: string;
    curatedEndpoints: string;
    directoryBadge: string;
    tools: string;
    dashboard: string;
    gateway: string;
  };
  auth: {
    signIn: string;
    signingIn: string;
    profile: string;
    myBookmarks: string;
    myStacks: string;
    signOut: string;
  };
  hero: {
    badge: string;
    titlePrefix: string;
    titleHighlight: string;
    subtitle: string;
    metricApis: string;
    metricCategories: string;
    metricFree: string;
    ctaButton: string;
  };
  banner: {
    liveGuide: string;
    text: string;
    badge: string;
  };
  explorer: {
    searchPlaceholder: string;
    allCategories: string;
    tabCategories: string;
    tabAllApis: string;
    tabRecommended: string;
    tabNoAuth: string;
    tabUnlimited: string;
    tabCors: string;
    tabNew: string;
    tabBookmarks: string;
    resultsPrefix: string;
    resultsBookmarks: string;
    resultsRecommended: string;
    resultsUnlimited: string;
    resultsCors: string;
    resultsNew: string;
    resultsAll: string;
    apisListed: string;
    noResultsText: string;
    clearFilters: string;
    categoryTitle: string;
    categorySubtitle: string;
    exploreCategory: string;
    recommendedLabel: string;
  };
  card: {
    recommended: string;
    https: string;
    cors: string;
    codeSnippet: string;
    closeCode: string;
    details: string;
    copied: string;
    copy: string;
    addToBookmarks: string;
    removeFromBookmarks: string;
    unlimited: string;
  };
  submitModal: {
    triggerBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    urlLabel: string;
    urlPlaceholder: string;
    categoryLabel: string;
    selectCategory: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    rateLimitLabel: string;
    rateLimitPlaceholder: string;
    rateLimitTypeLabel: string;
    rateLimitUnlimited: string;
    rateLimitCustom: string;
    rateLimitVariable: string;
    rateLimitValueLabel: string;
    rateLimitUnitLabel: string;
    unitSec: string;
    unitMin: string;
    unitHour: string;
    unitDay: string;
    unitMonth: string;
    tabWrite: string;
    tabPreview: string;
    previewBadge: string;
    charCount: string;
    noAuthCheckbox: string;
    emailLabel: string;
    emailPlaceholder: string;
    duplicateWarningTitle: string;
    duplicateWarningDesc: string;
    duplicateAlreadyExists: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    closeBtn: string;
  };
  categoryPage: {

    backToCategories: string;
    searchInCategory: string;
    categoryNumber: string;
    availableServices: string;
    noResults: string;
    clearSearch: string;
  };
  notFound: {
    title: string;
    desc: string;
    backHome: string;
    goBack: string;
  };
  categoryTitles: Record<string, { title: string; description: string }>;
}

export const translations: Record<Language, TranslationDictionary> = {
  tr: {
    nav: {
      backToMain: 'canpolatkaya.com',
      home: 'Ana Sayfa',
      explorer: 'API Explorer',
      categories: 'Kategoriler',
      github: 'GitHub',
      curatedEndpoints: '500+ Doğrulanmış API',
      directoryBadge: 'Dizin',
      tools: 'Araçlar',
      dashboard: 'Dashboard',
      gateway: 'Gateway',
    },
    auth: {
      signIn: 'Giriş Yap',
      signingIn: 'Bağlanıyor...',
      profile: 'Profilim',
      myBookmarks: 'Favorilerim',
      myStacks: 'Stacklerim',
      signOut: 'Çıkış Yap',
    },
    hero: {
      badge: 'GELİŞTİRİCİLER İÇİN API KATALOĞU',
      titlePrefix: 'Geliştiriciler İçin',
      titleHighlight: '500+ Ücretsiz API',
      subtitle: 'Hava durumundan kriptoya, yapay zekadan finansa yüzlerce ücretsiz API servisi. Tek tıkla cURL, JavaScript ve Python kod örneklerini kopyalayın.',
      metricApis: 'API Servisi',
      metricCategories: 'Kategori',
      metricFree: 'Ücretsiz & Doğrulanmış',
      ctaButton: "API'leri Keşfet",
    },
    banner: {
      liveGuide: 'CANLI REHBER:',
      text: "500+ Ücretsiz API ve anında kod örnekleri ile projelerinizi hızlandırın.",
      badge: 'GÜNCEL',
    },
    explorer: {
      searchPlaceholder: '500+ API içinde anında ara... (örn: OpenWeather, Binance, NASA, CoinGecko)',
      allCategories: 'Tüm Kategoriler',
      tabCategories: 'Kategoriler',
      tabAllApis: "Tüm API'ler",
      tabRecommended: 'Öne Çıkanlar',
      tabNoAuth: 'Kayıtsız (Zero-Auth)',
      tabUnlimited: 'Sınırsız Limit',
      tabCors: 'CORS Uyumlu',
      tabNew: 'Yeni Eklenenler',
      tabBookmarks: 'Favorilerim',
      resultsPrefix: 'Arama Sonuçları:',
      resultsBookmarks: 'Kaydettiğiniz Favori API’ler',
      resultsRecommended: 'Öne Çıkan Seçilmiş API Servisleri',
      resultsUnlimited: 'Sınırsız İstek Limitine Sahip API’ler',
      resultsCors: 'Tarayıcıdan Doğrudan Çağrılabilir (CORS Açık) API’ler',
      resultsNew: 'Yeni Eklenen API Servisleri',
      resultsAll: 'Tüm API Servisleri',
      apisListed: 'API listeleniyor',
      noResultsText: 'Aradığınız kriterlere uygun bir API bulunamadı.',
      clearFilters: 'Filtreleri Temizle',
      categoryTitle: 'Kategorilere Göre Keşfet',
      categorySubtitle: 'Kategori • API Listesi',
      exploreCategory: 'İncele',
      recommendedLabel: 'Önerilen:',
    },
    card: {
      recommended: 'Önerilen',
      https: 'HTTPS',
      cors: 'CORS',
      codeSnippet: 'Kod Örneği',
      closeCode: 'Kodu Kapat',
      details: 'Doküman',
      copied: 'Kopyalandı',
      copy: 'Kopyala',
      addToBookmarks: 'Favorilere Ekle',
      removeFromBookmarks: 'Favorilerden Çıkar',
      unlimited: 'Sınırsız',
    },
    submitModal: {
      triggerBtn: 'API Öner',
      modalTitle: 'Yeni Bir API Öner',
      modalSubtitle: 'Topluluğa faydalı olacağını düşündüğünüz ücretsiz bir API servisi ekleyin.',
      nameLabel: 'API Adı',
      namePlaceholder: 'Örn: OpenWeather, CoinGecko...',
      urlLabel: 'Dokümantasyon veya Endpoint URL',
      urlPlaceholder: 'https://...',
      categoryLabel: 'Kategori',
      selectCategory: 'Bir kategori seçin...',
      descriptionLabel: 'Kısa Açıklama (Ne İşe Yarar?)',
      descriptionPlaceholder: 'Servisin sunduğu veriler, özellikler ve kullanım alanı...',
      rateLimitLabel: 'Rate Limit (İstek Limiti)',
      rateLimitPlaceholder: 'Örn: Sınırsız, 1000 çağrı/gün...',
      rateLimitTypeLabel: 'Limit Tipi',
      rateLimitUnlimited: 'Sınırsız',
      rateLimitCustom: 'Belirli Limit',
      rateLimitVariable: 'Değişken',
      rateLimitValueLabel: 'İstek Sayısı',
      rateLimitUnitLabel: 'Zaman Birimi',
      unitSec: 'İstek / Saniye',
      unitMin: 'İstek / Dakika',
      unitHour: 'İstek / Saat',
      unitDay: 'İstek / Gün',
      unitMonth: 'İstek / Ay',
      tabWrite: 'Yaz & Düzenle',
      tabPreview: 'Kart Önizlemesi',
      previewBadge: 'CANLI KART ÖNİZLEMESİ',
      charCount: 'karakter',
      noAuthCheckbox: 'Bu API kayıt/key gerektirmeden çalışıyor (Zero-Auth)',
      emailLabel: 'İletişim E-postanız (Opsiyonel)',
      emailPlaceholder: 'ornek@domain.com',
      duplicateWarningTitle: 'Bu API Zaten Sistemde Kayıtlı!',
      duplicateWarningDesc: 'adlı servis zaten kataloğumuzda mevcut. Tekrar eklemenize gerek yoktur.',
      duplicateAlreadyExists: 'Zaten Mevcut',
      submitBtn: 'API Önerisini Gönder',
      submitting: 'Gönderiliyor...',
      successTitle: 'Öneriniz Başarıyla Alındı!',
      successDesc: 'Eklediğiniz API incelendikten sonra kataloğa dahil edilecektir. Katkınız için teşekkürler!',
      closeBtn: 'Kapat',
    },
    categoryPage: {

      backToCategories: 'Tüm Kategorilere Dön',
      searchInCategory: 'Bu kategoride ara...',
      categoryNumber: 'KATEGORİ',
      availableServices: 'Kayıtlı Servisler',
      noResults: 'Bu kategoride aradığınız kriterlere uygun API bulunamadı.',
      clearSearch: 'Aramayı Temizle',
    },
    notFound: {
      title: 'API veya Kategori Bulunamadı',
      desc: 'Aradığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir.',
      backHome: 'Ana Sayfaya Dön',
      goBack: 'Geri Dön',
    },
    categoryTitles: {
      weather: { title: 'Hava Durumu ve İklim', description: 'Hava durumu tahminleri, iklim verileri ve hava kalitesi API’leri' },
      crypto: { title: 'Kripto Para ve Blockchain', description: 'Kripto para fiyatları, zincir üstü veriler ve Web3 API’leri' },
      gaming: { title: 'Oyun ve Eğlence', description: 'Oyun veritabanları, popüler oyun API’leri ve istatistikler' },
      maps: { title: 'Harita ve Konum', description: 'Harita servisleri, coğrafi kodlama ve IP konum API’leri' },
      social: { title: 'Sosyal Medya ve İletişim', description: 'Sosyal ağlar, mesajlaşma ve topluluk API’leri' },
      movies: { title: 'Film, Dizi ve Medya', description: 'Sinema, televizyon, fragman ve film puanlama veritabanları' },
      music: { title: 'Müzik ve Ses', description: 'Müzik akışı, şarkı sözleri, sanatçı ve ses analizi API’leri' },
      news: { title: 'Haber ve Medya', description: 'Güncel haber akışları, basın bültenleri ve RSS beslemeleri' },
      finance: { title: 'Finans ve Borsa', description: 'Hisse senetleri, döviz kurları ve küresel piyasa verileri' },
      developer: { title: 'Geliştirici Araçları', description: 'Git servisleri, kod derleyiciler, mock API ve yardımcı araçlar' },
      education: { title: 'Eğitim ve Akademik', description: 'Üniversiteler, kütüphaneler, bilimsel makaleler ve ders kaynakları' },
      health: { title: 'Sağlık ve Tıp', description: 'Tıbbi veriler, ilaç rehberleri ve besin değeri API’leri' },
      food: { title: 'Yemek ve Tarifler', description: 'Yemek tarifleri, restoran menüleri ve beslenme veritabanları' },
      space: { title: 'Uzay ve Astronomi', description: 'NASA verileri, uydu konumları ve gezegen gözlem API’leri' },
      sports: { title: 'Spor ve Skorlar', description: 'Futbol, basketbol, F1 ve küresel liglerin canlı skorları' },
      random: { title: 'Rastgele & Eğlence', description: 'Rastgele veriler, şakalar, test bilgileri ve eğlenceli servisler' },
      animals: { title: 'Hayvanlar ve Doğa', description: 'Hayvan türleri, yaban hayatı ve biyolojik sınıflandırma verileri' },
      anime: { title: 'Anime ve Manga', description: 'Anime serileri, manga katalogları ve karakter veritabanları' },
      art: { title: 'Sanat ve Tasarım', description: 'Müzeler, sanat galerileri, renk paletleri ve tasarım kütüphaneleri' },
      books: { title: 'Kitap ve Edebiyat', description: 'Kütüphane katalogları, yazar bilgileri ve kitap özetleri' },
      calendar: { title: 'Takvim ve Tatiller', description: 'Resmi tatiller, dini günler ve zaman dilimi dönüşümleri' },
      chat: { title: 'Sohbet ve Botlar', description: 'Discord, Telegram ve yapay zeka sohbet botları için API’ler' },
      cloud: { title: 'Bulut ve Sunucu', description: 'Sunucu durumu, bulut servisleri ve altyapı API’leri' },
      email: { title: 'E-Posta Servisleri', description: 'E-posta doğrulama, geçici posta ve bülten gönderim API’leri' },
      environment: { title: 'Çevre ve Doğa', description: 'Karbon ayak izi, orman yangınları ve ekolojik göstergeler' },
      government: { title: 'Devlet ve Kamu Verileri', description: 'Açık veri portalları, nüfus istatistikleri ve kamu kayıtları' },
      iot: { title: 'Nesnelerin İnterneti (IoT)', description: 'Sensör verileri, akıllı cihazlar ve donanım kontrol API’leri' },
      network: { title: 'Ağ ve Protokoller', description: 'DNS, IP sorgulama, ping ve ağ analizi araçları' },
      jobs: { title: 'Kariyer ve İş İlanları', description: 'İş arama, maaş istatistikleri ve kariyer platformları verileri' },
      math: { title: 'Matematik ve Hesaplama', description: 'Karmaşık formüller, sayı teorisi ve matematiksel çözüm API’leri' },
      payment: { title: 'Ödeme ve Bankacılık', description: 'Fintech entegrasyonları, sanal POS ve faturalama servisleri' },
      photos: { title: 'Fotoğraf ve Görsel', description: 'Ücretsiz stok fotoğraflar, resim arama ve görsel manipülasyon' },
      fun: { title: 'Eğlence ve Mizah', description: 'Meme veritabanları, şakalar ve eğlenceli popüler kültür içerikleri' },
      transport: { title: 'Ulaşım ve Seyahat', description: 'Toplu taşıma, uçuş takibi, tren saatleri ve rota API’leri' },
      url: { title: 'URL ve Link Araçları', description: 'Link kısaltma, URL çözümleme ve tıklama analitiği servisleri' },
      video: { title: 'Video ve Canlı Yayın', description: 'Video barındırma, akış servisleri ve canlı yayın altyapıları' },
      security: { title: 'Güvenlik ve Tehdit İstihbaratı', description: 'Zafiyet tarama, siber güvenlik tehditleri ve SSL/TLS kontrolleri' },
      auth: { title: 'Kimlik Doğrulama ve Güvenlik', description: 'OAuth sağlayıcıları, 2FA/MFA servisleri ve şifreleme araçları' },
      nlp: { title: 'Doğal Dil İşleme (NLP)', description: 'Metin analizi, duygu analizi, özet çıkarma ve çeviri modelleri' },
      ml: { title: 'Makine Öğrenimi ve Yapay Zeka', description: 'Görüntü tanıma, sınıflandırma ve yapay zeka model çıkarım API’leri' },
      validation: { title: 'Veri Doğrulama ve Sanitizasyon', description: 'E-posta, telefon, TC kimlik ve veri doğrulama yardımcıları' },
      ecommerce: { title: 'E-Ticaret ve Ürünler', description: 'Ürün katalogları, fiyat karşılaştırma ve sanal mağaza servisleri' },
      cicd: { title: 'CI/CD ve DevOps', description: 'Derleme otomasyonu, dağıtım boru hatları ve konteyner yönetimi' },
      patents: { title: 'Patent ve Fikri Mülkiyet', description: 'Küresel patent kayıtları, marka tescilleri ve telif verileri' },
      shipping: { title: 'Kargo ve Lojistik', description: 'Paket takibi, kargo ücreti hesaplama ve taşıma rotaları' },
      phone: { title: 'Telefon ve SMS Servisleri', description: 'SMS gönderimi, numara doğrulama ve arama altyapıları' },
    },
  },
  en: {
    nav: {
      backToMain: 'canpolatkaya.com',
      home: 'Home',
      explorer: 'API Explorer',
      categories: 'Categories',
      github: 'GitHub',
      curatedEndpoints: '500+ Verified APIs',
      directoryBadge: 'Directory',
      tools: 'Dev Tools',
      dashboard: 'Dashboard',
      gateway: 'Gateway',
    },
    auth: {
      signIn: 'Sign In',
      signingIn: 'Connecting...',
      profile: 'My Profile',
      myBookmarks: 'Bookmarks',
      myStacks: 'My Stacks',
      signOut: 'Sign Out',
    },
    hero: {
      badge: 'PUBLIC & FREE API DIRECTORY FOR DEVELOPERS',
      titlePrefix: 'Curated Directory of',
      titleHighlight: '500+ Free & Public APIs',
      subtitle: 'From weather and crypto to AI and finance. Verified public API endpoints with instant one-click cURL, JavaScript, and Python code snippets.',
      metricApis: 'API Services',
      metricCategories: 'Categories',
      metricFree: '100% Free & Verified',
      ctaButton: 'Explore Directory',
    },
    banner: {
      liveGuide: 'LIVE DIRECTORY:',
      text: 'Supercharge your builds with 500+ free public APIs and instant code snippets.',
      badge: 'UP-TO-DATE',
    },
    explorer: {
      searchPlaceholder: 'Search 500+ APIs instantly... (e.g. OpenWeather, Binance, NASA, CoinGecko)',
      allCategories: 'All Categories',
      tabCategories: 'Categories',
      tabAllApis: 'All APIs',
      tabRecommended: 'Featured',
      tabNoAuth: 'Zero-Auth',
      tabUnlimited: 'Unlimited Limit',
      tabCors: 'CORS Enabled',
      tabNew: 'Newly Added',
      tabBookmarks: 'My Bookmarks',
      resultsPrefix: 'Search Results:',
      resultsBookmarks: 'Your Saved Favorite APIs',
      resultsRecommended: 'Curated & Featured API Services',
      resultsUnlimited: 'APIs with Unlimited Request Allowance',
      resultsCors: 'Browser-Friendly APIs (CORS Enabled)',
      resultsNew: 'Newly Added API Endpoints',
      resultsAll: 'All Public API Services',
      apisListed: 'APIs listed',
      noResultsText: 'No APIs found matching your search criteria.',
      clearFilters: 'Clear Filters',
      categoryTitle: 'Explore by Category',
      categorySubtitle: 'Categories • API Catalog',
      exploreCategory: 'Explore',
      recommendedLabel: 'Featured:',
    },
    card: {
      recommended: 'Featured',
      https: 'HTTPS',
      cors: 'CORS',
      codeSnippet: 'Code Snippet',
      closeCode: 'Hide Code',
      details: 'Docs',
      copied: 'Copied',
      copy: 'Copy',
      addToBookmarks: 'Add to Bookmarks',
      removeFromBookmarks: 'Remove from Bookmarks',
      unlimited: 'Unlimited',
    },
    submitModal: {
      triggerBtn: 'Submit API',
      modalTitle: 'Submit a Public API',
      modalSubtitle: 'Share a free or open developer API endpoint to be indexed in the global catalog.',
      nameLabel: 'API Name',
      namePlaceholder: 'e.g. OpenWeather, CoinGecko...',
      urlLabel: 'Docs or Endpoint URL',
      urlPlaceholder: 'https://...',
      categoryLabel: 'Category',
      selectCategory: 'Select a category...',
      descriptionLabel: 'Description (What does it do?)',
      descriptionPlaceholder: 'What endpoints, datasets and functionality does it provide...',
      rateLimitLabel: 'Rate Limit',
      rateLimitPlaceholder: 'e.g. Unlimited, 1000 req/day...',
      rateLimitTypeLabel: 'Limit Type',
      rateLimitUnlimited: 'Unlimited',
      rateLimitCustom: 'Custom Limit',
      rateLimitVariable: 'Variable',
      rateLimitValueLabel: 'Request Count',
      rateLimitUnitLabel: 'Time Unit',
      unitSec: 'req / sec',
      unitMin: 'req / min',
      unitHour: 'req / hour',
      unitDay: 'req / day',
      unitMonth: 'req / month',
      tabWrite: 'Write & Edit',
      tabPreview: 'Card Preview',
      previewBadge: 'LIVE CARD PREVIEW',
      charCount: 'chars',
      noAuthCheckbox: 'Zero-Auth (Works with zero API key / no registration)',
      emailLabel: 'Contact Email (Optional)',
      emailPlaceholder: 'you@domain.com',
      duplicateWarningTitle: 'API Already Indexed in Directory!',
      duplicateWarningDesc: 'is already listed in our catalog. There is no need to submit it again.',
      duplicateAlreadyExists: 'Already Listed',
      submitBtn: 'Submit API for Review',
      submitting: 'Submitting...',
      successTitle: 'Submission Received!',
      successDesc: 'Thank you! Your proposed API has been queued for verification and directory indexing.',
      closeBtn: 'Close',
    },
    categoryPage: {

      backToCategories: 'Back to All Categories',
      searchInCategory: 'Search in this category...',
      categoryNumber: 'CATEGORY',
      availableServices: 'Available Endpoints',
      noResults: 'No APIs found in this category matching your search.',
      clearSearch: 'Clear Search',
    },
    notFound: {
      title: 'API or Category Not Found',
      desc: 'The page you are looking for might have been removed, renamed, or is temporarily unavailable.',
      backHome: 'Back to Home',
      goBack: 'Go Back',
    },
    categoryTitles: {
      weather: { title: 'Weather & Climate', description: 'Weather forecasts, historical climate data, and air quality APIs' },
      crypto: { title: 'Cryptocurrency & Web3', description: 'Live crypto prices, blockchain indexing, and decentralized finance' },
      gaming: { title: 'Gaming & Entertainment', description: 'Video game databases, player stats, and trivia game services' },
      maps: { title: 'Maps & Geolocation', description: 'Map rendering, geocoding, reverse geocoding, and IP lookup APIs' },
      social: { title: 'Social & Communication', description: 'Social network APIs, messaging protocols, and community platforms' },
      movies: { title: 'Movies & Media', description: 'Cinematic metadata, TV series guides, ratings, and streaming information' },
      music: { title: 'Music & Audio', description: 'Audio streaming, song lyrics, artist discography, and acoustic analysis' },
      news: { title: 'News & RSS Feeds', description: 'Global news aggregators, breaking alerts, and real-time press feeds' },
      finance: { title: 'Finance & Stock Market', description: 'Equities, foreign exchange rates, commodities, and market indices' },
      developer: { title: 'Developer Tools', description: 'Git utilities, cloud compilers, mock data generators, and dev tooling' },
      education: { title: 'Education & Science', description: 'University directories, academic journals, and scientific datasets' },
      health: { title: 'Healthcare & Medicine', description: 'Pharmaceutical databases, clinical information, and nutrition lookup' },
      food: { title: 'Food & Recipes', description: 'Culinary recipes, restaurant menus, and dietary calorie databases' },
      space: { title: 'Space & Astronomy', description: 'NASA planetary datasets, satellite tracking, and astronomical events' },
      sports: { title: 'Sports & Live Scores', description: 'Football, basketball, Formula 1, and global athletic statistics' },
      random: { title: 'Random & Fun Data', description: 'Random facts, jokes, test payloads, and entertainment endpoints' },
      animals: { title: 'Animals & Wildlife', description: 'Species classifications, wildlife observation, and biology records' },
      anime: { title: 'Anime & Manga', description: 'Anime series catalogs, character databases, and manga volumes' },
      art: { title: 'Art & Design', description: 'Museum archives, color palettes, vector assets, and design libraries' },
      books: { title: 'Books & Literature', description: 'Library catalogs, author bibliographies, and literary summaries' },
      calendar: { title: 'Calendar & Holidays', description: 'Public holidays, religious observances, and timezone transformations' },
      chat: { title: 'Chat & Bot Frameworks', description: 'Discord, Telegram, and conversational AI endpoints' },
      cloud: { title: 'Cloud & Infrastructure', description: 'Server monitoring, cloud storage, and deployment utilities' },
      email: { title: 'Email Services', description: 'Email address verification, disposable inboxes, and newsletter APIs' },
      environment: { title: 'Environment & Earth', description: 'Carbon footprint calculators, wildfire sensors, and ecological alerts' },
      government: { title: 'Government & Open Data', description: 'Public records, demographic census figures, and civic datasets' },
      iot: { title: 'Internet of Things (IoT)', description: 'Sensor telemetry, smart home devices, and embedded hardware APIs' },
      network: { title: 'Networking & Protocols', description: 'DNS lookup, IP geolocation, ping, and network analytics tooling' },
      jobs: { title: 'Jobs & Careers', description: 'Job boards, tech hiring indices, salary ranges, and career endpoints' },
      math: { title: 'Mathematics & Compute', description: 'Calculus calculators, number theory, and scientific mathematical solvers' },
      payment: { title: 'Payments & Fintech', description: 'Payment gateways, virtual POS, invoicing, and open banking feeds' },
      photos: { title: 'Photography & Stock Media', description: 'Royalty-free photography, visual image search, and asset banks' },
      fun: { title: 'Humor & Pop Culture', description: 'Meme generation, jokes, trivia, and viral pop culture APIs' },
      transport: { title: 'Transportation & Transit', description: 'Public transit, flight radar, train timetables, and navigation APIs' },
      url: { title: 'URL & Link Shorteners', description: 'Link shortening, redirection unwrapping, and clickstream analytics' },
      video: { title: 'Video & Live Streaming', description: 'Video hosting, media encoding, and live broadcasting infrastructure' },
      security: { title: 'Cybersecurity & Threat Intel', description: 'Vulnerability scanners, breach databases, and TLS/SSL verification' },
      auth: { title: 'Authentication & IAM', description: 'OAuth2 providers, 2FA/MFA protocols, and cryptography utilities' },
      nlp: { title: 'Natural Language Processing (NLP)', description: 'Text analysis, sentiment classification, entity extraction, and translation' },
      ml: { title: 'Machine Learning & AI', description: 'Computer vision, classification, and neural model inference endpoints' },
      validation: { title: 'Data Validation & Sanitization', description: 'Email verification, phone formatting, syntax checks, and data cleaning' },
      ecommerce: { title: 'E-Commerce & Retail', description: 'Product feeds, price comparison, inventory trackers, and retail APIs' },
      cicd: { title: 'CI/CD & DevOps Automation', description: 'Build runners, deployment pipelines, and container registry tooling' },
      patents: { title: 'Patents & Intellectual Property', description: 'Global patent registries, trademark filings, and copyright databases' },
      shipping: { title: 'Shipping & Parcel Logistics', description: 'Parcel tracking, freight estimation, and logistics routing APIs' },
      phone: { title: 'Telephony & SMS Services', description: 'SMS delivery, phone number formatting, and carrier lookup endpoints' },
    },
  },
};
