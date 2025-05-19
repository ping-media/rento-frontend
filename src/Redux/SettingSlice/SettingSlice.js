import { createSlice } from "@reduxjs/toolkit";

const SettingSlice = createSlice({
  name: "general",
  initialState: {
    maintenance: false,
    info: null,
    slides: [],
    testimonial: [],
    loading: true,
  },
  reducers: {
    toggleMaintenance: (state) => {
      state.maintenance = !state.maintenance;
    },
    addGeneralSettings: (state, action) => {
      const { info, slides, testimonial, maintenance } = action.payload;
      state.info = info;
      state.slides = slides;
      state.testimonial = testimonial;
      state.maintenance = maintenance;
    },
    stopSettingLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { toggleMaintenance, addGeneralSettings, stopSettingLoading } =
  SettingSlice.actions;

export default SettingSlice.reducer;
