import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth.slice";
import cacheReducer from "./features/cache.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cache: cacheReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

