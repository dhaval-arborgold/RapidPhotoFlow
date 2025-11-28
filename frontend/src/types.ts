export type PhotoStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Photo {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimetype: string;
  status: PhotoStatus;
  progress?: number; // 0-100
  error?: string;
  processedUrl?: string;
  metadata?: {
    dimensions: string;
    size: string;
    format: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  photoId: string;
  event: string;
  details: Record<string, any>;
  timestamp: string;
}

export interface PhotosResponse {
  photos: Photo[];
  total: number;
}

export interface EventsResponse {
  events: Event[];
  total: number;
}

export interface Stats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  totalEvents: number;
}