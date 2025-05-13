import { createSlice } from "@reduxjs/toolkit";

const SettingSlice = createSlice({
  name: "general",
  initialState: {
    maintenance: false,
    loading: false,
  },
  reducers: {
    toggleMaintenance: (state) => {
      state.maintenance = !state.maintenance;
    },
  },
});

export const { toggleMaintenance } = SettingSlice.actions;

export default SettingSlice.reducer;
