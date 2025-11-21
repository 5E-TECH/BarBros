import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface IState {
  id: string | null,
  role: string | null,
  region:string | null
}

const initialState: IState = {
  id: null,
  role: localStorage.getItem("role") || null,
  region:null
};

export const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<string>) => {
      localStorage.setItem("role", action.payload);
      state.role = action.payload;
    },
    removeRole: (state) => {
      state.id = null;
      state.role = null;
    },
    setId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
  },
});

export const { setRole, removeRole, setId,} = roleSlice.actions;
export default roleSlice.reducer;
