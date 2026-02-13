import { useRef, useEffect } from 'react';
import type { LastFmArtist, LastFmTrack } from '../../types';

interface CdMockupGeneratorProps {
  artists: LastFmArtist[];
  tracks: LastFmTrack[];
  username: string;
  period: string;
}

export default function CdMockupGenerator({
  artists,
  tracks,
  username,
  period,
}: CdMockupGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || (artists.length === 0 && tracks.length === 0)) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 400;
    const h = 400;
    canvas.width = w;
    canvas.height = h;

    // Background - CD shape
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, w, h);

    // Outer disc
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 180, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a2e';
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#111';
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Concentric grooves
    for (let r = 60; r < 175; r += 12) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(100, 100, 200, 0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = '#a78bfa';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${username}'s Top Music`, w / 2, 30);

    ctx.fillStyle = '#666';
    ctx.font = '11px system-ui';
    ctx.fillText(period.replace('overall', 'All Time'), w / 2, 48);

    // Top artists on the disc
    ctx.fillStyle = '#e0e0ff';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';

    const items = artists.slice(0, 5).map((a) => a.name);
    const trackItems = tracks.slice(0, 5).map((t) => t.name);

    items.forEach((name, i) => {
      const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 120;
      const x = w / 2 + Math.cos(angle) * radius;
      const y = h / 2 + Math.sin(angle) * radius;
      ctx.fillStyle = '#c4b5fd';
      ctx.font = 'bold 9px system-ui';
      ctx.fillText(name.substring(0, 16), x, y);
    });

    trackItems.forEach((name, i) => {
      const angle = (i / trackItems.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 85;
      const x = w / 2 + Math.cos(angle) * radius;
      const y = h / 2 + Math.sin(angle) * radius;
      ctx.fillStyle = '#818cf8';
      ctx.font = '8px system-ui';
      ctx.fillText(name.substring(0, 14), x, y);
    });
  }, [artists, tracks, username, period]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `${username}-cd-mockup.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  if (artists.length === 0 && tracks.length === 0) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <h3 className="text-white font-bold">CD Mockup</h3>
      <canvas
        ref={canvasRef}
        className="rounded-full border border-white/10 shadow-xl shadow-indigo-500/10"
        style={{ width: 300, height: 300 }}
      />
      <button
        onClick={handleDownload}
        className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-500 transition cursor-pointer"
      >
        Download Mockup
      </button>
    </div>
  );
}
