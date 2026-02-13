import type {
  LastFmTopArtistsResponse,
  LastFmTopTracksResponse,
  LastFmUserInfo,
  TimePeriod,
} from '../types';

const API_BASE = 'https://ws.audioscrobbler.com/2.0/';
const API_KEY = import.meta.env.VITE_LASTFM_API_KEY || 'YOUR_API_KEY';

// Simple rate limiter: max 5 requests per second
let lastRequestTime = 0;
const MIN_INTERVAL = 200; // 1000ms / 5 = 200ms between requests

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const elapsed = now - lastRequestTime;
  if (elapsed < MIN_INTERVAL) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL - elapsed));
  }
  lastRequestTime = Date.now();
  return fetch(url);
}

function buildUrl(method: string, params: Record<string, string>): string {
  const searchParams = new URLSearchParams({
    method,
    api_key: API_KEY,
    format: 'json',
    ...params,
  });
  return `${API_BASE}?${searchParams.toString()}`;
}

export async function getUserInfo(username: string): Promise<LastFmUserInfo> {
  const url = buildUrl('user.getinfo', { user: username });
  const res = await rateLimitedFetch(url);
  if (!res.ok) throw new Error(`Last.fm API error: ${res.status}`);
  return res.json();
}

export async function getTopArtists(
  username: string,
  period: TimePeriod = 'overall',
  limit = 10
): Promise<LastFmTopArtistsResponse> {
  const url = buildUrl('user.gettopartists', {
    user: username,
    period,
    limit: limit.toString(),
  });
  const res = await rateLimitedFetch(url);
  if (!res.ok) throw new Error(`Last.fm API error: ${res.status}`);
  return res.json();
}

export async function getTopTracks(
  username: string,
  period: TimePeriod = 'overall',
  limit = 10
): Promise<LastFmTopTracksResponse> {
  const url = buildUrl('user.gettoptracks', {
    user: username,
    period,
    limit: limit.toString(),
  });
  const res = await rateLimitedFetch(url);
  if (!res.ok) throw new Error(`Last.fm API error: ${res.status}`);
  return res.json();
}
