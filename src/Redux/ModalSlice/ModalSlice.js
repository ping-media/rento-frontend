import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
  isSelfieModalActive: false,
  isBookingDone: false,
};

const ModalSlice = createSlice({
  name: "modals",
  initialState,
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
    toggleLocationModal: (state, action) => {
      state.isLocationModalActive =
        action.payload || !state.isLocationModalActive;
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
    toggleBookingDoneModal: (state) => {
      state.isBookingDone = !state.isBookingDone;
    },
    toggleSelfieModal: (state) => {
      state.isSelfieModalActive = !state.isSelfieModalActive;
    },
    handleRestAll: () => initialState,
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
  toggleBookingDoneModal,
  toggleSelfieModal,
  handleRestAll,
} = ModalSlice.actions;

export default ModalSlice.reducer;
