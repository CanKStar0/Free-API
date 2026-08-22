export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  defaultValue?: string | number | boolean;
  description: {
    tr: string;
    en: string;
  };
  options?: { label: string; value: string }[];
}

export interface DeveloperTool {
  id: string;
  slug: string;
  name: {
    tr: string;
    en: string;
  };
  shortDescription: {
    tr: string;
    en: string;
  };
  fullDescription: {
    tr: string;
    en: string;
  };
  category: 'generator' | 'converter' | 'formatter' | 'security' | 'text';
  icon: string;
  badge?: string;
  httpMethod: 'GET' | 'POST';
  endpoint: string;
  parameters: ToolParameter[];
  defaultInput?: string;
  sampleRequest?: {
    method: 'GET' | 'POST';
    url: string;
    body?: any;
  };
  sampleResponse: any;
  features: {
    tr: string[];
    en: string[];
  };
  seoKeywords: {
    tr: string[];
    en: string[];
  };
}

export const DEVELOPER_TOOLS: DeveloperTool[] = [
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: {
      tr: 'UUID & GUID Üretici',
      en: 'UUID & GUID Generator',
    },
    shortDescription: {
      tr: 'Anında v4 ve v7 kriptografik UUID/GUID üretimi, toplu çıktı ve büyük/küçük harf formatlama.',
      en: 'Instantly generate v4 and v7 cryptographic UUIDs/GUIDs with batch export and case formatting.',
    },
    fullDescription: {
      tr: 'Yüksek performanslı, RFC 4122 ve RFC 9562 standartlarına tam uyumlu UUID v4 ve v7 üretici. İster tarayıcıda tek tıkla üretin ve kopyalayın, ister 0ms gecikmeli REST API endpointimiz ile uygulamanızda doğrudan kullanın.',
      en: 'High-performance, RFC 4122 and RFC 9562 compliant UUID v4 and v7 generator. Generate in the browser or integrate directly via our zero-latency REST API.',
    },
    category: 'generator',
    icon: 'Fingerprint',
    badge: 'v4 & v7',
    httpMethod: 'GET',
    endpoint: '/api/v1/tools/uuid',
    parameters: [
      {
        name: 'version',
        type: 'select',
        required: false,
        defaultValue: 'v4',
        description: { tr: 'UUID Versiyonu (v4 veya v7)', en: 'UUID Version (v4 or v7)' },
        options: [
          { label: 'UUID v4 (Rastgele)', value: 'v4' },
          { label: 'UUID v7 (Zaman Sıralı)', value: 'v7' },
        ],
      },
      {
        name: 'count',
        type: 'number',
        required: false,
        defaultValue: 1,
        description: { tr: 'Üretilecek UUID adedi (1-100)', en: 'Count of UUIDs to generate (1-100)' },
      },
      {
        name: 'uppercase',
        type: 'boolean',
        required: false,
        defaultValue: false,
        description: { tr: 'Büyük harf formatı', en: 'Uppercase format' },
      },
    ],
    sampleRequest: {
      method: 'GET',
      url: 'https://freeapi.website/api/v1/tools/uuid?version=v4&count=3',
    },
    sampleResponse: {
      status: 'success',
      version: 'v4',
      count: 3,
      data: [
        'a58e411b-3f2d-4bfb-9c76-35f992a2a0ef',
        'e84bb358-bf88-46db-b7ba-b7e61a9e8cb4',
        '6927bfdf-09f1-4db8-83aa-97157a3e8e19',
      ],
      timestamp: 1771771200000,
    },
    features: {
      tr: [
        'RFC 4122 (v4 Rastgele) ve RFC 9562 (v7 Zaman Sıralı) tam desteği',
        '1 ile 100 adet arası tek istekte toplu üretim',
        'Kriptografik güvenli (Crypto.randomUUID) çekirdek',
        'Büyük / Küçük harf ve tireli / tiresiz format seçenekleri',
      ],
      en: [
        'Full RFC 4122 (v4 Random) & RFC 9562 (v7 Time-ordered) support',
        'Batch generation from 1 to 100 in a single request',
        'Cryptographically secure (Crypto.randomUUID) engine',
        'Uppercase, lowercase, hyphenated formatting options',
      ],
    },
    seoKeywords: {
      tr: ['uuid üretici', 'guid generator', 'online uuid v4', 'uuid v7 üretme', 'ücretsiz uuid api'],
      en: ['uuid generator', 'guid generator', 'online uuid v4', 'uuid v7 generator', 'free uuid api'],
    },
  },
  {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: {
      tr: 'JSON Formatlayıcı & Validator',
      en: 'JSON Formatter & Validator',
    },
    shortDescription: {
      tr: 'JSON verilerini anında prettify, minify, alfabetik anahtar sıralama ve sözdizimi denetimi.',
      en: 'Instantly prettify, minify, sort keys alphabetically and validate JSON syntax errors.',
    },
    fullDescription: {
      tr: 'Geliştiriciler için hızlı JSON formatlayıcı ve doğrulayıcı. Hatalı JSON sözdizimini satır ve sütun bazında tespit eder, 2/4 boşluk girinti veya tek satır sıkıştırma (minify) uygular.',
      en: 'Ultra-fast JSON formatter and validator for developers. Identifies syntax errors with exact line/column indicators, applies 2/4 space indentation or minification.',
    },
    category: 'formatter',
    icon: 'Braces',
    badge: 'Prettify & Minify',
    httpMethod: 'POST',
    endpoint: '/api/v1/tools/json-format',
    parameters: [
      {
        name: 'indent',
        type: 'select',
        required: false,
        defaultValue: '2',
        description: { tr: 'Girinti tipi (2 boşluk, 4 boşluk veya minify)', en: 'Indent type (2 spaces, 4 spaces or minify)' },
        options: [
          { label: '2 Boşluk (Prettify)', value: '2' },
          { label: '4 Boşluk (Prettify)', value: '4' },
          { label: 'Minify (Sıkıştırılmış)', value: '0' },
        ],
      },
      {
        name: 'sortKeys',
        type: 'boolean',
        required: false,
        defaultValue: false,
        description: { tr: 'Anahtarları alfabetik sırala', en: 'Sort object keys alphabetically' },
      },
    ],
    defaultInput: '{"name":"FreeAPI","type":"gateway","features":["tools","ssg","proxy"],"active":true,"version":1}',
    sampleRequest: {
      method: 'POST',
      url: 'https://freeapi.website/api/v1/tools/json-format',
      body: {
        json: '{"name":"FreeAPI","type":"gateway"}',
        indent: 2,
        sortKeys: true,
      },
    },
    sampleResponse: {
      status: 'success',
      valid: true,
      formatted: '{\n  "name": "FreeAPI",\n  "type": "gateway"\n}',
      stats: {
        keysCount: 2,
        sizeBytes: 38,
        minifiedSize: 32,
      },
    },
    features: {
      tr: [
        'Anında JSON sözdizim ve hata konumu analizi',
        '2 boşluk, 4 boşluk ve Tab girintilendirme',
        'Tek tıkla Minify (Sıkıştırma) ve dosya boyutu kazanımı',
        'İç içe nesneler için alfabetik anahtar (key) sıralama',
      ],
      en: [
        'Instant JSON syntax error diagnostics with line/col reporting',
        '2 spaces, 4 spaces and Tab indentation',
        'One-click Minification with compression stats',
        'Deep alphabetical key sorting for nested structures',
      ],
    },
    seoKeywords: {
      tr: ['json formatlayıcı', 'json beautifier online', 'json validator', 'json minify online', 'ücretsiz json api'],
      en: ['json formatter', 'json beautifier', 'json validator', 'json minifier', 'free json api'],
    },
  },
  {
    id: 'base64-codec',
    slug: 'base64-codec',
    name: {
      tr: 'Base64 Kodlayıcı & Çözücü',
      en: 'Base64 Encoder & Decoder',
    },
    shortDescription: {
      tr: 'Metin ve ikili verileri Base64 formatına UTF-8 ve URL-Safe desteğiyle encode ve decode edin.',
      en: 'Encode and decode text strings with full UTF-8 Unicode and URL-safe Base64 support.',
    },
    fullDescription: {
      tr: 'Kusursuz UTF-8 ve Türkçe karakter destekli Base64 kodlama/çözme motoru. Standart RFC 4648 Base64 ve URL-Safe Base64 (+/ yerine -_ kullanımı) opsiyonlarıyla web ve API entegrasyonu için optimize edilmiştir.',
      en: 'Flawless Base64 encode and decode engine with complete UTF-8 Unicode support. Includes standard RFC 4648 and URL-Safe Base64 variants for modern web apps.',
    },
    category: 'converter',
    icon: 'Binary',
    badge: 'UTF-8 & URL-Safe',
    httpMethod: 'POST',
    endpoint: '/api/v1/tools/base64',
    parameters: [
      {
        name: 'action',
        type: 'select',
        required: true,
        defaultValue: 'encode',
        description: { tr: 'İşlem tipi (encode veya decode)', en: 'Operation type (encode or decode)' },
        options: [
          { label: 'Encode (Metinden Base64\'e)', value: 'encode' },
          { label: 'Decode (Base64\'ten Metne)', value: 'decode' },
        ],
      },
      {
        name: 'urlSafe',
        type: 'boolean',
        required: false,
        defaultValue: false,
        description: { tr: 'URL-Safe format (+ yerine -, / yerine _)', en: 'URL-Safe format (use - and _)' },
      },
    ],
    defaultInput: 'FreeAPI: En Hızlı Geliştirici Ağ Geçidi & Araç Kiti 🚀',
    sampleRequest: {
      method: 'POST',
      url: 'https://freeapi.website/api/v1/tools/base64',
      body: {
        text: 'Hello World',
        action: 'encode',
        urlSafe: false,
      },
    },
    sampleResponse: {
      status: 'success',
      action: 'encode',
      result: 'SGVsbG8gV29ybGQ=',
      inputLength: 11,
      outputLength: 16,
    },
    features: {
      tr: [
        'Tam UTF-8 ve uluslararası karakter kümesi desteği (Emoji ve Türkçe harfler bozulmaz)',
        'Standart RFC 4648 ve URL-Safe Base64 çıktı seçenekleri',
        'Tek tıkla Base64 Data URL (data:text/plain;base64,...) formatı',
        'Hızlı ve güvenli REST API entegrasyonu',
      ],
      en: [
        'Full UTF-8 Unicode support (no emoji or special character corruption)',
        'Standard RFC 4648 and URL-Safe variant outputs',
        'One-click Base64 Data URL generation',
        'Ultra-fast REST API integration',
      ],
    },
    seoKeywords: {
      tr: ['base64 encode', 'base64 decode', 'base64 çevirici', 'url safe base64', 'ücretsiz base64 api'],
      en: ['base64 encoder', 'base64 decoder', 'base64 convert', 'url safe base64', 'free base64 api'],
    },
  },
  {
    id: 'password-generator',
    slug: 'password-generator',
    name: {
      tr: 'Güvenli Şifre Üretici',
      en: 'Secure Password Generator',
    },
    shortDescription: {
      tr: 'Kriptografik güvenli, kırılması imkansız rastgele şifreler, PIN kodları ve entropy analizi.',
      en: 'Generate cryptographically strong random passwords, secure PINs and calculate entropy scores.',
    },
    fullDescription: {
      tr: 'Tarayıcıda veya API üzerinden Web Crypto API ile üretilen, tahmin edilemez ve kırılması imkansız şifre oluşturucu. Büyük/küçük harf, rakam, özel sembol ve benzer karakterleri (0, O, l, 1) filtreleme seçenekleri.',
      en: 'Generate cryptographically secure passwords and passphrases. Fully customizable character pools, disambiguation filters (exclude 0, O, l, 1) and instant Shannon entropy calculation.',
    },
    category: 'security',
    icon: 'KeyRound',
    badge: 'Crypto Secure',
    httpMethod: 'GET',
    endpoint: '/api/v1/tools/password',
    parameters: [
      {
        name: 'length',
        type: 'number',
        required: false,
        defaultValue: 16,
        description: { tr: 'Şifre uzunluğu (6-128 karakter)', en: 'Password length (6-128 chars)' },
      },
      {
        name: 'numbers',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: { tr: 'Rakam içersin (0-9)', en: 'Include numbers (0-9)' },
      },
      {
        name: 'symbols',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: { tr: 'Özel semboller içersin (!@#$%^&*)', en: 'Include special symbols (!@#$%^&*)' },
      },
      {
        name: 'excludeSimilar',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: { tr: 'Benzer karakterleri hariç tut (i, l, 1, L, o, 0, O)', en: 'Exclude similar characters (i, l, 1, L, o, 0, O)' },
      },
      {
        name: 'count',
        type: 'number',
        required: false,
        defaultValue: 1,
        description: { tr: 'Üretilecek şifre adedi (1-20)', en: 'Count of passwords (1-20)' },
      },
    ],
    sampleRequest: {
      method: 'GET',
      url: 'https://freeapi.website/api/v1/tools/password?length=20&symbols=true&count=1',
    },
    sampleResponse: {
      status: 'success',
      passwords: ['k8#M9$pW2!vR7@xT5&qZ'],
      strength: 'Very Strong',
      entropyBits: 128.5,
      charPoolSize: 72,
    },
    features: {
      tr: [
        'Kriptografik güvenli Web Crypto / Node.js crypto rastgelelik motoru',
        'Shannon Entropy ve Brute-Force kırılma süresi hesaplaması',
        'Kullanıcı dostu benzer karakter filtreleme (0/O/l/1 karışıklığına son)',
        'Toplu şifre üretimi ve tek tıkla güvenli kopyalama',
      ],
      en: [
        'Cryptographically secure Node.js crypto CSPRNG engine',
        'Shannon Entropy and brute-force resistance scoring',
        'Disambiguation filter for easily confused characters',
        'Batch password generation and one-click copy',
      ],
    },
    seoKeywords: {
      tr: ['şifre üretici', 'güvenli parola oluşturucu', 'random password generator', 'güçlü şifre yapıcı', 'şifre api'],
      en: ['password generator', 'secure password generator', 'random password', 'strong password maker', 'password api'],
    },
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    name: {
      tr: 'QR Kod Üretici (SVG & PNG)',
      en: 'QR Code Generator (SVG & PNG)',
    },
    shortDescription: {
      tr: 'Herhangi bir metin veya URL için anında vektörel SVG veya PNG QR kod oluşturun ve indirin.',
      en: 'Instantly generate crisp vector SVG or raster PNG QR codes for any URL, text or Wi-Fi data.',
    },
    fullDescription: {
      tr: 'Geliştiriciler ve tasarımcılar için anında vektörel SVG ve yüksek çözünürlüklü PNG QR kod motoru. Özelleştirilebilir renkler, hata düzeltme seviyeleri (L, M, Q, H) ve API üzerinden dinamik görsel teslimi.',
      en: 'High-speed vector SVG and PNG QR code generator. Fully customizable colors, error correction levels (L, M, Q, H), and dynamic image streaming via REST API.',
    },
    category: 'generator',
    icon: 'QrCode',
    badge: 'SVG & PNG',
    httpMethod: 'GET',
    endpoint: '/api/v1/tools/qr-code',
    parameters: [
      {
        name: 'text',
        type: 'string',
        required: true,
        defaultValue: 'https://freeapi.website',
        description: { tr: 'QR koda dönüştürülecek URL veya metin', en: 'URL or text to encode into QR code' },
      },
      {
        name: 'format',
        type: 'select',
        required: false,
        defaultValue: 'svg',
        description: { tr: 'Çıktı formatı (svg, png, dataurl, json)', en: 'Output format (svg, png, dataurl, json)' },
        options: [
          { label: 'Vektörel SVG', value: 'svg' },
          { label: 'Data URL (Base64)', value: 'dataurl' },
          { label: 'JSON Yanıtı', value: 'json' },
        ],
      },
      {
        name: 'size',
        type: 'number',
        required: false,
        defaultValue: 256,
        description: { tr: 'Görsel piksel boyutu (128-1024)', en: 'Image pixel size (128-1024)' },
      },
      {
        name: 'color',
        type: 'string',
        required: false,
        defaultValue: '#000000',
        description: { tr: 'QR kod ön plan rengi (Hex)', en: 'QR foreground hex color' },
      },
      {
        name: 'bgColor',
        type: 'string',
        required: false,
        defaultValue: '#ffffff',
        description: { tr: 'Arka plan rengi (Hex)', en: 'QR background hex color' },
      },
    ],
    defaultInput: 'https://freeapi.website',
    sampleRequest: {
      method: 'GET',
      url: 'https://freeapi.website/api/v1/tools/qr-code?text=https://freeapi.website&format=svg&size=300',
    },
    sampleResponse: {
      status: 'success',
      format: 'svg',
      dataUrl: 'data:image/svg+xml;utf8,...',
      svg: '<svg xmlns="http://www.w3.org/2000/svg"...></svg>',
    },
    features: {
      tr: [
        'Vektörel SVG (Kayıpsız ölçekleme) ve Data URL çıktı formatları',
        'Özel ön plan ve arka plan HEX renk desteği',
        'Dinamik REST API ile doğrudan <img> etiketi içerisinde çağrılabilirlik',
        'Hata düzeltme seviyeleri (L, M, Q, H) ile yıpranmaya dayanıklılık',
      ],
      en: [
        'Vector SVG (lossless scaling) and Base64 Data URL formats',
        'Custom hex foreground and background color options',
        'Direct <img> src embedding via dynamic REST API endpoint',
        'Robust error correction levels (L, M, Q, H)',
      ],
    },
    seoKeywords: {
      tr: ['qr kod oluşturucu', 'online qr code generator', 'svg qr kod yapıcı', 'ücretsiz qr kod api', 'qr kod dönüştürücü'],
      en: ['qr code generator', 'online qr generator', 'svg qr code maker', 'free qr code api', 'vector qr generator'],
    },
  },
  {
    id: 'markdown-to-html',
    slug: 'markdown-to-html',
    name: {
      tr: 'Markdown to HTML Dönüştürücü',
      en: 'Markdown to HTML Converter',
    },
    shortDescription: {
      tr: 'Markdown (GFM) metinlerini anında temiz HTML çıktısına, başlık haritasına (TOC) ve istatistiklere dönüştürün.',
      en: 'Convert GitHub Flavored Markdown (GFM) to clean sanitized HTML with table of contents and stats.',
    },
    fullDescription: {
      tr: 'GitHub Flavored Markdown (GFM) uyumlu hızlı ve güvenli Markdown parser. Tablolar, kod blokları, görev listeleri ve başlıkları anında temiz HTML çıktısına çevirir ve doküman başlık haritasını (TOC) çıkarır.',
      en: 'Fast, secure GitHub Flavored Markdown (GFM) compiler. Transforms tables, task lists, code blocks, and headings into semantic HTML with automated Table of Contents extraction.',
    },
    category: 'converter',
    icon: 'FileCode2',
    badge: 'GFM & TOC',
    httpMethod: 'POST',
    endpoint: '/api/v1/tools/markdown-to-html',
    parameters: [
      {
        name: 'gfm',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: { tr: 'GitHub Flavored Markdown kuralları (tablolar, strikethrough)', en: 'GitHub Flavored Markdown rules (tables, strikethrough)' },
      },
      {
        name: 'breaks',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: { tr: 'Satır sonlarını <br> olarak derle', en: 'Convert line breaks to <br>' },
      },
    ],
    defaultInput: '# FreeAPI Dev Tools 🚀\n\nModern ve ultra hızlı geliştirici araçları.\n\n## Özellikler\n- **Sıfır Gecikme:** 0ms yerel algoritmalar\n- **Açık Kaynak:** Ücretsiz REST API\n\n```json\n{\n  "status": "ready"\n}\n```',
    sampleRequest: {
      method: 'POST',
      url: 'https://freeapi.website/api/v1/tools/markdown-to-html',
      body: {
        markdown: '# Hello World\nThis is **bold** text.',
        gfm: true,
      },
    },
    sampleResponse: {
      status: 'success',
      html: '<h1>Hello World</h1>\n<p>This is <strong>bold</strong> text.</p>',
      headings: [{ level: 1, text: 'Hello World', slug: 'hello-world' }],
      stats: {
        words: 5,
        characters: 37,
        readingTimeMinutes: 1,
      },
    },
    features: {
      tr: [
        'GitHub Flavored Markdown (GFM) tam sözdizim desteği',
        'Otomatik başlık (H1-H6) tespiti ve içindekiler tablosu (TOC) oluşturma',
        'Kelime sayısı, karakter sayısı ve tahmini okuma süresi analizi',
        'Canlı HTML önizleme ve tek tıkla HTML kopyalama',
      ],
      en: [
        'Complete GitHub Flavored Markdown (GFM) syntax support',
        'Automated heading extraction and Table of Contents (TOC) builder',
        'Word count, character count and estimated reading time analysis',
        'Live HTML preview tab and one-click copy',
      ],
    },
    seoKeywords: {
      tr: ['markdown to html', 'markdown çevirici', 'online markdown parser', 'gfm html converter', 'markdown api'],
      en: ['markdown to html', 'markdown converter', 'online markdown parser', 'gfm to html converter', 'markdown api'],
    },
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: {
      tr: 'Hash & HMAC Hesaplayıcı',
      en: 'Hash & HMAC Generator',
    },
    shortDescription: {
      tr: 'MD5, SHA-1, SHA-256, SHA-512 ve gizli anahtarlı HMAC hash değerlerini tek ekranda hesaplayın.',
      en: 'Calculate MD5, SHA-1, SHA-256, SHA-512, and secret-keyed HMAC digests instantly in one place.',
    },
    fullDescription: {
      tr: 'Geliştiriciler ve güvenlik uzmanları için çoklu hash motoru. Herhangi bir metin girdisi için eşzamanlı olarak MD5, SHA-1, SHA-256, SHA-384, SHA-512 ve opsiyonel HMAC hash imzaları üretir.',
      en: 'Multi-algorithm hashing powerhouse. Simultaneously generates MD5, SHA-1, SHA-256, SHA-384, SHA-512 and HMAC digests with secret keys for signature verification.',
    },
    category: 'security',
    icon: 'ShieldCheck',
    badge: 'MD5 & SHA-256/512',
    httpMethod: 'POST',
    endpoint: '/api/v1/tools/hash',
    parameters: [
      {
        name: 'algorithm',
        type: 'select',
        required: false,
        defaultValue: 'all',
        description: { tr: 'Hash Algoritması', en: 'Hash Algorithm' },
        options: [
          { label: 'Tüm Algoritmalar (MD5, SHA-1, SHA-256, SHA-512)', value: 'all' },
          { label: 'SHA-256', value: 'sha256' },
          { label: 'SHA-512', value: 'sha512' },
          { label: 'MD5', value: 'md5' },
          { label: 'SHA-1', value: 'sha1' },
        ],
      },
      {
        name: 'secretKey',
        type: 'string',
        required: false,
        description: { tr: 'HMAC için gizli anahtar (Opsiyonel)', en: 'Secret key for HMAC generation (Optional)' },
      },
    ],
    defaultInput: 'FreeAPI Secure Hashing Engine',
    sampleRequest: {
      method: 'POST',
      url: 'https://freeapi.website/api/v1/tools/hash',
      body: {
        text: 'hello',
        algorithm: 'all',
      },
    },
    sampleResponse: {
      status: 'success',
      input: 'hello',
      hashes: {
        md5: '5d41402abc4b2a76b9719d911017c592',
        sha1: 'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        sha256: '2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
        sha512: '9b71d224bd62f3785d96d46ad3ea3d73319bf52872036511457a9d33c470e4a9',
      },
    },
    features: {
      tr: [
        'Eşzamanlı tüm popüler hash algoritmalarını (MD5, SHA-1, SHA-256, SHA-512) tek tıkla üretme',
        'Gizli anahtarlı HMAC (Hash-based Message Authentication Code) imzalama',
        'Kriptografik standartlara tam uygunluk',
        'REST API ile mikroservis entegrasyonu',
      ],
      en: [
        'Simultaneous generation across MD5, SHA-1, SHA-256, SHA-512',
        'HMAC secret-key signature generator',
        'Standard cryptographic compliance',
        'Ultra-fast REST API microservice ready',
      ],
    },
    seoKeywords: {
      tr: ['hash hesaplayıcı', 'sha256 generator', 'md5 hash bulucu', 'sha512 online', 'hmac üretici', 'ücretsiz hash api'],
      en: ['hash generator', 'sha256 generator', 'md5 calculator', 'sha512 online', 'hmac generator', 'free hash api'],
    },
  },
  {
    id: 'lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    name: {
      tr: 'Lorem Ipsum Sahte Metin Üretici',
      en: 'Lorem Ipsum Dummy Text Generator',
    },
    shortDescription: {
      tr: 'Tasarım ve prototipler için anında paragraf, cümle ve kelime bazlı Lorem Ipsum metinleri.',
      en: 'Generate paragraphs, sentences and words of classic Latin or Turkish dummy placeholder text.',
    },
    fullDescription: {
      tr: 'UI/UX tasarımcıları ve frontend geliştiricileri için özelleştirilebilir sahte metin üreticisi. Klasik Latince (Cicero) veya modern geliştirici varyantlarında paragraf, cümle, kelime ve HTML etiketli (<p>, <li>) çıktılar üretir.',
      en: 'Customizable dummy text generator for UI designers and developers. Outputs paragraphs, sentences, words, and HTML wrapped lists (<p>, <li>) with classic Latin or modern formats.',
    },
    category: 'text',
    icon: 'Type',
    badge: 'Multi Format',
    httpMethod: 'GET',
    endpoint: '/api/v1/tools/lorem-ipsum',
    parameters: [
      {
        name: 'type',
        type: 'select',
        required: false,
        defaultValue: 'paragraphs',
        description: { tr: 'Üretim birimi', en: 'Generation unit' },
        options: [
          { label: 'Paragraf', value: 'paragraphs' },
          { label: 'Cümle', value: 'sentences' },
          { label: 'Kelime', value: 'words' },
        ],
      },
      {
        name: 'count',
        type: 'number',
        required: false,
        defaultValue: 3,
        description: { tr: 'Üretilecek adet (1-50)', en: 'Quantity (1-50)' },
      },
      {
        name: 'asHtml',
        type: 'boolean',
        required: false,
        defaultValue: false,
        description: { tr: '<p> veya <li> HTML etiketleri ile sar', en: 'Wrap with <p> or <li> HTML tags' },
      },
      {
        name: 'startWithLorem',
        type: 'boolean',
        required: false,
        defaultValue: true,
        description: { tr: '"Lorem ipsum dolor sit amet..." ile başla', en: 'Start with "Lorem ipsum dolor sit amet..."' },
      },
    ],
    sampleRequest: {
      method: 'GET',
      url: 'https://freeapi.website/api/v1/tools/lorem-ipsum?type=paragraphs&count=2&asHtml=false',
    },
    sampleResponse: {
      status: 'success',
      type: 'paragraphs',
      count: 2,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...\n\nSed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
      stats: {
        paragraphs: 2,
        words: 118,
        characters: 780,
      },
    },
    features: {
      tr: [
        'Paragraf, cümle ve kelime sayısına göre hassas üretim',
        'Doğrudan web projelerine yapıştırmaya hazır HTML (<p>, <li>) formatlama',
        'Geliştirici prototip mock data gereksinimleri için REST API desteği',
        'Tek tıkla panoya kopyalama',
      ],
      en: [
        'Precise generation by paragraphs, sentences, or word counts',
        'Direct HTML-wrapped markup (<p>, <li>) for rapid prototyping',
        'REST API support for frontend mock data pipelines',
        'One-click clipboard copy',
      ],
    },
    seoKeywords: {
      tr: ['lorem ipsum üretici', 'sahte metin oluşturucu', 'dummy text generator', 'lorem ipsum api', 'örnek metin yapıcı'],
      en: ['lorem ipsum generator', 'dummy text generator', 'placeholder text', 'lorem ipsum api', 'sample text maker'],
    },
  },
  {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    name: {
      tr: 'Unix Timestamp & Zaman Dönüştürücü',
      en: 'Unix Timestamp & Date Converter',
    },
    shortDescription: {
      tr: 'Unix epoch (saniye/ms), ISO 8601, UTC ve yerel saat dilimleri arasında anında iki yönlü dönüştürme.',
      en: 'Convert seamlessly between Unix epoch timestamps (seconds/ms), ISO 8601, UTC and local timezones.',
    },
    fullDescription: {
      tr: 'Geliştiriciler için canlı Unix epoch saati ve kapsamlı tarih dönüştürme aracı. Milisaniye, saniye, ISO 8601, RFC 2822, göreli zaman (örn. 5 dakika önce) ve dünya saat dilimlerini anında hesaplar.',
      en: 'Live Unix epoch clock and bidirectional date conversion tool. Converts seconds, milliseconds, ISO 8601, RFC 2822, relative time phrases (e.g. 5 minutes ago) and global timezones.',
    },
    category: 'converter',
    icon: 'Clock',
    badge: 'Epoch & ISO 8601',
    httpMethod: 'GET',
    endpoint: '/api/v1/tools/timestamp',
    parameters: [
      {
        name: 'value',
        type: 'string',
        required: false,
        description: { tr: 'Unix timestamp (sn/ms) veya ISO tarih metni (Boş bırakılırsa şu an)', en: 'Unix timestamp or ISO date string (Leave blank for current time)' },
      },
    ],
    sampleRequest: {
      method: 'GET',
      url: 'https://freeapi.website/api/v1/tools/timestamp?value=1771771200',
    },
    sampleResponse: {
      status: 'success',
      timestampSeconds: 1771771200,
      timestampMilliseconds: 1771771200000,
      iso8601: '2026-02-22T14:40:00.000Z',
      utcString: 'Sun, 22 Feb 2026 14:40:00 GMT',
      localString: '22.02.2026 17:40:00 (GMT+3)',
      relativeTime: 'in 2 hours',
    },
    features: {
      tr: [
        'Canlı çalışan Unix Epoch sayacı (Saniye ve milisaniye)',
        'Unix süresinden ISO 8601, UTC ve yerel saate iki yönlü dönüştürme',
        'Göreli zaman hesaplama (örn: "3 gün önce", "5 dakika sonra")',
        'Tek tıkla geçerli timestamp kopyalama',
      ],
      en: [
        'Live ticking Unix Epoch clock (seconds and milliseconds)',
        'Bidirectional conversion between Unix timestamps and ISO 8601 / UTC',
        'Human-readable relative time calculation ("3 days ago", "in 5 minutes")',
        'One-click instant copy for active timestamp',
      ],
    },
    seoKeywords: {
      tr: ['unix timestamp dönüştürücü', 'epoch time çevirici', 'iso 8601 tarih çevirici', 'timestamp to date', 'zaman api'],
      en: ['unix timestamp converter', 'epoch converter', 'iso 8601 date converter', 'timestamp to date', 'time api'],
    },
  },
  {
    id: 'url-codec',
    slug: 'url-codec',
    name: {
      tr: 'URL Kodlayıcı & Çözücü',
      en: 'URL Encoder & Decoder',
    },
    shortDescription: {
      tr: 'URL bileşenlerini ve sorgu parametrelerini (Query String) encode, decode ve parse edin.',
      en: 'Encode, decode and parse complex URL strings, paths, and query string parameters.',
    },
    fullDescription: {
      tr: 'Web geliştiricileri için eksiksiz URL kodlama, çözme ve parametre ayrıştırma aracı. `encodeURIComponent` ve `decodeURIComponent` standartlarında güvenli URL formatlama ve URL bileşenlerini (host, path, query params) JSON tablosuna ayırma.',
      en: 'Comprehensive URL encoding, decoding, and query string parser. Complies with RFC 3986, breaks down URL components (protocol, host, pathname, query parameters) into structured JSON.',
    },
    category: 'converter',
    icon: 'Link2',
    badge: 'RFC 3986 & Query Parser',
    httpMethod: 'POST',
    endpoint: '/api/v1/tools/url-codec',
    parameters: [
      {
        name: 'action',
        type: 'select',
        required: true,
        defaultValue: 'encode',
        description: { tr: 'İşlem tipi (encode, decode veya parse)', en: 'Operation type (encode, decode, or parse)' },
        options: [
          { label: 'Encode (URL Kodla)', value: 'encode' },
          { label: 'Decode (URL Çöz)', value: 'decode' },
          { label: 'Parse (Parametreleri Ayrıştır)', value: 'parse' },
        ],
      },
    ],
    defaultInput: 'https://freeapi.website/category/tools?sort=popular&ref=twitter&utm_source=dev_feed#api-section',
    sampleRequest: {
      method: 'POST',
      url: 'https://freeapi.website/api/v1/tools/url-codec',
      body: {
        url: 'https://freeapi.website/search?q=türkçe api&category=tools',
        action: 'encode',
      },
    },
    sampleResponse: {
      status: 'success',
      action: 'encode',
      result: 'https%3A%2F%2Ffreeapi.website%2Fsearch%3Fq%3Dt%C3%BCrk%C3%A7e%20api%26category%3Dtools',
      parsed: {
        protocol: 'https:',
        host: 'freeapi.website',
        pathname: '/search',
        searchParams: {
          q: 'türkçe api',
          category: 'tools',
        },
      },
    },
    features: {
      tr: [
        'RFC 3986 tam uyumlu URL encode ve decode motoru',
        'Karmaşık Query String parametrelerini JSON anahtar-değer tablosuna ayrıştırma',
        'Özel karakterler ve Türkçe harfler için güvenli URI bileşeni dönüştürme',
        'REST API ile anında programatik URL işleme',
      ],
      en: [
        'RFC 3986 compliant URL encode and decode engine',
        'Complex Query String parser into structured JSON key-value pairs',
        'Safe URI component encoding for special and international characters',
        'REST API ready for automated backend URL parsing',
      ],
    },
    seoKeywords: {
      tr: ['url encode', 'url decode', 'url çevirici', 'query string parser', 'url kod çözücü', 'ücretsiz url api'],
      en: ['url encoder', 'url decoder', 'url parser', 'query string parser', 'url codec', 'free url api'],
    },
  },
];
