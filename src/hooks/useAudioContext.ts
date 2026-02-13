import { useRef, useCallback } from 'react';

let sharedContext: AudioContext | null = null;
let sharedDest: MediaStreamAudioDestinationNode | null = null;

export function useAudioContext() {
  const contextRef = useRef<AudioContext | null>(sharedContext);
  const destRef = useRef<MediaStreamAudioDestinationNode | null>(sharedDest);

  const getContext = useCallback(() => {
    if (!contextRef.current) {
      contextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      sharedContext = contextRef.current;
    }
    return contextRef.current;
  }, []);

  const getDest = useCallback(() => {
    if (!destRef.current) {
      const ctx = getContext();
      destRef.current = ctx.createMediaStreamDestination();
      sharedDest = destRef.current;
    }
    return destRef.current;
  }, [getContext]);

  const ensureResumed = useCallback(async () => {
    const ctx = getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
    return ctx;
  }, [getContext]);

  return { getContext, getDest, ensureResumed };
}
