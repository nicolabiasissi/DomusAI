"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Receipt,
  Inbox,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LogoWordmark } from "@/components/ui/logo";
import { useAuth } from "@/context/auth-context";
import { UpgradeModal } from "@/components/ui/upgrade-modal";
import { useI18n } from "@/lib/use-i18n";

function NavLink({
  item,
  isActive,
}: {
  item: { name: string; href: string; icon: React.ElementType };
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150",
        isActive
          ? "bg-white/10 text-white ring-1 ring-white/10"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100"
      )}
    >
      <item.icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors duration-150",
          isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
        )}
      />
      <span className="flex-1">{item.name}</span>
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-white/60 shrink-0" />
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const isPro = user?.plan === "Pro";
  const t = useI18n();

  const mainNav = [
    { name: t("nav.dashboard"),  href: "/dashboard",            icon: LayoutDashboard },
    { name: t("nav.properties"), href: "/dashboard/properties", icon: Home },
    { name: t("nav.expenses"),   href: "/dashboard/expenses",   icon: Receipt },
    { name: t("nav.inbox"),      href: "/dashboard/inbox",      icon: Inbox },
  ];

  const accountNav = [
    { name: t("nav.settings"), href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <>
      <div className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800/60 shrink-0">
        {/* Logo */}
        <div className="flex h-14 items-center px-5 border-b border-zinc-800/60">
          <LogoWordmark />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {t("nav.main")}
            </p>
            <div className="space-y-0.5">
              {mainNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
              {t("nav.account")}
            </p>
            <div className="space-y-0.5">
              {accountNav.map((item) => (
                <NavLink
                  key={item.href}
                  item={item}
                  isActive={pathname === item.href}
                />
              ))}
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-zinc-800/60 p-3 space-y-2">
          {/* Plan badge */}
          <div className="rounded-xl bg-zinc-900 border border-zinc-800/80 p-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                {t("plan.yourPlan")}
              </span>
              <span
                className={cn(
                  "text-[10px] font-bold px-1.5 py-0.5 rounded-full border",
                  isPro
                    ? "bg-amber-400/10 text-amber-400 border-amber-400/30"
                    : "bg-zinc-800 text-zinc-400 border-zinc-700/60"
                )}
              >
                {isPro ? t("plan.pro") : t("plan.basic")}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              {isPro ? t("plan.proDesc") : t("plan.basicDesc")}
            </p>
            {!isPro ? (
              <button
                onClick={() => setShowUpgrade(true)}
                className="mt-2.5 flex w-full items-center justify-center gap-1 text-[11px] font-bold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 rounded-lg py-1.5 transition-colors duration-150 border border-zinc-700/50"
              >
                {t("plan.upgradePlan")}
              </button>
            ) : (
              <div className="mt-2.5 flex w-full items-center justify-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-400/10 rounded-lg py-1.5 border border-amber-400/20">
                <Zap className="h-3 w-3" /> {t("plan.proActive")}
              </div>
            )}
          </div>

          {/* User row + logout */}
          <button
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-zinc-900 transition-colors duration-150"
          >
            <div className="h-8 w-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0 text-[11px] font-bold text-zinc-200 ring-1 ring-zinc-600/60">
              {user?.initials ?? "??"}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-medium text-zinc-200 truncate leading-tight">
                {user?.name ?? ""}
              </p>
              <p className="text-[11px] text-zinc-500 truncate leading-tight">
                {user?.email ?? ""}
              </p>
            </div>
            <LogOut className="h-3.5 w-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors duration-150" />
          </button>
        </div>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </>
  );
}
