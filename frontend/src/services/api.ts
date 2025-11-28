import type { Photo, PhotosResponse, EventsResponse, Stats } from '../types';

const API_BASE_URL = 'http://localhost:3000/api';

const withNoCache = (options: RequestInit = {}): RequestInit => ({
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    ...(options.headers || {}),
  },
  ...options,
});

// Photo Service
export const photoService = {
  // Upload multiple photos
  async upload(files: File[]): Promise<{ message: string; photos: Photo[] }> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('photos', file);
    });

    const response = await fetch(`${API_BASE_URL}/photos/upload`, withNoCache({
      method: 'POST',
      body: formData,
    }));

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  // Get all photos
  async getAll(status?: string): Promise<PhotosResponse> {
    const url = status 
      ? `${API_BASE_URL}/photos?status=${status}`
      : `${API_BASE_URL}/photos`;
    
    const response = await fetch(url, withNoCache());
    
    if (!response.ok) {
      throw new Error('Failed to fetch photos');
    }

    return response.json();
  },

  // Get single photo
  async getById(id: string): Promise<Photo> {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, withNoCache());
    
    if (!response.ok) {
      throw new Error('Failed to fetch photo');
    }

    return response.json();
  },

  // Update photo status
  async updateStatus(id: string, status: string): Promise<Photo> {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, withNoCache({
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }));

    if (!response.ok) {
      throw new Error('Failed to update photo');
    }

    return response.json();
  },

  // Delete photo
  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/photos/${id}`, withNoCache({
      method: 'DELETE',
    }));

    if (!response.ok) {
      throw new Error('Failed to delete photo');
    }

    return response.json();
  },
};

// Event Service
export const eventService = {
  // Get all events
  async getAll(photoId?: string, limit: number = 100): Promise<EventsResponse> {
    const params = new URLSearchParams();
    if (photoId) params.append('photoId', photoId);
    params.append('limit', limit.toString());

    const response = await fetch(`${API_BASE_URL}/events?${params}`, withNoCache());
    
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  },
};

// Stats Service
export const statsService = {
  // Get statistics
  async get(): Promise<Stats> {
    const response = await fetch(`${API_BASE_URL}/stats`, withNoCache());
    
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }

    return response.json();
  },
};

// Utility to get full image URL
export const getImageUrl = (path: string): string => {
  if (path.startsWith('http')) {
    return path;
  }
  return `http://localhost:3000${path}`;
};