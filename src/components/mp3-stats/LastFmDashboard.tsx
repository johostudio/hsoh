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
          className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-500 disabled:opacity-50 transition cursor-pointer"
        >
          {loading ? 'Loading...' : 'Fetch'}
        </button>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
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
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-pointer ${
                period === p.value
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      {/* User info banner */}
      {userInfo && (
        <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl">
          {userInfo.user.image?.[2]?.['#text'] && (
            <img
              src={userInfo.user.image[2]['#text']}
              alt={userInfo.user.name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-white text-lg font-bold">{userInfo.user.name}</h2>
            <p className="text-gray-400 text-sm">
              {Number(userInfo.user.playcount).toLocaleString()} total scrobbles
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Artists */}
        {topArtists.length > 0 && (
          <div className="bg-white/5 rounded-xl p-5">
            <h3 className="text-white font-bold mb-4">Top Artists</h3>
            <ol className="space-y-2">
              {topArtists.map((artist, i) => (
                <li key={artist.name} className="flex items-center gap-3">
                  <span className="text-indigo-400 font-mono text-sm w-6 text-right">
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
                      className="text-white text-sm font-medium hover:text-indigo-400 transition truncate block"
                    >
                      {artist.name}
                    </a>
                  </div>
                  <span className="text-gray-500 text-xs">
                    {Number(artist.playcount).toLocaleString()} plays
                  </span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Top Tracks */}
        {topTracks.length > 0 && (
          <div className="bg-white/5 rounded-xl p-5">
            <h3 className="text-white font-bold mb-4">Top Tracks</h3>
            <ol className="space-y-2">
              {topTracks.map((track, i) => (
                <li key={`${track.artist.name}-${track.name}`} className="flex items-center gap-3">
                  <span className="text-indigo-400 font-mono text-sm w-6 text-right">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <a
                      href={track.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm font-medium hover:text-indigo-400 transition truncate block"
                    >
                      {track.name}
                    </a>
                    <span className="text-gray-500 text-xs">{track.artist.name}</span>
                  </div>
                  <span className="text-gray-500 text-xs">
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
