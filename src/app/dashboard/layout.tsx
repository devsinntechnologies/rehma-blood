import { ThemeProvider } from "@/context/ThemeContext";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
