export const startEndOfDayUTC = (d = new Date()) => {
  const year = d.getFullYear();
  const month = d.getMonth();
  const date = d.getDate();

  const start = new Date(year, month, date, 0, 0, 0, 0);
  const end = new Date(year, month, date, 23, 59, 59, 999);

  const dayKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(
    date
  ).padStart(2, "0")}`;

  return { start, end, dayKey };
};

// utils/date.js

// export const startEndOfDayUTC = () => {
//   const now = new Date();

//   const year = now.getUTCFullYear();

//   const month = String(
//     now.getUTCMonth() + 1
//   ).padStart(2, "0");

//   const day = String(
//     now.getUTCDate()
//   ).padStart(2, "0");

//   const dayKey = `${year}-${month}-${day}`;

//   return { dayKey };
// };
