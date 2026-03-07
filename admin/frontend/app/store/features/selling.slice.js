import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  lastUpdated: null,
};

const sellingSlice = createSlice({
  name: "selling",
  initialState,
  reducers: {
    setSelling(state, action) {
      state.list = action.payload || [];
      state.lastUpdated = Date.now();
    },
    upsertItem(state, action) {
      const item = action.payload;
      const existingIndex = state.list.findIndex((x) => x.ticket === item.ticket);
      if (existingIndex >= 0) {
        state.list[existingIndex] = item;
      } else {
        state.list.unshift(item);
      }
      state.lastUpdated = Date.now();
    },
    clearSelling() {
      return initialState;
    },
  },
});

export const { setSelling, upsertItem, clearSelling } = sellingSlice.actions;
export default sellingSlice.reducer;
