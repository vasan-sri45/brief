import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth.slice";
import uiReducer from "./features/ui.slice";
import sellingReducer from "./features/selling.slice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    selling: sellingReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

// export const RootState = store.getState;
// export const AppDispatch = store.dispatch;