// // "use client";

// // import { useEffect } from "react";
// // import { useDispatch } from "react-redux";
// // import { hydrateUser, getStoredUser } from "../../store/features/auth.slice";

// // export default function AuthInitializer() {
// //   const dispatch = useDispatch();

// //   useEffect(() => {
// //     dispatch(hydrateUser(getStoredUser()));
// //   }, [dispatch]);

// //   return null;
// // }


// "use client";

// import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { setUser, clearUser } from "../../store/features/auth.slice";
// import { wakeServer } from "../../utils/wakeserver";
// import { getMe } from "../../api/auth.api";

// export default function AuthInitializer() {
//   const dispatch = useDispatch();
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const initAuth = async () => {
//       try {
//         // 1️⃣ Wake backend (render cold start fix)
//         await wakeServer();

//         // 2️⃣ Validate cookie session
//         const user = await getMe();

//         // 3️⃣ Store in redux
//         dispatch(setUser(user));
//       } catch (err) {
//         // invalid cookie
//         dispatch(clearUser());
//       } finally {
//         setReady(true);
//       }
//     };

//     initAuth();
//   }, [dispatch]);

//   if (!ready) return null; // block UI until auth resolved
// }


"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "../../store/features/auth.slice";
import { api } from "../../lib/axios";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/user"); // your protected route
        dispatch(setUser(res.data.user));
      } catch {
        dispatch(clearUser());
      }
    };

    init();
  }, [dispatch]);

  return null;
}
