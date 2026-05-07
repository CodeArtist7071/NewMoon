import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import libraryReducer from "./librarySlice";
import playerReducer from "./playerSlice";


export const store = configureStore({
    reducer:{
        auth:authReducer,
        library:libraryReducer,
        player:playerReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch