import { createSlice } from "@reduxjs/toolkit";
import { decryptData, encryptData } from "../../utils";

const UserSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    currentUser: null,
    userDocument: null,
    loading: false,
    error: null,
  },
  reducers: {
    handleLoadingUserData: (state) => {
      state.loading = true;
    },
    handleSignIn: (state, action) => {
      const encryptedUser = encryptData(action.payload);
      state.user = encryptedUser;
      state.loading = false;
    },
    handleCurrentUser: (state, action) => {
      const decryptedUser = decryptData(action.payload);
      state.currentUser = decryptedUser;
      state.loading = false;
    },
    handleAddUserDocument: (state, action) => {
      state.userDocument = action.payload;
      state.loading = false;
    },
    handleSignOut: (state) => {
      state.user = null;
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  handleLoadingUserData,
  handleSignIn,
  handleCurrentUser,
  handleAddUserDocument,
  handleSignOut,
} = UserSlice.actions;

export default UserSlice.reducer;
