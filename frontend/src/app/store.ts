import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "../shared/lib/features/RoleSlice"
import  authSlice  from "../pages/auth/login/store/tokenSlice";

export const store = configureStore({
    reducer:{
        roleSlice: roleReducer,
        authSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
