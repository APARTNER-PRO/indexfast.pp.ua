// src/main.jsx
import { StrictMode }           from "react";
import { createRoot }           from "react-dom/client";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import App from "./App.jsx";

// Перевіряємо авторизацію до рендеру
if (!localStorage.getItem("access_token")) {
  const redirect = encodeURIComponent(window.location.pathname + window.location.search);
  window.location.replace(`/auth.html?redirect=${redirect}`);
} else {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Не рефетчити при mount якщо дані свіжі
        staleTime:            30_000,
        // Кешувати в пам'яті 5 хвилин після unmount
        gcTime:               5 * 60 * 1000,
        // Рефетчити при поверненні на вкладку
        refetchOnWindowFocus: true,
        // Не рефетчити при reconnect (зайве для дашборду)
        refetchOnReconnect:   false,
        // 2 retry з exponential backoff
        retry:                2,
        retryDelay:           (n) => Math.min(500 * 2 ** n, 8_000),
      },
      mutations: {
        // Мутації не ретраємо автоматично
        retry: 0,
      },
    },
  });

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App/>
      </QueryClientProvider>
    </StrictMode>
  );
}
