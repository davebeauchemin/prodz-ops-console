"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";

interface AppHeaderProps {
  showNav?: boolean;
}

export function AppHeader({ showNav = true }: AppHeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      router.push("/login");
    }
  }

  return (
    <header className="sticky top-0 z-10 flex w-full flex-row border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/95">
      <div className="flex flex-1 items-center justify-between px-4 py-2">
        <Link
          href="/setter-report"
          className="flex flex-col items-center gap-1 no-underline"
        >
          <div className="flex flex-col items-center justify-center gap-0.5 rounded-lg bg-black px-4 py-2">
            <div className="flex flex-row items-center justify-center gap-0.5">
              <Image
                src="/logo/logo-production-z-email-signature.png"
                alt="Production Z"
                width={200}
                height={50}
                className="h-8 w-auto object-contain"
              />
              <span className="text-sm font-medium text-white uppercase">Ops Console</span>
            </div>
            <span className="text-xs text-zinc-400">Powered by Module Rouge</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          {showNav && (
            <nav className="hidden items-center gap-4 sm:flex">
              <Link
                href="/setter-report"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Setter Report
              </Link>
              <Link
                href="/reports"
                className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Reports
              </Link>
            </nav>
          )}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              type="button"
              onClick={handleLogout}
              aria-label="Déconnexion"
              className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
