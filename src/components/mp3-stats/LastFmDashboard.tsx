import { useState, useRef, useCallback } from 'react';
import { useLastFmData } from './hooks/useLastFmData';
import type { TimePeriod, LastFmAlbum } from '../../types';

const PERIOD_LABELS: { value: TimePeriod; label: string }[] = [
  { value: '7day', label: '7 days' },
  { value: '1month', label: '1 month' },
  { value: '3month', label: '3 months' },
  { value: '6month', label: '6 months' },
  { value: '12month', label: '12 months' },
  { value: 'overall', label: 'all time' },
];

function AlbumCascadeStack({ albums }: { albums: LastFmAlbum[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || albums.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const idx = Math.min(Math.floor(x * albums.length), albums.length - 1);
    setActiveIndex(idx);
  }, [albums.length]);

  if (albums.length === 0) return null;

  // The album to show info for: hovered one, or first by default
  const displayAlbum = albums[activeIndex] || albums[0];
  const displayIndex = activeIndex;

  return (
    <div>
      {/* 3D cascade container */}
      <div
        ref={containerRef}
        className="relative w-full cursor-pointer mx-auto"
        style={{
          height: '320px',
          maxWidth: '560px',
          perspective: '1200px',
          perspectiveOrigin: '50% 50%',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => { setIsHovering(false); }}
      >
        {albums.map((album, i) => {
          const total = albums.length;
          const isFocused = isHovering && i === activeIndex;
          const distFromActive = isHovering ? i - activeIndex : i;

          // Center the active album at translateX(0); others fan out from it
          const baseX = isHovering
            ? distFromActive * 50
            : i * 34 - (total * 34) / 2 + 17;
          const baseZ = isHovering
            ? -Math.abs(distFromActive) * 55
            : -i * 45;
          const baseRotateY = isHovering
            ? distFromActive * -3
            : -15 + i * 2;
          const baseRotateX = isHovering ? 0 : 3;
          const scale = isFocused ? 1.08 : isHovering ? 0.78 - Math.abs(distFromActive) * 0.03 : 0.88;
          const opacity = isHovering
            ? isFocused ? 1 : 0.35 - Math.abs(distFromActive) * 0.04
            : 1 - i * 0.04;
          const zIndex = isHovering
            ? total - Math.abs(distFromActive)
            : total - i;

          const imgSrc = album.image?.[3]?.['#text'] || album.image?.[2]?.['#text'] || album.image?.[1]?.['#text'] || album.image?.[0]?.['#text'] || '';

          return (
            <a
              key={`${album.artist.name}-${album.name}-${i}`}
              href={album.url}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute block"
              style={{
                width: '190px',
                height: '245px',
                left: '50%',
                top: '50%',
                marginLeft: '-95px',
                marginTop: '-122px',
                transform: `translateX(${baseX}px) translateZ(${baseZ}px) rotateY(${baseRotateY}deg) rotateX(${baseRotateX}deg) scale(${scale})`,
                opacity: Math.max(opacity, 0.1),
                zIndex,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                transformStyle: 'preserve-3d',
              }}
            >
              <div
                className="w-full h-full rounded-lg overflow-hidden relative"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                  border: isFocused ? '1px solid rgba(99,102,241,0.5)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: isFocused
                    ? '0 16px 48px rgba(0,0,0,0.6), 0 0 24px rgba(99,102,241,0.12)'
                    : '0 6px 24px rgba(0,0,0,0.4)',
                }}
              >
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={album.name}
                    className="w-full aspect-square object-cover"
                    style={{ display: 'block' }}
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full aspect-square flex items-center justify-center"
                    style={{ background: 'rgba(99,102,241,0.1)' }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px' }}>No art</span>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 p-2.5" style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.85))' }}>
                  <p className="text-xs font-medium text-white truncate">{album.name}</p>
                  <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{album.artist.name}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    {Number(album.playcount).toLocaleString()} plays
                  </p>
                </div>

                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%, rgba(255,255,255,0.02) 100%)',
                  }}
                />
              </div>
            </a>
          );
        })}
      </div>

      {/* Album indicator -- always visible */}
      <div className="text-center mt-2 h-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
        <span className="text-xs font-medium">
          {displayIndex + 1}. {displayAlbum.name} — {displayAlbum.artist.name}
        </span>
      </div>
    </div>
  );
}

export default function LastFmDashboard() {
  const { userInfo, topArtists, topTracks, topAlbums, loading, error, period, setPeriod, username, fetchData } =
    useLastFmData();
  const [searchInput, setSearchInput] = useState(username);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (trimmed && trimmed !== username) {
      fetchData(trimmed);
    }
  };

  return (
    <div className="w-full">
      {loading && (
        <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Loading stats...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl text-sm" style={{ backgroundColor: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)', color: '#fca5a5' }}>
          {error}
        </div>
      )}

      {/* Username search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="last.fm username"
          className="text-xs font-medium px-3 py-1.5 rounded-lg outline-none flex-1 max-w-[200px]"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
          }}
        />
        <button
          type="submit"
          className="text-xs font-medium px-3 py-1.5 rounded-lg cursor-pointer transition hover:opacity-60"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#ffffff',
          }}
        >
          search
        </button>
      </form>

      <div className="flex gap-8">
        {/* Period selector -- vertical tabs on the left */}
        {userInfo && (
          <div className="flex flex-col gap-1 pt-1 shrink-0">
            {PERIOD_LABELS.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className="text-xs font-medium transition cursor-pointer hover:opacity-60 text-left whitespace-nowrap"
                style={{
                  color: period === p.value ? '#ffffff' : 'rgba(255,255,255,0.3)',
                  background: 'none',
                  border: 'none',
                  padding: '3px 0',
                  textDecoration: period === p.value ? 'underline' : 'none',
                  textUnderlineOffset: '4px',
                }}
              >
                {p.label}
              </button>
            ))}

            {/* User info -- below tabs */}
            <div className="flex items-center gap-2 mt-4">
              {userInfo.user.image?.[2]?.['#text'] && (
                <img
                  src={userInfo.user.image[2]['#text']}
                  alt={userInfo.user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <div>
                <span className="text-xs font-medium text-white block">{userInfo.user.name}</span>
                <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {Number(userInfo.user.playcount).toLocaleString()} scrobbles
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Albums -- cascading 3D stack */}
          {topAlbums.length > 0 && <AlbumCascadeStack albums={topAlbums} />}

          {/* Artists & Tracks -- two centered columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Top Artists */}
            {topArtists.length > 0 && (
              <div>
                <h3 className="text-xs font-medium mb-3 text-center" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  top artists
                </h3>
                <ol className="space-y-1.5">
                  {topArtists.map((artist, i) => (
                    <li key={artist.name} className="flex items-center gap-2.5">
                      <span className="font-mono text-xs w-5 text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {i + 1}
                      </span>
                      {artist.image?.[0]?.['#text'] && (
                        <img
                          src={artist.image[0]['#text']}
                          alt=""
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <a
                          href={artist.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium transition truncate block text-white hover:opacity-60"
                          style={{ textDecoration: 'none' }}
                        >
                          {artist.name}
                        </a>
                      </div>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {Number(artist.playcount).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Top Tracks */}
            {topTracks.length > 0 && (
              <div>
                <h3 className="text-xs font-medium mb-3 text-center" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                  top tracks
                </h3>
                <ol className="space-y-1.5">
                  {topTracks.map((track, i) => (
                    <li key={`${track.artist.name}-${track.name}`} className="flex items-center gap-2.5">
                      <span className="font-mono text-xs w-5 text-right" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <a
                          href={track.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-medium transition truncate block text-white hover:opacity-60"
                          style={{ textDecoration: 'none' }}
                        >
                          {track.name}
                        </a>
                        <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>{track.artist.name}</span>
                      </div>
                      <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.25)' }}>
                        {Number(track.playcount).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
