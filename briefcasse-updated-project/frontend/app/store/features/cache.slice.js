import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  services: null,
  blogs: {},
  purchasedServices: null,
  dashboardServices: null,
  updatedAt: {},
};

const cacheSlice = createSlice({
  name: "cache",
  initialState,
  reducers: {
    setServicesCache(state, action) {
      state.services = action.payload;
      state.updatedAt.services = Date.now();
    },
    setBlogsCache(state, action) {
      const { key, data } = action.payload;
      state.blogs[key] = data;
      state.updatedAt[`blogs:${key}`] = Date.now();
    },
    setPurchasedServicesCache(state, action) {
      state.purchasedServices = action.payload;
      state.updatedAt.purchasedServices = Date.now();
    },
    setDashboardServicesCache(state, action) {
      state.dashboardServices = action.payload;
      state.updatedAt.dashboardServices = Date.now();
    },
  },
});

export const {
  setServicesCache,
  setBlogsCache,
  setPurchasedServicesCache,
  setDashboardServicesCache,
} = cacheSlice.actions;

export default cacheSlice.reducer;
