import { useEffect, useCallback } from 'react';
import type { FilmStill } from '../../types';

interface LightboxViewerProps {
  stills: FilmStill[];
  selectedIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function LightboxViewer({
  stills,
  selectedIndex,
  onClose,
  onPrev,
  onNext,
}: LightboxViewerProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    },
    [onClose, onPrev, onNext],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const still = stills[selectedIndex];
  if (!still) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 text-white text-3xl hover:text-gray-300 transition cursor-pointer z-10"
      >
        &times;
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 transition cursor-pointer"
      >
        &#8249;
      </button>

      <div
        className="max-w-[90vw] max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={still.src}
          alt={still.title}
          className="max-w-full max-h-[80vh] object-contain rounded-lg"
        />
        <div className="mt-4 text-center">
          <h3 className="text-white text-lg font-semibold">{still.title}</h3>
          {still.description && (
            <p className="text-gray-400 text-sm mt-1">{still.description}</p>
          )}
          <p className="text-gray-600 text-xs mt-2">
            {selectedIndex + 1} / {stills.length}
          </p>
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-5xl hover:text-gray-300 transition cursor-pointer"
      >
        &#8250;
      </button>
    </div>
  );
}
