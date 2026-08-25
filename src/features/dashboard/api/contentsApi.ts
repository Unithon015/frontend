import axios from 'axios';

const dashboardApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

dashboardApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface ContentAsset {
  id: string;
  content_type: 'IMAGE' | 'VIDEO' | 'TEXT';
  original_filename: string;
  mime_type: string;
  byte_size: number;
  download_url: string;
}

export interface Content {
  id: string;
  title: string;
  caption_text: string | null;
  status: 'QUEUED' | 'PROCESSING' | 'DONE' | 'FAILED';
  assets: ContentAsset[];
  created_at: string;
}

export async function getContent(contentId: string): Promise<Content> {
  const { data } = await dashboardApi.get<Content>(`/contents/${contentId}`);
  return data;
}

export async function createContent(file: File | null, text: string): Promise<Content> {
  const formData = new FormData();
  if (file) formData.append('file', file);
  formData.append('text', text);

  const { data } = await dashboardApi.post<Content>('/contents', formData);
  return data;
}

export type AnalysisStatus = 'QUEUED' | 'ANALYZING' | 'COMPLETED' | 'FAILED';

export interface Evidence {
  id: string;
  layer: string;
  title: string;
  source_url: string;
  excerpt: string;
  provider: string | null;
}

export interface Finding {
  id: string;
  type: string[];
  category_code: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  signal_type: string;
  reason: string;
  excerpt: string;
  asset_id: string | null;
  start_ms: number | null;
  end_ms: number | null;
  evidences: Evidence[];
}

export interface Analysis {
  id: string;
  type: string[];
  status: AnalysisStatus;
  current_step: string;
  progress_percent: number;
  error_message: string | null;
  started_at: string;
  completed_at: string | null;
  findings: Finding[];
}

export async function getAnalysis(contentId: string): Promise<Analysis> {
  const { data } = await dashboardApi.get<Analysis>(`/contents/${contentId}/analysis`);
  return data;
}

export interface ContentSummary {
  id: string;
  title: string;
  status: 'QUEUED' | 'ANALYZING' | 'COMPLETED' | 'FAILED';
  pending_findings_count: number;
  completed_at: string | null;
  created_at: string;
}

export async function getMyContents(limit = 20): Promise<ContentSummary[]> {
  const { data } = await dashboardApi.get<{ items: ContentSummary[] }>('/contents/me', {
    params: { limit },
  });
  return data.items;
}
