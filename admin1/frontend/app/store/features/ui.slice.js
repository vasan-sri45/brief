// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   filter: "All",
//   search: "",
//   month: "",
//   date: "",
//   assigned: "All",
//   status: "All",
// };

// const uiSlice = createSlice({
//   name: "ui",
//   initialState,
//   reducers: {
//     setFilter(state, action) {
//       state.filter = action.payload;
//     },
//     setSearch(state, action) {
//       state.search = action.payload;
//     },
//     setMonth(state, action) {
//       state.month = action.payload;
//     },
//     setDate(state, action) {
//       state.date = action.payload;
//     },
//     setAssigned(state, action) {
//       state.assigned = action.payload;   // NEW
//     },
//     setStatus(state, action) {
//       state.status = action.payload;     // NEW
//     },
//     resetUI() {
//       return initialState;
//     },
//   },
// });

// export const {
//   setFilter,
//   setSearch,
//   setMonth,
//   setDate,
//   setAssigned,
//   setStatus,
//   resetUI
// } = uiSlice.actions;
// export default uiSlice.reducer;



import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  month: "",
  date: "",
  assigned: "All",   // All | Assigned | Unassigned | EmployeeId
  status: "All",
  search: "",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setMonth: (s, a) => void(s.month = a.payload),
    setDate: (s, a) => void(s.date = a.payload),
    setAssigned: (s, a) => void(s.assigned = a.payload),
    setStatus: (s, a) => void(s.status = a.payload),
    setSearch: (s, a) => void(s.search = a.payload),
    resetUI: () => initialState,
  },
});

export const {
  setMonth,
  setDate,
  setAssigned,
  setStatus,
  setSearch,
  resetUI,
} = uiSlice.actions;

export default uiSlice.reducer;
