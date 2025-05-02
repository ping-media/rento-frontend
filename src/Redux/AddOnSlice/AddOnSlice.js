import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  addon: [],
  selectedAddOn: [],
  pagination: null,
  loading: false,
};

const AddOnSlice = createSlice({
  name: "addon",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
    },
    addAddOn: (state, action) => {
      const { data, pagination } = action.payload;
      state.addon = data?.filter((item) => item?.status === "active");
      state.pagination = pagination;
      state.loading = false;
    },
    handleSelectedAddOn: (state, action) => {
      state.selectedAddOn = action.payload;
    },
    updateAddOnData: (state, action) => {
      const updated = action.payload;
      state.addon = state.addon.map((item) =>
        item._id === updated._id ? { ...item, ...updated } : item
      );
    },
    addNewAddOnData: (state, action) => {
      state.addon = action.payload;
    },
    removeAddOnData: (state, action) => {
      const idToRemove = action.payload;
      state.addon = state.addon.filter((item) => item._id !== idToRemove);
    },
    stopLoading: (state) => {
      state.loading = false;
    },
    resetAddOn: () => initialState,
  },
});

export const {
  startLoading,
  addAddOn,
  addNewAddOnData,
  handleSelectedAddOn,
  updateAddOnData,
  removeAddOnData,
  stopLoading,
  resetAddOn,
} = AddOnSlice.actions;
export default AddOnSlice.reducer;
