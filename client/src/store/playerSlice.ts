import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AudioItem } from "./tracksSlice";

interface PlayerState {
  currentTrack: AudioItem | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  queue: AudioItem[];
  currentIndex: number;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  queue: [],
  currentIndex: -1,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    playTrack: (
      state,
      action: PayloadAction<{ track: AudioItem; queue?: AudioItem[] }>
    ) => {
      state.currentTrack = action.payload.track;
      state.isPlaying = true;
      state.currentTime = 0;

      if (action.payload.queue) {
        state.queue = action.payload.queue;
        state.currentIndex = action.payload.queue.findIndex(
          (track) => track.id == action.payload.track.id
        );
      }
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    nextTrack: (state) => {
      if (
        state.queue.length > 0 &&
        state.currentIndex < state.queue.length - 1
      ) {
        state.currentIndex += 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.currentTime = 0;
        state.isPlaying = true;
      }
    },
    prevTrack: (state) => {
      if (state.queue.length > 0 && state.currentIndex > 0) {
        state.currentIndex -= 1;
        state.currentTrack = state.queue[state.currentIndex];
        state.currentTime = 0;
        state.isPlaying = true;
      }
    },
    seekForward: (state) => {
      state.currentTime = Math.min(state.currentTime + 10, state.duration);
    },
    seekBackward: (state) => {
      state.currentTime = Math.max(state.currentTime - 10, 0);
    },
    clearPlayer: (state) => {
      state.currentTrack = null;
      state.isPlaying = false;
      state.currentTime = 0;
    },
  },
});

export const {
  clearPlayer,
  seekBackward,
  seekForward,
  nextTrack,
  prevTrack,
  setCurrentTime,
  setDuration,
  setVolume,
  togglePlay,
  playTrack,
} = playerSlice.actions;
export default playerSlice.reducer;
