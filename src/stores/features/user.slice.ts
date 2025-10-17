import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import { StorageSliceName } from "@/constants/slice.constant";
import { type RootState } from "@/stores/store";
import { type User } from "@/types/user.type";

interface UserState {
  user: User | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: StorageSliceName.User,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
  },
});

export const userSelector = (state: RootState) => state.user;
export const { setUser } = userSlice.actions;
export const userReducer = userSlice.reducer;
