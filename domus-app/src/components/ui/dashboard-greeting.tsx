"use client";

import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/lib/use-i18n";

export function DashboardGreeting() {
  const { user } = useAuth();
  const t = useI18n();
  const name = user?.name.split(" ")[0] ?? "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t("greeting.morning") : hour < 18 ? t("greeting.afternoon") : t("greeting.evening");
  return (
    <h1 className="text-2xl font-bold text-zinc-100">
      {greeting}, {name}.
    </h1>
  );
}
