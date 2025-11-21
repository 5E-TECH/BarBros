import { configureStore } from "@reduxjs/toolkit";
import  authSlice  from "../pages/auth/login/store/tokenSlice";
import roleSlice  from "../pages/auth/store/roleSlice";

export const store = configureStore({
    reducer:{
        roleSlice,
        authSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
