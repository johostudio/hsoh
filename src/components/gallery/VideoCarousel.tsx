import { useState, useRef, useCallback, useEffect } from 'react';
import type { VideoItem } from '../../types';

interface VideoCarouselProps {
  videos: VideoItem[];
}

export default function VideoCarousel({ videos }: VideoCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const animateTransition = useCallback((dir: 'left' | 'right', newIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setDirection(dir);

    setTimeout(() => {
      setCurrent(newIndex);
      setDirection(null);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 250);
  }, [isTransitioning]);

  const prev = useCallback(() => {
    const newIndex = (current - 1 + videos.length) % videos.length;
    animateTransition('right', newIndex);
  }, [current, videos.length, animateTransition]);

  const next = useCallback(() => {
    const newIndex = (current + 1) % videos.length;
    animateTransition('left', newIndex);
  }, [current, videos.length, animateTransition]);

  const goTo = useCallback((index: number) => {
    if (index === current) return;
    animateTransition(index > current ? 'left' : 'right', index);
  }, [current, animateTransition]);

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    if (Math.abs(diff) > threshold) {
      if (diff > 0) next();
      else prev();
    }
  }, [next, prev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prev, next]);

  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full" style={{ color: 'rgba(255,255,255,0.5)' }}>
        No videos available
      </div>
    );
  }

  const video = videos[current];

  // Slide animation styles
  const getSlideStyle = (): React.CSSProperties => {
    if (direction === 'left') {
      return {
        transform: 'translateX(-30px)',
        opacity: 0,
        transition: 'transform 0.25s ease, opacity 0.25s ease',
      };
    }
    if (direction === 'right') {
      return {
        transform: 'translateX(30px)',
        opacity: 0,
        transition: 'transform 0.25s ease, opacity 0.25s ease',
      };
    }
    return {
      transform: 'translateX(0)',
      opacity: 1,
      transition: 'transform 0.3s ease, opacity 0.3s ease',
    };
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-4 w-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Main video */}
      <div
        className="relative w-full aspect-video overflow-hidden rounded-xl"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          ...getSlideStyle(),
        }}
      >
        {video.type === 'youtube' || video.type === 'vimeo' ? (
          <iframe
            src={video.src}
            title={video.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ border: 'none' }}
          />
        ) : (
          <video
            src={video.src}
            controls
            className="w-full h-full object-cover"
          />
        )}

        {/* Nav arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg hover:scale-110 active:scale-95"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
        >
          &#8249;
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer text-lg hover:scale-110 active:scale-95"
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            backdropFilter: 'blur(8px)',
            transition: 'transform 0.15s ease, background-color 0.15s ease',
          }}
        >
          &#8250;
        </button>
      </div>

      {/* Title + description */}
      <div className="text-center" style={getSlideStyle()}>
        <h3 className="font-semibold text-white text-sm">{video.title}</h3>
        {video.description && (
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{video.description}</p>
        )}
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {current + 1} / {videos.length}
        </p>
      </div>

      {/* Dot indicators */}
      <div className="flex gap-2">
        {videos.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="rounded-full cursor-pointer"
            style={{
              width: i === current ? '20px' : '8px',
              height: '8px',
              backgroundColor: i === current ? '#ffffff' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  );
}
