"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { useEffect } from "react";
import { rehydrateFromStorage } from "./store/features/auth.slice";
import { queryClient } from "./lib/queryClient";
import ScrollToTop from "./components/common/ScrollToTop";


export default function Providers({ children }) {
    
  useEffect(() => { store.dispatch(rehydrateFromStorage()); }, []);
  return (
    <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      {children}
       {/* <ReactQueryDevtools /> */}
       <ScrollToTop/>
    </QueryClientProvider>
    </Provider>
  );
}
