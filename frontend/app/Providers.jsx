"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { queryClient } from "./lib/queryClient";
import ScrollToTop from "./components/common/ScrollToTop";
import AuthInitializer from "./components/route/AuthInitializar";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
        {children}
        <ScrollToTop />
      </QueryClientProvider>
    </Provider>
  );
}
