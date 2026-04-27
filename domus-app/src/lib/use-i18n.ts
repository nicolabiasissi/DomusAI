"use client";

import { useAuth } from "@/context/auth-context";
import { t, Locale, TranslationKey } from "@/lib/i18n";

/** Returns a translation function bound to the user's selected locale. */
export function useI18n(): (key: TranslationKey) => string {
  const { user } = useAuth();
  const locale = (user?.language ?? "en") as Locale;
  return (key: TranslationKey) => t(locale, key);
}
