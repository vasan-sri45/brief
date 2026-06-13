// import { createSlice } from "@reduxjs/toolkit";

// /* ---------- SAFE STORAGE READER ---------- */
// const getStoredUser = () => {
//   if (typeof window === "undefined") return null;

//   try {
//     const data = localStorage.getItem("bc_user");
//     return data ? JSON.parse(data) : null;
//   } catch {
//     return null;
//   }
// };

// /* ---------- INITIAL STATE ---------- */
// const initialState = {
//   user: null,
//   isLoading: false,
//   hydrated: false,
// };

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     /* LOGIN SUCCESS */
//     setUser(state, action) {
//       state.user = action.payload;
//       state.hydrated = true;

//       if (typeof window !== "undefined") {
//         localStorage.setItem("bc_user", JSON.stringify(action.payload));
//       }
//     },

//     /* LOGOUT */
//     clearUser(state) {
//       state.user = null;
//       state.hydrated = true;

//       if (typeof window !== "undefined") {
//         localStorage.removeItem("bc_user");
//       }
//     },

//     /* APP START HYDRATION */
//     hydrateUser(state, action) {
//       state.user = action.payload;
//       state.hydrated = true;
//     },

//     setLoading(state, action) {
//       state.isLoading = action.payload;
//     },
//   },
// });

// export const { setUser, clearUser, hydrateUser, setLoading } = authSlice.actions;
// export default authSlice.reducer;

// /* ---------- EXPORT HELPER ---------- */
// export { getStoredUser };


import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "bc_user";

export const getStoredUser = () => {
  if (typeof window === "undefined") return null;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

const initialState = {
  user: null,
  isLoading: true,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.hydrated = true;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
      }
    },

    clearUser(state) {
      state.user = null;
      state.hydrated = true;
      state.isLoading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    },

    hydrateUser(state, action) {
      state.user = action.payload;
      state.hydrated = true;
      state.isLoading = false;
    },

    setLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, hydrateUser, setLoading } = authSlice.actions;
export default authSlice.reducer;
