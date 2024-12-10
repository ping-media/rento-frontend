import { createSlice } from "@reduxjs/toolkit";

const FiltersSlice = createSlice({
  name: "filter",
  initialState: {
    filter: [],
    filterLoading: false,
    error: null,
  },
  reducers: {
    addingFilters: (state) => {
      state.filterLoading = true;
    },
    hanldeAddFilters: (state, action) => {
      state.filter = action.payload;
      state.filterLoading = false;
    },
    restFilterLoading: (state) => {
      state.filterLoading = false;
    },
    resetFilters: (state) => {
      state.filter = [];
      state.filterLoading = false;
      state.error = null;
    },
  },
});

export const {
  addingFilters,
  hanldeAddFilters,
  restFilterLoading,
  resetFilters,
} = FiltersSlice.actions;

export default FiltersSlice.reducer;
