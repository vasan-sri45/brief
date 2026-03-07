import {api} from "./api";

export async function logoutApi() {
  const { data } = await api.post("/logout");
  return data;
}


// export const getMe = async () => {
//   const res = await api.get("/user"); // cookie sent automatically
//   return res.data; // { success, user }
// };


export const getMe = async () => {
  try {
    // 1️⃣ Try user
    const res = await api.get("/user");
    return { user: res.data.user };
  } catch (err) {
    // 2️⃣ If not user, try employee
    const res = await api.get("/employee");
    return { user: res.data.user };
  }
};