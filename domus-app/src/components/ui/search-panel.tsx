"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Receipt, Building2, Home, Building, Landmark, Warehouse, Store } from "lucide-react";
import { useData } from "@/context/data-context";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";
import { categoryLabel, expenseTitleLabel, propTypeLabel } from "@/lib/translation-helpers";

const ICON_MAP: Record<string, React.ElementType> = {
  building2: Building2,
  home:      Home,
  building:  Building,
  landmark:  Landmark,
  warehouse: Warehouse,
  store:     Store,
};

const COLOR_TEXT: Record<string, string> = {
  zinc:    "#a1a1aa",
  blue:    "#60a5fa",
  emerald: "#34d399",
  amber:   "#fbbf24",
  violet:  "#a78bfa",
  rose:    "#fb7185",
  sky:     "#38bdf8",
  orange:  "#fb923c",
};

const COLOR_BG: Record<string, string> = {
  zinc:    "rgba(63,63,70,0.5)",
  blue:    "rgba(37,99,235,0.2)",
  emerald: "rgba(5,150,105,0.2)",
  amber:   "rgba(217,119,6,0.2)",
  violet:  "rgba(124,58,237,0.2)",
  rose:    "rgba(225,29,72,0.2)",
  sky:     "rgba(2,132,199,0.2)",
  orange:  "rgba(234,88,12,0.2)",
};

export function SearchPanel({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { properties, expenses } = useData();
  const t = useI18n();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.toLowerCase().trim();

  const propResults = q
    ? properties.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const expResults = q
    ? expenses.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)
      ).slice(0, 4)
    : [];

  const hasResults = propResults.length > 0 || expResults.length > 0;

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl">
        {/* Search input */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 shadow-2xl">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
          />
          <div className="flex items-center gap-2">
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <kbd className="text-[10px] text-zinc-600 border border-zinc-800 rounded px-1.5 py-0.5 font-mono">
              ESC
            </kbd>
          </div>
        </div>

        {/* Results */}
        {q && (
          <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            {hasResults ? (
              <>
                {propResults.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                      {t("search.section.properties")}
                    </p>
                    {propResults.map((p) => {
                      const Icon = ICON_MAP[p.icon] ?? Building2;
                      const bg = COLOR_BG[p.color] ?? COLOR_BG.zinc;
                      const text = COLOR_TEXT[p.color] ?? COLOR_TEXT.zinc;
                      return (
                        <button
                          key={p.id}
                          onClick={() => navigate("/dashboard/properties")}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/60 transition-colors text-left"
                        >
                          <div
                            className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{ backgroundColor: bg, color: text }}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-zinc-200 truncate">{p.name}</p>
                            <p className="text-[11px] text-zinc-500 truncate">{p.address}</p>
                          </div>
                          <span
                            className="text-[10px] font-mono tracking-widest uppercase px-1.5 py-0.5 rounded shrink-0"
                            style={{ color: text }}
                          >
                            {propTypeLabel(p.type, t)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {expResults.length > 0 && (
                  <div className={propResults.length > 0 ? "border-t border-zinc-800/60" : ""}>
                    <p className="px-4 pt-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
                      {t("search.section.expenses")}
                    </p>
                    {expResults.map((e) => {
                      const prop = properties.find((p) => p.id === e.propertyId);
                      return (
                        <button
                          key={e.id}
                          onClick={() => navigate("/dashboard/expenses")}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-zinc-800/60 transition-colors text-left"
                        >
                          <div className="h-7 w-7 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                            <Receipt className="h-3.5 w-3.5 text-zinc-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-zinc-200 truncate">{expenseTitleLabel(e.title, t)}</p>
                            <p className="text-[11px] text-zinc-500 truncate">
                              {categoryLabel(e.category, t)} · {prop?.name ?? "Unknown"} · ${e.amount.toLocaleString()}
                            </p>
                          </div>
                          <span
                            className={cn(
                              "text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0",
                              e.status === "PAID"
                                ? "text-emerald-500 bg-emerald-500/10"
                                : "text-amber-400 bg-amber-400/10"
                            )}
                          >
                            {e.status === "PAID" ? t("common.paid") : t("common.pending")}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-zinc-500">
                  {t("search.noResults")} &ldquo;{query}&rdquo;
                </p>
                <p className="text-xs text-zinc-600 mt-1">{t("search.hint")}</p>
              </div>
            )}
            <div className="border-t border-zinc-800/40 px-4 py-2">
              <p className="text-[10px] text-zinc-700">
                {properties.length} {t("search.footer.properties")} · {expenses.length} {t("search.footer.expenses")}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
