import type { ReactNode } from "react";

import Footer from "./Footer";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar />

      <div className="min-h-screen md:pl-64">
        <Navbar />

        <div className="flex min-h-screen flex-col">
          <main className="flex-1 pt-16 md:pt-0">
            <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
              {children}
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}