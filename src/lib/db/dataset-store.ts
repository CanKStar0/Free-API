import fs from 'fs';
import path from 'path';
import { ApiDataset, CacheSource } from '@/types/database';

// 1. Raw Dataset Memory Cache (Holds JSON documents in RAM)
const memoryCache = new Map<string, { dataset: ApiDataset; loadedAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes in RAM

// 2. Query Result Cache (Holds filtered, sorted, paginated query responses for instant <1ms returns)
const queryCache = new Map<string, { result: QueryDatasetResult; expiresAt: number }>();
const QUERY_CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutes query cache
const MAX_QUERY_CACHE_SIZE = 500;

const DATASETS_DIR = path.join(process.cwd(), 'database', 'datasets');

/**
 * Ensures the dataset directory exists
 */
function ensureDatasetDir(): void {
  if (!fs.existsSync(DATASETS_DIR)) {
    fs.mkdirSync(DATASETS_DIR, { recursive: true });
  }
}

/**
 * Checks if a dataset is ingested and exists locally
 */
export function hasLocalDataset(slug: string): boolean {
  if (memoryCache.has(slug)) return true;
  const filePath = path.join(DATASETS_DIR, `${slug}.json`);
  return fs.existsSync(filePath);
}

/**
 * Retrieves a full dataset by slug from Memory Cache or Disk
 */
export function getLocalDataset(slug: string): ApiDataset | null {
  const now = Date.now();
  const cached = memoryCache.get(slug);

  if (cached && (now - cached.loadedAt) < CACHE_TTL_MS) {
    return cached.dataset;
  }

  const filePath = path.join(DATASETS_DIR, `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const rawContent = fs.readFileSync(filePath, 'utf-8');
    const dataset = JSON.parse(rawContent) as ApiDataset;
    memoryCache.set(slug, { dataset, loadedAt: now });
    return dataset;
  } catch (error) {
    console.error(`[DatasetStore] Error reading dataset "${slug}":`, error);
    return null;
  }
}

export interface QueryDatasetOptions {
  search?: string;
  field?: string;
  value?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface QueryDatasetResult<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  source: CacheSource;
  latencyMs: number;
}

/**
 * High-performance querying, searching, filtering, and pagination over JSON dataset
 * Powered by 2-tier in-memory query cache (<1ms response time)
 */
export function queryLocalDataset<T = any>(slug: string, options: QueryDatasetOptions = {}): QueryDatasetResult<T> | null {
  const startTime = Date.now();

  // Tier 2: Check Hot Query Cache first
  const queryKey = `${slug}:${JSON.stringify(options)}`;
  const now = Date.now();
  const cachedQuery = queryCache.get(queryKey);

  if (cachedQuery && cachedQuery.expiresAt > now) {
    return {
      ...cachedQuery.result,
      latencyMs: Math.max(0, Date.now() - startTime),
    };
  }

  // Tier 1: Retrieve raw dataset from RAM
  const dataset = getLocalDataset(slug);

  if (!dataset || !Array.isArray(dataset.data_json)) {
    return null;
  }

  let items: any[] = dataset.data_json;

  // 1. Specific field match / filter
  if (options.field && options.value) {
    const targetField = options.field.toLowerCase();
    const targetValue = options.value.toLowerCase();

    items = items.filter((item) => {
      const val = item[targetField] ?? item[options.field!];
      if (val === undefined || val === null) return false;
      return String(val).toLowerCase().includes(targetValue);
    });
  }

  // 2. Global Full-text Search
  if (options.search && options.search.trim().length > 0) {
    const q = options.search.trim().toLowerCase();
    items = items.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(q);
    });
  }

  // 3. Sorting
  if (options.sortBy) {
    const sortKey = options.sortBy;
    const isAsc = options.order !== 'desc';

    items = [...items].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];

      if (valA === undefined || valA === null) return 1;
      if (valB === undefined || valB === null) return -1;

      if (typeof valA === 'number' && typeof valB === 'number') {
        return isAsc ? valA - valB : valB - valA;
      }

      const strA = String(valA).toLowerCase();
      const strB = String(valB).toLowerCase();
      return isAsc ? strA.localeCompare(strB) : strB.localeCompare(strA);
    });
  }

  const total = items.length;
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const totalPages = Math.ceil(total / limit);

  const startIndex = (page - 1) * limit;
  const paginatedData = items.slice(startIndex, startIndex + limit);

  const latencyMs = Math.max(1, Date.now() - startTime);

  const result: QueryDatasetResult<T> = {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages,
    source: 'local_dataset',
    latencyMs,
  };

  // Cache query result in Tier 2
  if (queryCache.size >= MAX_QUERY_CACHE_SIZE) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) queryCache.delete(firstKey);
  }
  queryCache.set(queryKey, { result, expiresAt: now + QUERY_CACHE_TTL_MS });

  return result;
}

/**
 * Saves or updates a dataset on disk and refreshes memory cache
 */
export function saveLocalDataset(dataset: ApiDataset): void {
  ensureDatasetDir();
  const filePath = path.join(DATASETS_DIR, `${dataset.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(dataset, null, 2), 'utf-8');
  memoryCache.set(dataset.slug, { dataset, loadedAt: Date.now() });
  queryCache.clear(); // Invalidate stale query cache
}

/**
 * Returns a list of all ingested dataset slugs available locally
 */
export function listIngestedSlugs(): string[] {
  ensureDatasetDir();
  try {
    const files = fs.readdirSync(DATASETS_DIR);
    return files
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace(/\.json$/, ''));
  } catch {
    return [];
  }
}
