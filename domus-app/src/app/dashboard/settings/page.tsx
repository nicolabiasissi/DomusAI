"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { User, Bell, Shield, CreditCard, Zap, DollarSign, Globe } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { UpgradeModal } from "@/components/ui/upgrade-modal";
import { makeInitials } from "@/lib/auth";
import { CURRENCIES, CurrencyCode } from "@/lib/currency";
import { useI18n } from "@/lib/use-i18n";
import { Locale } from "@/lib/i18n";

const LANGUAGES: { code: Locale; label: string; native: string }[] = [
  { code: "en", label: "English",  native: "English"  },
  { code: "it", label: "Italian",  native: "Italiano" },
];

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const t = useI18n();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
  });

  if (!user) return null;

  const saveProfile = () => {
    if (!profileForm.name.trim()) return;
    updateUser({
      name: profileForm.name.trim(),
      email: profileForm.email.trim().toLowerCase(),
      initials: makeInitials(profileForm.name),
    });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const togglePref = (key: keyof typeof user.notifPrefs) => {
    updateUser({ notifPrefs: { ...user.notifPrefs, [key]: !user.notifPrefs[key] } });
  };

  const savePassword = () => {
    setPasswordSaved(true);
    setTimeout(() => setPasswordSaved(false), 2500);
  };

  const notifToggles = [
    { key: "expenseReminders" as const, labelKey: "settings.notif.expenseReminders" as const },
    { key: "monthlySummary"   as const, labelKey: "settings.notif.monthlySummary"   as const },
    { key: "propertyAlerts"   as const, labelKey: "settings.notif.propertyAlerts"   as const },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zinc-100">{t("settings.title")}</h1>
        <p className="text-zinc-400 mt-1">{t("settings.subtitle")}</p>
      </div>

      <div className="space-y-6">
        {/* Profile */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100">{t("settings.profile.title")}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{t("settings.profile.desc")}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <label className="text-sm text-zinc-400">{t("settings.profile.name")}</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <label className="text-sm text-zinc-400">{t("settings.profile.email")}</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              />
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              {profileSaved && (
                <span className="text-xs text-emerald-400 font-medium">{t("settings.profile.saved")}</span>
              )}
              <button
                onClick={saveProfile}
                className="bg-white text-zinc-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100">{t("settings.notif.title")}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{t("settings.notif.desc")}</p>
            </div>
          </div>
          <div className="space-y-3">
            {notifToggles.map(({ key, labelKey }) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b border-zinc-800/50 last:border-0"
              >
                <span className="text-sm text-zinc-300">{t(labelKey)}</span>
                <button
                  onClick={() => togglePref(key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    user.notifPrefs[key] ? "bg-white" : "bg-zinc-700"
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-zinc-900 transition-transform ${
                      user.notifPrefs[key] ? "translate-x-[18px]" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </Card>

        {/* Language */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <Globe className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100">{t("settings.language.title")}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{t("settings.language.desc")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map(({ code, native }) => {
              const active = (user.language ?? "en") === code;
              return (
                <button
                  key={code}
                  onClick={() => updateUser({ language: code })}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                    active
                      ? "bg-white text-zinc-950 border-white"
                      : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {native}
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-zinc-600 mt-4">{t("settings.language.note")}</p>
        </Card>

        {/* Currency */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100">{t("settings.currency.title")}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{t("settings.currency.desc")}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {(Object.entries(CURRENCIES) as [CurrencyCode, { symbol: string; name: string }][]).map(
              ([code, { symbol, name }]) => {
                const active = (user.currency ?? "EUR") === code;
                return (
                  <button
                    key={code}
                    onClick={() => updateUser({ currency: code })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      active
                        ? "bg-white text-zinc-950 border-white"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200"
                    }`}
                  >
                    <span className="font-bold">{symbol}</span>
                    <span>{code}</span>
                    <span className="text-xs opacity-60">{name}</span>
                  </button>
                );
              }
            )}
          </div>
          <p className="text-[11px] text-zinc-600 mt-4">{t("settings.currency.note")}</p>
        </Card>

        {/* Security */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100">{t("settings.security.title")}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{t("settings.security.desc")}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <label className="text-sm text-zinc-400">{t("settings.security.currentPwd")}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <label className="text-sm text-zinc-400">{t("settings.security.newPwd")}</label>
              <input
                type="password"
                placeholder="••••••••"
                className="md:col-span-2 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              />
            </div>
            <div className="pt-2 flex items-center justify-end gap-3">
              {passwordSaved && (
                <span className="text-xs text-emerald-400 font-medium">{t("settings.security.saved")}</span>
              )}
              <button
                onClick={savePassword}
                className="bg-white text-zinc-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
              >
                {t("settings.security.updatePwd")}
              </button>
            </div>
          </div>
        </Card>

        {/* Plan */}
        <Card>
          <div className="flex items-start gap-4 mb-6">
            <div className="h-10 w-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-zinc-100">{t("settings.plan.title")}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{t("settings.plan.desc")}</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800">
            <div>
              <p className="font-bold text-zinc-100 flex items-center gap-2">
                {user.plan === "Pro" && <Zap className="h-4 w-4 text-amber-400" />}
                {user.plan === "Pro" ? t("plan.pro") : t("plan.basic")}
              </p>
              <p className="text-sm text-zinc-500 mt-0.5">
                {user.plan === "Pro"
                  ? t("settings.plan.proFeatures")
                  : t("settings.plan.basicFeatures")}
              </p>
            </div>
            {user.plan !== "Pro" ? (
              <button
                onClick={() => setShowUpgrade(true)}
                className="border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg font-bold text-sm hover:border-zinc-500 hover:text-zinc-100 transition-all"
              >
                {t("common.upgrade")}
              </button>
            ) : (
              <span className="text-xs text-amber-400 font-bold px-3 py-1.5 bg-amber-400/10 border border-amber-400/20 rounded-lg">
                {t("settings.plan.active")}
              </span>
            )}
          </div>
        </Card>
      </div>

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
