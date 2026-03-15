"use client";

import { AppHeader } from "@/components/app-header";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-zinc-950">
      <AppHeader showNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
