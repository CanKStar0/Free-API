// ============================================================================
// FreeAPI Database & Gateway TypeScript Definitions
// ============================================================================

export type UserRole = 'developer' | 'admin';
export type UserTier = 'free' | 'pro' | 'enterprise';
export type ApiKeyStatus = 'active' | 'revoked' | 'rate_limited';
export type DatasetStatus = 'syncing' | 'ready' | 'error' | 'deprecated';
export type CacheSource = 'local_dataset' | 'redis_cache' | 'upstream_proxy' | 'upstream_synced';

export interface User {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  role: UserRole;
  tier: UserTier;
  monthly_request_limit: number;
  is_banned: boolean;
  created_at: string;
  updated_at: string;
}

export interface ApiKey {
  id: string;
  user_id: string;
  key_name: string;
  key_prefix: string;
  key_hash: string;
  status: ApiKeyStatus;
  rate_limit_per_min: number;
  monthly_limit: number;
  total_requests_count: number;
  monthly_requests_count: number;
  last_used_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatasetMetadata {
  description?: string;
  version?: string;
  license?: string;
  homepage?: string;
  primaryKey?: string;
  searchableFields?: string[];
  filterFields?: string[];
  totalBytes?: number;
  sizeFormatted?: string;
  rateLimitInfo?: string;
}

export interface ApiDataset<T = any> {
  id: string;
  slug: string;
  category_id: string;
  name: string;
  source_url: string;
  is_static: boolean;
  version: string;
  record_count: number;
  data_json: T[];
  metadata_json: DatasetMetadata;
  status: DatasetStatus;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface ApiUsageLog {
  id: string;
  api_key_id?: string | null;
  user_id?: string | null;
  service_slug: string;
  endpoint_path: string;
  method: string;
  status_code: number;
  latency_ms: number;
  is_cached: boolean;
  cache_source: CacheSource;
  ip_hash?: string | null;
  user_agent?: string | null;
  created_at: string;
}

export interface GatewayResponse<T = any> {
  success: boolean;
  gateway: string;
  source: CacheSource;
  service: string;
  latency_ms: number;
  timestamp: string;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  data?: T;
  error?: string;
}

// ============================================================================
// Webhooks & Event-Driven Engine Types
// ============================================================================

export type WebhookEventType = 'dataset.updated' | 'threshold.alert' | 'item.added' | 'test.ping';

export interface WebhookCondition {
  field: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'contains';
  value: any;
  targetKey?: string; // e.g. 'bitcoin' or 'USD'
}

export interface WebhookSubscription {
  id: string;
  user_id: string;
  name: string;
  dataset_slug: string; // specific slug or '*' for all
  event_type: WebhookEventType;
  condition?: WebhookCondition | null;
  target_url: string;
  secret: string; // HMAC secret 'whsec_...'
  is_active: boolean;
  total_deliveries: number;
  last_triggered_at?: string | null;
  last_status_code?: number | null;
  failure_count: number;
  created_at: string;
  updated_at: string;
}

export interface WebhookDeliveryLog {
  id: string;
  subscription_id: string;
  event_type: WebhookEventType;
  payload_json: any;
  target_url: string;
  status_code?: number;
  latency_ms: number;
  success: boolean;
  error?: string | null;
  delivered_at: string;
}

export interface WebhookEventPayload<T = any> {
  id: string;
  event: WebhookEventType;
  dataset: string;
  timestamp: number;
  data: T;
  meta: {
    source: string;
    version: string;
  };
}
