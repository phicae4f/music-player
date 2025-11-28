import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice"
import tracksSlice from "./tracksSlice"
import favouritesSlice from "./favouritesSlice"
import playerSlice from "./playerSlice"


export const store = configureStore({
    reducer: {
        auth: authSlice,
        tracks: tracksSlice,
        favourites: favouritesSlice,
        player: playerSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch