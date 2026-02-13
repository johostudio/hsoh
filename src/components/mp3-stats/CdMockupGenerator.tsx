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
    ctx.fillStyle = '#f5f0eb';
    ctx.fillRect(0, 0, w, h);

    // Outer disc
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 180, 0, Math.PI * 2);
    ctx.fillStyle = '#e8e0d8';
    ctx.fill();
    ctx.strokeStyle = 'rgba(45,24,16,0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner ring
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#f5f0eb';
    ctx.fill();
    ctx.strokeStyle = 'rgba(45,24,16,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Concentric grooves
    for (let r = 60; r < 175; r += 12) {
      ctx.beginPath();
      ctx.arc(w / 2, h / 2, r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(45, 24, 16, 0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Title
    ctx.fillStyle = '#2d1810';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(`${username}'s Top Music`, w / 2, 30);

    ctx.fillStyle = 'rgba(45,24,16,0.4)';
    ctx.font = '11px system-ui';
    ctx.fillText(period.replace('overall', 'All Time'), w / 2, 48);

    // Top artists on the disc
    ctx.fillStyle = '#2d1810';
    ctx.font = '10px system-ui';
    ctx.textAlign = 'center';

    const items = artists.slice(0, 5).map((a) => a.name);
    const trackItems = tracks.slice(0, 5).map((t) => t.name);

    items.forEach((name, i) => {
      const angle = (i / items.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 120;
      const x = w / 2 + Math.cos(angle) * radius;
      const y = h / 2 + Math.sin(angle) * radius;
      ctx.fillStyle = '#2d1810';
      ctx.font = 'bold 9px system-ui';
      ctx.fillText(name.substring(0, 16), x, y);
    });

    trackItems.forEach((name, i) => {
      const angle = (i / trackItems.length) * Math.PI * 2 - Math.PI / 2;
      const radius = 85;
      const x = w / 2 + Math.cos(angle) * radius;
      const y = h / 2 + Math.sin(angle) * radius;
      ctx.fillStyle = 'rgba(45,24,16,0.6)';
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
      <h3 className="font-bold" style={{ color: '#2d1810' }}>CD Mockup</h3>
      <canvas
        ref={canvasRef}
        className="rounded-full shadow-xl"
        style={{ width: 300, height: 300, border: '1px solid rgba(45,24,16,0.1)' }}
      />
      <button
        onClick={handleDownload}
        className="px-5 py-2 rounded-lg text-sm font-medium transition cursor-pointer"
        style={{ backgroundColor: '#2d1810', color: '#f5f0eb' }}
      >
        Download Mockup
      </button>
    </div>
  );
}
