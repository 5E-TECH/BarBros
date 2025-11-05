import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserRole } from "../../enum";

interface RoleState {
  role: UserRole | null;
}

const initialState: RoleState = {
  role: null,
};

const roleSlice = createSlice({
  name: "roleSlice",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, clearRole } = roleSlice.actions;
export default roleSlice.reducer;
