import { createSlice } from "@reduxjs/toolkit";

const ProductsSlice = createSlice({
  name: "vehicles",
  initialState: {
    vehicles: [],
    pagination: { page: 1 },
    tempDate: "",
    isExtraAddonChecked: false,
    loading: false,
    error: null,
  },
  reducers: {
    handleStartLoading: (state) => {
      state.loading = true;
    },
    addTempDate: (state, action) => {
      state.tempDate = action.payload;
      state.loading = false;
    },
    removeTempDate: (state) => {
      state.tempDate = "";
    },
    fetchingVehicles: (state) => {
      state.vehicles = [];
      state.loading = true;
      state.error = null;
    },
    addVehiclesData: (state, action) => {
      state.vehicles = action.payload;
      state.loading = false;
    },
    addPaginationData: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    handleChangePage: (state, action) => {
      state.pagination.page = action.payload;
    },
    handleChangeExtraChecked: (state, action) => {
      state.isExtraAddonChecked = action.payload;
    },
    handleEndLoading: (state) => {
      state.loading = false;
    },
  },
});

export const {
  handleStartLoading,
  addTempDate,
  removeTempDate,
  fetchingVehicles,
  handleChangeExtraChecked,
  addPaginationData,
  addVehiclesData,
  handleChangePage,
  handleEndLoading,
} = ProductsSlice.actions;

export default ProductsSlice.reducer;
