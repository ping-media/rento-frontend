import { createSlice } from "@reduxjs/toolkit";

const ModalSlice = createSlice({
  name: "modals",
  initialState: {
    isLoginModalActive: false,
    isSignOutModalActive: false,
    isRegisterModalActive: false,
    isLocationModalActive: false,
    isFilterActive: false,
    isSearchUpdatesActive: false,
    isLicenseModalActive: false,
    isIdentityModalActive: false,
    isMainSideBarActive: false,
    isEmailVerifyModalActive: false,
  },
  reducers: {
    toggleLoginModal: (state) => {
      state.isLoginModalActive = !state.isLoginModalActive;
    },
    toggleSignOutModal: (state) => {
      state.isSignOutModalActive = !state.isSignOutModalActive;
    },
    toggleRegisterModal: (state) => {
      state.isRegisterModalActive = !state.isRegisterModalActive;
    },
    toggleLocationModal: (state) => {
      state.isLocationModalActive = !state.isLocationModalActive;
    },
    toggleLicenseModal: (state) => {
      state.isLicenseModalActive = !state.isLicenseModalActive;
    },
    toggleIdentityModal: (state) => {
      state.isIdentityModalActive = !state.isIdentityModalActive;
    },
    toggleSideBarModal: (state) => {
      state.isMainSideBarActive = !state.isMainSideBarActive;
    },
    toggleFilter: (state) => {
      state.isFilterActive = !state.isFilterActive;
    },
    toggleSearchUpdate: (state) => {
      state.isSearchUpdatesActive = !state.isSearchUpdatesActive;
    },
    toggleEmailVerifyModal: (state) => {
      state.isEmailVerifyModalActive = !state.isEmailVerifyModalActive;
    },
    handleRestAll: (state) => {
      state.isLoginModalActive = false;
      state.isRegisterModalActive = false;
      state.isLocationModalActive = false;
      state.isFilterActive = false;
      state.isSearchUpdatesActive = false;
      state.isLicenseModalActive = false;
      state.isIdentityModalActive = false;
      state.isMainSideBarActive = false;
      state.isEmailVerifyModalActive = false;
    },
  },
});

export const {
  toggleLoginModal,
  toggleSignOutModal,
  toggleRegisterModal,
  toggleLocationModal,
  toggleFilter,
  toggleSearchUpdate,
  toggleLicenseModal,
  toggleIdentityModal,
  toggleSideBarModal,
  toggleEmailVerifyModal,
  handleRestAll,
} = ModalSlice.actions;

export default ModalSlice.reducer;
