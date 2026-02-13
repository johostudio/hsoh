import { useState } from 'react';
import { useLastFmData } from './hooks/useLastFmData';
import type { TimePeriod } from '../../types';

const PERIOD_LABELS: { value: TimePeriod; label: string }[] = [
  { value: '7day', label: '7 Days' },
  { value: '1month', label: '1 Month' },
  { value: '3month', label: '3 Months' },
  { value: '6month', label: '6 Months' },
  { value: '12month', label: '12 Months' },
  { value: 'overall', label: 'All Time' },
];

export default function LastFmDashboard() {
  const { userInfo, topArtists, topTracks, loading, error, period, setPeriod, fetchData } =
    useLastFmData();
  const [usernameInput, setUsernameInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim()) fetchData(usernameInput.trim());
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Username input */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        <input
          type="text"
          placeholder="Last.fm username..."
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl focus:outline-none transition"
          style={{ backgroundColor: 'rgba(45,24,16,0.05)', border: '1px solid rgba(45,24,16,0.1)', color: '#2d1810' }}
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl font-medium disabled:opacity-50 transition cursor-pointer"
          style={{ backgroundColor: '#2d1810', color: '#f5f0eb' }}
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </form>

      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', color: '#b91c1c' }}>
          {error}
        </div>
      )}

      {/* Period selector */}
      {userInfo && (
        <div className="flex flex-wrap gap-2">
          {PERIOD_LABELS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer"
              style={
                period === p.value
                  ? { backgroundColor: '#2d1810', color: '#f5f0eb' }
                  : { backgroundColor: 'rgba(45,24,16,0.05)', color: 'rgba(45,24,16,0.6)' }
              }
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* User info banner */}
      {userInfo && (
        <div className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(45,24,16,0.05)' }}>
          {userInfo.user.image?.[2]?.['#text'] && (
            <img
              src={userInfo.user.image[2]['#text']}
              alt={userInfo.user.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-lg font-bold" style={{ color: '#2d1810' }}>{userInfo.user.name}</h2>
            <p className="text-sm" style={{ color: 'rgba(45,24,16,0.5)' }}>
              {Number(userInfo.user.playcount).toLocaleString()} total scrobbles
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Artists */}
        {topArtists.length > 0 && (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(45,24,16,0.05)' }}>
            <h3 className="font-bold mb-4" style={{ color: '#2d1810' }}>Top Artists</h3>
            <ol className="space-y-2">
              {topArtists.map((artist, i) => (
                <li key={artist.name} className="flex items-center gap-3">
                  <span className="font-mono text-sm w-6 text-right" style={{ color: 'rgba(45,24,16,0.4)' }}>
                    {i + 1}
                  </span>
                  {artist.image?.[0]?.['#text'] && (
                    <img
                      src={artist.image[0]['#text']}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <a
                      href={artist.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium transition truncate block"
                      style={{ color: '#2d1810' }}
                    >
                      {artist.name}
                    </a>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(45,24,16,0.4)' }}>
                    {Number(artist.playcount).toLocaleString()} plays
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Top Tracks */}
        {topTracks.length > 0 && (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'rgba(45,24,16,0.05)' }}>
            <h3 className="font-bold mb-4" style={{ color: '#2d1810' }}>Top Tracks</h3>
            <ol className="space-y-2">
              {topTracks.map((track, i) => (
                <li key={`${track.artist.name}-${track.name}`} className="flex items-center gap-3">
                  <span className="font-mono text-sm w-6 text-right" style={{ color: 'rgba(45,24,16,0.4)' }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium transition truncate block"
                      style={{ color: '#2d1810' }}
                    >
                      {track.name}
                    </a>
                    <span className="text-xs" style={{ color: 'rgba(45,24,16,0.4)' }}>{track.artist.name}</span>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(45,24,16,0.4)' }}>
                    {Number(track.playcount).toLocaleString()} plays
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
