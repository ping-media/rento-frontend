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
  isBookingTermActive: false,
  isBookingExtendModalActive: false,
  isCouponModalActive: false,
};

const ModalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    toggleLoginModal: (state, action) => {
      state.isLoginModalActive = action.payload || !state.isLoginModalActive;
    },
    toggleSignOutModal: (state) => {
      state.isSignOutModalActive = !state.isSignOutModalActive;
    },
    toggleRegisterModal: (state, action) => {
      state.isRegisterModalActive =
        action.payload || !state.isRegisterModalActive;
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
    closeSideBarModal: (state) => {
      state.isMainSideBarActive = false;
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
    toggleBookingTermModal: (state) => {
      state.isBookingTermActive = !state.isBookingTermActive;
    },
    toggleBookingExtendModal: (state) => {
      state.isBookingExtendModalActive = !state.isBookingExtendModalActive;
    },
    toggleCouponModal: (state) => {
      state.isCouponModalActive = !state.isCouponModalActive;
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
  toggleBookingTermModal,
  closeSideBarModal,
  toggleBookingExtendModal,
  toggleCouponModal,
  handleRestAll,
} = ModalSlice.actions;

export default ModalSlice.reducer;
