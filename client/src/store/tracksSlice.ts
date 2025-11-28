import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";


export interface AudioItem {
  id: number;
  title: string;
  duration: number;
  size_mb: number;
  encoded_audio: string;
  type: "track" | "podcast";

  artist?: string; // для треков
  host?: string; // для подкастов
  category?: string; // для подкастов
  description?: string; // для подкастов
}

interface AudiosState {
  audios: AudioItem[];
  filteredAudios: AudioItem[];
  filter: "all" | "tracks" | "podcasts";
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: AudiosState = {
  audios: [],
  filteredAudios: [],
  filter: "all",
  searchQuery: "",
  isLoading: false,
  error: null,
};

export const fetchAllAudio = createAsyncThunk(
  "tracks/fetchAllAudio",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/tracks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось загрузить аудио");
      }

      const transformedData = data.map((item: any) => ({
          ...item,
          type: item.artist ? "track" : "podcast"
      }
      ))
      
      return transformedData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Не удалось загрузить аудио");
    }
  }
);


const applyFilterAndSearch = (
  audios: AudioItem[],
  filter: "all" | "tracks" | "podcasts",
  searchQuery: string
): AudioItem[] => {
  let filtered = audios;

  if (filter === "tracks") {
    filtered = audios.filter((audio) => audio.type === "track");
  } else if (filter === "podcasts") {
    filtered = audios.filter((audio) => audio.type === "podcast");
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filtered = filtered.filter(
      (audio) =>
        audio.title.toLowerCase().includes(query) ||
        (audio.artist && audio.artist.toLowerCase().includes(query)) ||
        (audio.host && audio.host.toLowerCase().includes(query))
    );
  }

  return filtered;
};

const tracksSlice = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    clearTracksError: (state) => {
      state.error = null;
    },
    clearSearch: (state) => {
        state.searchQuery = ""
        state.filteredAudios = applyFilterAndSearch(state.audios, state.filter, "")
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
        state.searchQuery = action.payload
        state.filteredAudios = applyFilterAndSearch(state.audios, state.filter, state.searchQuery)
    },
    setFilter: (state, action: PayloadAction<"all" | "tracks" | "podcasts">) => {
        state.filter = action.payload
        state.filteredAudios = applyFilterAndSearch(state.audios, state.filter, state.searchQuery)
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAllAudio.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(fetchAllAudio.fulfilled, (state, action) => {
        state.isLoading = false
        state.audios = action.payload
        state.filteredAudios = applyFilterAndSearch(action.payload, state.filter, state.searchQuery)
    })
    .addCase(fetchAllAudio.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string || "Не удалось загрузить аудио"
    })
  },
});


export const {clearSearch, clearTracksError, setFilter, setSearchQuery} = tracksSlice.actions
export default tracksSlice.reducer;