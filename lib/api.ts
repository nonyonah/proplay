// Base API URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

// API endpoints
export const API_ENDPOINTS = {
  fixtures: '/api/fixtures',
  liveScores: '/api/live-scores',
  predictions: '/api/predictions',
  follow: '/api/follow',
  preferences: '/api/preferences',
  wallet: '/api/wallet',
  cast: '/api/cast',
};

// Helper function to construct API URLs
export const getApiUrl = (endpoint: string) => `${API_BASE_URL}${endpoint}`;

// Fetch with error handling
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(getApiUrl(endpoint), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
