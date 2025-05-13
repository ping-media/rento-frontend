import { createSlice } from "@reduxjs/toolkit";

const SettingSlice = createSlice({
  name: "general",
  initialState: {
    maintenance: true,
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
