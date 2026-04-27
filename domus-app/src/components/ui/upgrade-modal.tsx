"use client";

import { Check, X, Zap } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/lib/use-i18n";

export function UpgradeModal({ onClose }: { onClose: () => void }) {
  const { user, updateUser } = useAuth();
  const isPro = user?.plan === "Pro";
  const t = useI18n();

  const basicFeatures = [t("upgrade.basic.f1"), t("upgrade.basic.f2"), t("upgrade.basic.f3")];
  const proFeatures   = [t("upgrade.pro.f1"), t("upgrade.pro.f2"), t("upgrade.pro.f3"), t("upgrade.pro.f4"), t("upgrade.pro.f5")];

  const handleUpgrade = () => {
    updateUser({ plan: "Pro" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 mx-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-zinc-100">{t("upgrade.heading")}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">{t("upgrade.subheading")}</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-200 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Basic */}
          <div className={`rounded-xl border p-4 ${user?.plan === "Basic" ? "border-zinc-600 bg-zinc-800/40" : "border-zinc-800"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-zinc-200">{t("plan.basic")}</span>
              {user?.plan === "Basic" && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-zinc-700 text-zinc-400">
                  {t("upgrade.current")}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-zinc-100 mb-0.5">{t("upgrade.free")}</p>
            <p className="text-xs text-zinc-500 mb-4">{t("upgrade.forever")}</p>
            <ul className="space-y-2">
              {basicFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-zinc-400">
                  <Check className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className={`rounded-xl border p-4 ${user?.plan === "Pro" ? "border-white/20 bg-white/5" : "border-white/10 bg-white/[0.03]"}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                {t("plan.pro")}
              </span>
              {user?.plan === "Pro" && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/10 text-zinc-300">
                  {t("upgrade.current")}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-zinc-100 mb-0.5">$29</p>
            <p className="text-xs text-zinc-500 mb-4">{t("upgrade.perMonth")}</p>
            <ul className="space-y-2">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-zinc-300">
                  <Check className="h-3.5 w-3.5 text-white shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-4">
          {!isPro ? (
            <button
              onClick={handleUpgrade}
              className="w-full bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="h-4 w-4" />
              {t("upgrade.cta")}
            </button>
          ) : (
            <p className="text-center text-sm text-emerald-400 font-medium py-1">
              {t("upgrade.alreadyPro")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
