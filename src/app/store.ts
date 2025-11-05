import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "../shared/lib/features/RoleSlice"

export const store = configureStore({
    reducer:{
        roleSlice: roleReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
