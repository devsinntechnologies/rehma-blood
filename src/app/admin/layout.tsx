"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getTokenExpiry, sessionExpired } from "@/store/authSlice";

const noopSubscribe = () => () => {};

/** False during SSR and hydration, true afterwards — the stored session only exists in the browser. */
const useIsHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const hydrated = useIsHydrated();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    }
  }, [accessToken, router]);

  // Sign out the moment the token expires instead of leaving every page failing with "Unauthorized".
  useEffect(() => {
    const expiry = accessToken ? getTokenExpiry(accessToken) : null;
    if (expiry === null) return;

    const expire = () => dispatch(sessionExpired());
    const remaining = expiry - Date.now();
    if (remaining <= 0) {
      expire();
      return;
    }
    // setTimeout can't wait longer than ~24.8 days; tokens here live for a day.
    const timer = window.setTimeout(expire, Math.min(remaining, 2_147_483_647));
    return () => window.clearTimeout(timer);
  }, [accessToken, dispatch]);

  if (!hydrated || !accessToken) {
    // Render nothing (and make no API calls) until the stored session is read, or while redirecting to /login.
    return null;
  }

  return (
    <ThemeProvider>
      <div className="flex h-[100dvh] w-full bg-[var(--adm-bg)] text-[var(--adm-fg)] overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative">
          {/* Header */}
          <div className="shrink-0">
            <Header />
          </div>

          {/* Page content */}
          <main className="flex-1 p-8 bg-[var(--adm-bg)]">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
