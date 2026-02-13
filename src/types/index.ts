export interface FloatingIconData {
  iconUrl: string;
  linkUrl: string;
  position: [number, number, number];
  label: string;
}

export interface FilmStill {
  src: string;
  title: string;
  description?: string;
}

export interface LastFmArtist {
  name: string;
  playcount: string;
  url: string;
  image: { '#text': string; size: string }[];
}

export interface LastFmTrack {
  name: string;
  playcount: string;
  artist: { name: string; url: string };
  url: string;
  image: { '#text': string; size: string }[];
}

export interface LastFmUserInfo {
  user: {
    name: string;
    playcount: string;
    registered: { unixtime: string };
    image: { '#text': string; size: string }[];
  };
}

export interface LastFmTopArtistsResponse {
  topartists: {
    artist: LastFmArtist[];
  };
}

export interface LastFmTopTracksResponse {
  toptracks: {
    track: LastFmTrack[];
  };
}

export type TimePeriod = 'overall' | '7day' | '1month' | '3month' | '6month' | '12month';

export interface RecordingState {
  isRecording: boolean;
  isPlaying: boolean;
  recordedChunks: BlobPart[];
  currentBlob: Blob | null;
  downloadUrl: string | null;
}

export interface PadConfig {
  id: number;
  label: string;
  frequency: number;
  type: OscillatorType;
  color: string;
}

export interface DrumSound {
  id: string;
  label: string;
  color: string;
}

export interface SequencerStep {
  [instrumentId: string]: boolean;
}

export interface TempoSettings {
  bpm: number;
  timeSignature: [number, number];
  steps: number;
}

/** Optional external texture paths to apply to a loaded GLB model. */
export interface TexturePaths {
  baseColor?: string;
  normal?: string;
  roughness?: string;
  metallic?: string;
  height?: string;
  ao?: string;
  emissive?: string;
}
