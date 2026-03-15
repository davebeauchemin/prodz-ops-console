"use client";

import { AppHeader } from "@/components/app-header";

export default function SetterReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <AppHeader showNav />
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-8">
        {children}
      </main>
    </div>
  );
}
