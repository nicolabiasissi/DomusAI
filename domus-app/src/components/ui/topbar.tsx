"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, X } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { SearchPanel } from "@/components/ui/search-panel";
import { useI18n } from "@/lib/use-i18n";

export function Topbar() {
  const pathname = usePathname();
  const { user, updateUser } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const t = useI18n();

  const firstName = user?.name.split(" ")[0] ?? "there";

  const PAGE_META: Record<string, { title: string; sub: string }> = {
    "/dashboard":            { title: t("page.dashboard.title"),  sub: `${t("page.dashboard.sub")}, ${firstName}` },
    "/dashboard/properties": { title: t("page.properties.title"), sub: t("page.properties.sub") },
    "/dashboard/expenses":   { title: t("page.expenses.title"),   sub: t("page.expenses.sub") },
    "/dashboard/inbox":      { title: t("page.inbox.title"),      sub: t("page.inbox.sub") },
    "/dashboard/settings":   { title: t("page.settings.title"),   sub: t("page.settings.sub") },
  };
  const meta = PAGE_META[pathname] ?? { title: t("page.dashboard.title"), sub: "" };

  const unread = user?.notifications.filter((n) => !n.read) ?? [];
  const unreadCount = unread.length;

  useEffect(() => {
    if (!showNotifs) return;
    function onClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !bellRef.current?.contains(e.target as Node)
      ) {
        setShowNotifs(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [showNotifs]);

  const markRead = (id: string) => {
    if (!user) return;
    updateUser({
      notifications: user.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    });
  };

  const markAllRead = () => {
    if (!user) return;
    updateUser({
      notifications: user.notifications.map((n) => ({ ...n, read: true })),
    });
  };

  return (
    <header className="h-14 border-b border-zinc-800/70 flex items-center justify-between px-6 shrink-0 bg-zinc-950 relative z-40">
      <div className="flex flex-col justify-center gap-0.5">
        <p className="text-sm font-semibold text-zinc-100 leading-none">{meta.title}</p>
        {meta.sub && (
          <p className="text-[11px] text-zinc-500 leading-none">{meta.sub}</p>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setShowSearch(true)}
          className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
        >
          <Search className="h-4 w-4" />
        </button>

        {showSearch && <SearchPanel onClose={() => setShowSearch(false)} />}

        {/* Bell + notification panel */}
        <div className="relative">
          <button
            ref={bellRef}
            onClick={() => setShowNotifs((v) => !v)}
            className="relative h-8 w-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
            )}
          </button>

          {showNotifs && (
            <div
              ref={panelRef}
              className="absolute top-full right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-100">{t("notif.title")}</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      {unreadCount} {t("notif.new")}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      {t("notif.markAllRead")}
                    </button>
                  )}
                  <button
                    onClick={() => setShowNotifs(false)}
                    className="text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-zinc-800/60 max-h-72 overflow-y-auto">
                {(user?.notifications ?? []).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 hover:bg-zinc-800/40 transition-colors",
                      !n.read && "bg-zinc-800/20"
                    )}
                  >
                    <div className="flex items-start gap-2.5">
                      {!n.read && (
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                      )}
                      <div className={cn("flex-1 min-w-0", n.read && "pl-4")}>
                        <p className="text-xs font-semibold text-zinc-200 truncate">{n.title}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{n.body}</p>
                        <p className="text-[10px] text-zinc-600 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
                {(user?.notifications ?? []).length === 0 && (
                  <p className="px-4 py-6 text-sm text-zinc-600 text-center">
                    {t("notif.empty")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-zinc-800 mx-1.5" />

        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-zinc-800/60 transition-all"
        >
          <div className="h-7 w-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-bold text-zinc-100 shrink-0">
            {user?.initials ?? "?"}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-[12px] font-medium text-zinc-100 leading-none">
              {user?.name.split(" ")[0] ?? ""} {user?.name.split(" ").slice(-1)[0]?.charAt(0) ?? ""}.
            </p>
            <p className="text-[10px] text-zinc-500 leading-none mt-0.5">
              {user?.plan === "Pro" ? t("plan.pro") : t("plan.basic")} Plan
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}
