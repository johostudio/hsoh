import { useState, useEffect, useCallback } from 'react';
import {
  getUserInfo,
  getTopArtists,
  getTopTracks,
  getTopAlbums,
} from '../../../lib/lastfmApi';
import type {
  LastFmAlbum,
  LastFmArtist,
  LastFmTrack,
  LastFmUserInfo,
  TimePeriod,
} from '../../../types';

interface LastFmData {
  userInfo: LastFmUserInfo | null;
  topArtists: LastFmArtist[];
  topTracks: LastFmTrack[];
  topAlbums: LastFmAlbum[];
  loading: boolean;
  error: string | null;
  period: TimePeriod;
  setPeriod: (p: TimePeriod) => void;
  fetchData: (username: string) => void;
}

const DEFAULT_USERNAME = 'hosshh';

export function useLastFmData(): LastFmData {
  const [userInfo, setUserInfo] = useState<LastFmUserInfo | null>(null);
  const [topArtists, setTopArtists] = useState<LastFmArtist[]>([]);
  const [topTracks, setTopTracks] = useState<LastFmTrack[]>([]);
  const [topAlbums, setTopAlbums] = useState<LastFmAlbum[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<TimePeriod>('1month');
  const [username, setUsername] = useState(DEFAULT_USERNAME);

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
        const [info, artists, tracks, albums] = await Promise.all([
          getUserInfo(username),
          getTopArtists(username, period, 10),
          getTopTracks(username, period, 10),
          getTopAlbums(username, period, 10),
        ]);
        if (cancelled) return;
        setUserInfo(info);
        setTopArtists(artists.topartists?.artist ?? []);
        setTopTracks(tracks.toptracks?.track ?? []);
        setTopAlbums(albums.topalbums?.album ?? []);
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
    topAlbums,
    loading,
    error,
    period,
    setPeriod,
    fetchData,
  };
}
