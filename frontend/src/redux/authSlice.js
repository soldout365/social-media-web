import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Server state không nên lưu trong Redux
    userProfile: null,
    selectedUser: null,
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});
export const { setSelectedUser } = authSlice.actions;
export default authSlice.reducer;
