import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  hydrated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload ?? null;
      state.hydrated = true;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        if (action.payload)
          localStorage.setItem("bc_user", JSON.stringify(action.payload));
      }
    },

    clearUser(state) {
      state.user = null;
      state.hydrated = true;
      state.isLoading = false;

      if (typeof window !== "undefined")
        localStorage.removeItem("bc_user");
    },

    rehydrateFromStorage(state) {
      if (typeof window === "undefined") return;

      try {
        const saved = localStorage.getItem("bc_user");
        if (saved) state.user = JSON.parse(saved);
      } catch {}

      state.hydrated = true;
      state.isLoading = false;
    },

    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, rehydrateFromStorage, setLoading } =
  authSlice.actions;

export default authSlice.reducer;