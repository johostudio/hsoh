import { useState } from 'react';
import type { FilmStill } from '../../types';

interface FilmStillCarouselProps {
  stills: FilmStill[];
  onSelect: (index: number) => void;
}

export default function FilmStillCarousel({
  stills,
  onSelect,
}: FilmStillCarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + stills.length) % stills.length);
  const next = () => setCurrent((c) => (c + 1) % stills.length);

  if (stills.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No film stills available
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full h-full">
      {/* Main image */}
      <div className="relative w-full max-w-3xl aspect-video overflow-hidden rounded-xl">
        <img
          src={stills[current].src}
          alt={stills[current].title}
          className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => onSelect(current)}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <h3 className="text-white font-semibold">{stills[current].title}</h3>
          {stills[current].description && (
            <p className="text-gray-300 text-sm">{stills[current].description}</p>
          )}
        </div>

        {/* Nav arrows */}
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
        >
          &#8249;
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition cursor-pointer"
        >
          &#8250;
        </button>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 overflow-x-auto max-w-3xl px-2 pb-2">
        {stills.map((still, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition cursor-pointer ${
              i === current ? 'border-indigo-500' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={still.src}
              alt={still.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
