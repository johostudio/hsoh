import { useState, useEffect, useCallback } from 'react';
import {
  getUserInfo,
  getTopArtists,
  getTopTracks,
} from '../../../lib/lastfmApi';
import type {
  LastFmArtist,
  LastFmTrack,
  LastFmUserInfo,
  TimePeriod,
} from '../../../types';

interface LastFmData {
  userInfo: LastFmUserInfo | null;
  topArtists: LastFmArtist[];
  topTracks: LastFmTrack[];
  loading: boolean;
  error: string | null;
  period: TimePeriod;
  setPeriod: (p: TimePeriod) => void;
  fetchData: (username: string) => void;
}

export function useLastFmData(): LastFmData {
  const [userInfo, setUserInfo] = useState<LastFmUserInfo | null>(null);
  const [topArtists, setTopArtists] = useState<LastFmArtist[]>([]);
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimePeriod>('1month');
  const [username, setUsername] = useState('');

  const fetchData = useCallback((user: string) => {
    setUsername(user);
    setError(null);
  }, []);

  useEffect(() => {
    if (!username) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const [info, artists, tracks] = await Promise.all([
          getUserInfo(username),
          getTopArtists(username, period, 10),
          getTopTracks(username, period, 10),
        ]);
        if (cancelled) return;
        setUserInfo(info);
        setTopArtists(artists.topartists?.artist ?? []);
        setTopTracks(tracks.toptracks?.track ?? []);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [username, period]);

  return {
    userInfo,
    topArtists,
    topTracks,
    loading,
    error,
    period,
    setPeriod,
    fetchData,
  };
}
