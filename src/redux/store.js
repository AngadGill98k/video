import { configureStore } from '@reduxjs/toolkit'
import { libreducer } from './libSongs'
export const store = configureStore({
  reducer: {
    lib_song:libreducer
  },
})