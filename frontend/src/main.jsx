// src/main.jsx
import { StrictMode, lazy, Suspense } from "react";
import { createRoot }                  from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { C } from "./constants.js";

// ── Lazy chunks
const Auth          = lazy(() => import("./pages/Auth.jsx"));
const ResetPassword = lazy(() => import("./pages/ResetPassword.jsx"));
const VerifyEmail   = lazy(() => import("./pages/VerifyEmail.jsx"));
const AppShell = lazy(() => import("./App.jsx"));

function Loader() {
  return (
    <div style={{ background: C.black, minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Syne,sans-serif", fontSize: 22, fontWeight: 800,
          marginBottom: 20, letterSpacing: "-0.04em", color: "#f0f0f8" }}>
          Index<span style={{ color: C.green }}>Fast</span>
        </div>
        <span style={{ display: "inline-block", width: 28, height: 28,
          border: "2px solid rgba(0,255,136,0.2)", borderTopColor: C.green,
          borderRadius: "50%", animation: "spin 0.7s linear infinite" }}/>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// ── Guard для авторизованих
function RequireAuth() {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/app/login" replace state={{ from: window.location.pathname }}/>;
  }
  return <Outlet/>;
}

// ── Guard для гостей (якщо є токен — на dashboard)
function RequireGuest() {
  if (localStorage.getItem("access_token")) {
    return <Navigate to="/app/dashboard" replace/>;
  }
  return (
    <Suspense fallback={<Loader/>}>
      <Auth/>
    </Suspense>
  );
}

const router = createBrowserRouter([
  { path: "/app/login",    element: <RequireGuest/> },
  { path: "/app/register", element: <RequireGuest/> },
  { path: "/app/forgot",         element: <RequireGuest/> },
  // Reset password і Verify email — доступні без авторизації
  {
    path: "/app/reset-password",
    element: (
      <Suspense fallback={<Loader/>}>
        <ResetPassword/>
      </Suspense>
    ),
  },
  {
    path: "/app/verify-email",
    element: (
      <Suspense fallback={<Loader/>}>
        <VerifyEmail/>
      </Suspense>
    ),
  },
  {
    element: <RequireAuth/>,
    children: [{
      path: "/app/dashboard",
      element: <Suspense fallback={<Loader/>}><AppShell/></Suspense>,
    }],
  },
  { path: "/app",  element: <Navigate to="/app/dashboard" replace/> },
  { path: "/app/", element: <Navigate to="/app/dashboard" replace/> },
  { path: "*",     element: <Navigate to="/app/dashboard" replace/> },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:            30_000,
      gcTime:               5 * 60 * 1000,
      refetchOnWindowFocus: true,
      refetchOnReconnect:   false,
      retry:                2,
      retryDelay:           (n) => Math.min(500 * 2 ** n, 8_000),
    },
    mutations: { retry: 0 },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
    </QueryClientProvider>
  </StrictMode>
);
