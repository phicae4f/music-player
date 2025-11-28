import {
  createAsyncThunk,
  createSlice
} from "@reduxjs/toolkit";
import type { AudioItem } from "./tracksSlice";
import type { RootState } from "./store";

interface favouritesState {
  favourites: AudioItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: favouritesState = {
  favourites: localStorage.getItem("favourites")
    ? JSON.parse(localStorage.getItem("favourites")!)
    : [],
  isLoading: false,
  error: null,
};

export const getFavouriteTracks = createAsyncThunk(
  "favourites/getFavouriteTracks",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error("Отсутствует токен");
      }

      console.log("Fetching favourites from server...");

      const response = await fetch(
        `api/favorites`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Favourites response status:", response.status);

      const data = await response.json();
      console.log("getFavouriteTracks FULL response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Не удалось получить избранное");
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Не удалось получить избранное");
    }
  }
);

export const addToFavourite = createAsyncThunk(
  "favourites/addToFavourite",
  async (trackId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error("Отсутствует токен");
      }

      const response = await fetch(
        `api/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ trackId: trackId.toString() }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Не удалось добавить в избранное");
      }

      const tracksState = (getState() as RootState).tracks;
      const track = tracksState.audios.find((audio) => audio.id === trackId);

      if (!track) {
        throw new Error("Трек не найден");
      }

      return track;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Не удалось добавить в избранное"
      );
    }
  }
);

export const removeFromFavourite = createAsyncThunk(
  "favourites/removeFromFavourite",
  async (trackId: number, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error("Отсутствует токен");
      }

      const response = await fetch(
        `api/favorites`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ trackId: trackId.toString() }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Не удалось удалить из избранного");
      }

      return trackId;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Не удалось удалить из избранного"
      );
    }
  }
);

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    clearFavourites: (state) => {
      state.favourites = [];
      localStorage.removeItem("favourites");
    },
  },
  extraReducers: (builder) => {
    builder

      //GET FAVOURITE TRACKS
      .addCase(getFavouriteTracks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFavouriteTracks.fulfilled, (state, action) => {
        state.isLoading = false;

        const serverFavourites = action.payload || [];
        const localFavourites = JSON.parse(
          localStorage.getItem("favourites") || "[]"
        );

        // Объединяем: серверные данные + локальные которые отсутствуют на сервере
        const mergedFavourites = [...serverFavourites];

        localFavourites.forEach((localItem: AudioItem) => {
          if (
            !serverFavourites.find(
              (serverItem: any) => serverItem.id === localItem.id
            )
          ) {
            mergedFavourites.push(localItem);
          }
        });

        state.favourites = mergedFavourites;
        localStorage.setItem("favourites", JSON.stringify(mergedFavourites));
      })
      .addCase(getFavouriteTracks.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "Не удалось загрузить избранные";
      })

      //ADD TO FAVOURITE

      .addCase(addToFavourite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToFavourite.fulfilled, (state, action) => {
        state.isLoading = false;
        const track = action.payload;
        const existingItem = state.favourites.find(
          (item) => item.id === track.id
        );

        if (!existingItem) {
          state.favourites.push(track);
          localStorage.setItem("favourites", JSON.stringify(state.favourites));
        }
      })
      .addCase(addToFavourite.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "Не удалось добавить в избранное";
      })

      //REMOVE FROM FAVOURITE
      .addCase(removeFromFavourite.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromFavourite.fulfilled, (state, action) => {
        state.isLoading = false;

        const trackId = action.payload;
        state.favourites = state.favourites.filter(
          (item) => item.id !== trackId
        );
        localStorage.setItem("favourites", JSON.stringify(state.favourites));
      })
      .addCase(removeFromFavourite.rejected, (state, action) => {
        state.error =
          (action.payload as string) || "Не удалось удалить из избранного";
      });
  },
});

export const { clearFavourites } = favouritesSlice.actions;
export default favouritesSlice.reducer;
