import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const lib_songs = createSlice({
  name: 'libsongs',
  initialState,
  reducers: {
    updatelib: (state, action) => {
      state.value = [action.payload];
    },
  },
}); 

// Export the action creator
export const { updatelib } =  lib_songs.actions;

// Export the reducer correctly
export const libreducer =  lib_songs.reducer;
