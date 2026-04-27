"use client";

import Link from "next/link";
import { StatCard } from "@/components/ui/card";
import { Receipt, Home, TrendingDown, Wallet, ArrowRight } from "lucide-react";
import { DashboardGreeting } from "@/components/ui/dashboard-greeting";
import { MONTHLY_SPENDING, MonthlySpend, Expense } from "@/lib/mock-data";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, convert, CURRENCIES, CurrencyCode } from "@/lib/currency";
import { useI18n } from "@/lib/use-i18n";
import { cn } from "@/lib/utils";
import { categoryLabel, expenseTitleLabel } from "@/lib/translation-helpers";


function SpendingChart({ data, currency }: { data: MonthlySpend[]; currency: CurrencyCode }) {
  const W = 600;
  const H = 150;
  const padX = 4;
  const padT = 8;
  const padB = 22;
  const chartW = W - padX * 2;
  const chartH = H - padT - padB;

  const symbol = CURRENCIES[currency].symbol;
  const converted = data.map((d) => ({ ...d, amount: Math.round(convert(d.amount, currency)) }));

  const max = Math.max(...converted.map((d) => d.amount));
  const ceiling = Math.ceil(max / 1000) * 1000;

  const toX = (i: number) => padX + (i / (converted.length - 1)) * chartW;
  const toY = (v: number) => padT + chartH - (v / ceiling) * chartH;

  const pts = converted.map((d, i) => ({ ...d, x: toX(i), y: toY(d.amount) }));
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `M ${pts[0].x},${pts[0].y} ${pts
    .slice(1)
    .map((p) => `L ${p.x},${p.y}`)
    .join(" ")} L ${pts[pts.length - 1].x},${padT + chartH} L ${pts[0].x},${padT + chartH} Z`;

  const yTicks = [0.25, 0.5, 0.75, 1].map((f) => ({
    y: toY(f * ceiling),
    label: `${symbol}${((f * ceiling) / 1000).toFixed(0)}k`,
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {yTicks.map((t) => (
        <line key={t.y} x1={padX} y1={t.y} x2={W - padX} y2={t.y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {yTicks.map((t) => (
        <text key={t.label} x={padX + 2} y={t.y - 3} fontSize="8" fill="rgba(255,255,255,0.2)">{t.label}</text>
      ))}
      <path d={area} fill="rgba(255,255,255,0.04)" />
      <polyline points={polyline} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => {
        const isLast = i === pts.length - 1;
        return (
          <circle key={p.month} cx={p.x} cy={p.y} r={isLast ? 3.5 : 2} fill={isLast ? "white" : "rgba(255,255,255,0.35)"}>
            <title>{symbol}{p.amount.toLocaleString("en")}</title>
          </circle>
        );
      })}
      {pts.map((p) => (
        <text key={p.month} x={p.x} y={H - 4} textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.3)">{p.month}</text>
      ))}
    </svg>
  );
}

function CategoryBreakdown({
  expenses,
  t,
}: {
  expenses: Expense[];
  t: ReturnType<typeof useI18n>;
}) {
  const totals = expenses.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + e.amount;
    return acc;
  }, {});

  const sorted = Object.entries(totals).sort(([, a], [, b]) => b - a);
  const grand = sorted.reduce((sum, [, v]) => sum + v, 0);

  if (grand === 0) {
    return <p className="text-sm text-zinc-600 text-center py-6">{t("dash.noExpenseData")}</p>;
  }

  return (
    <div className="space-y-3.5">
      {sorted.map(([cat, amount]) => {
        const pct = Math.round((amount / grand) * 100);
        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-zinc-400">{categoryLabel(cat, t)}</span>
              <span className="text-xs font-bold text-zinc-200">${amount.toLocaleString()}</span>
            </div>
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-zinc-400 rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[10px] text-zinc-600 mt-1">{pct}%</p>
          </div>
        );
      })}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { properties, expenses } = useData();
  const t = useI18n();

  const isPro = user?.plan === "Pro";
  const currency = (user?.currency ?? "EUR") as CurrencyCode;
  const visibleProperties = isPro ? properties : properties.slice(0, 1);
  const visibleIds = new Set(visibleProperties.map((p) => p.id));
  const activeExpenses = expenses.filter((e) => visibleIds.has(e.propertyId));

  const paid    = activeExpenses.filter((e) => e.status === "PAID");
  const pending = activeExpenses.filter((e) => e.status === "PENDING");
  const pendingAmount = pending.reduce((sum, e) => sum + e.amount, 0);

  const currentMonth = MONTHLY_SPENDING[MONTHLY_SPENDING.length - 1];
  const prevMonth    = MONTHLY_SPENDING[MONTHLY_SPENDING.length - 2];
  const spendChange  = Math.round(((currentMonth.amount - prevMonth.amount) / prevMonth.amount) * 100);
  const spendUp      = spendChange > 0;

  const avgMonthly = Math.round(
    MONTHLY_SPENDING.reduce((s, m) => s + m.amount, 0) / MONTHLY_SPENDING.length
  );

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <DashboardGreeting />
          <p className="text-sm text-zinc-500 mt-1">{t("dash.tagline")}</p>
        </div>
        <Link
          href="/dashboard/expenses"
          className="flex items-center gap-2 bg-white text-zinc-950 px-4 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 shrink-0"
        >
          {t("dash.newExpense")}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={t("dash.thisMonth")}
          value={formatCurrency(currentMonth.amount, currency)}
          subtext={`${currentMonth.month} ${t("dash.totalSpend")}`}
          icon={Receipt}
          trend={{
            direction: spendUp ? "down" : "up",
            label: `${spendUp ? "+" : "-"}${Math.abs(spendChange)}% vs ${prevMonth.month}`,
          }}
        />
        <StatCard
          title={t("dash.outstanding")}
          value={formatCurrency(pendingAmount, currency)}
          subtext={`${pending.length} ${pending.length !== 1 ? t("dash.unpaidExpenses") : t("dash.unpaidExpense")}`}
          icon={TrendingDown}
          trend={{
            direction: pending.length > 0 ? "down" : "up",
            label: pending.length > 0 ? t("dash.actionNeeded") : t("dash.allClear"),
          }}
        />
        <StatCard
          title={t("dash.avgMonth")}
          value={formatCurrency(avgMonthly, currency)}
          subtext={t("dash.12monthAvg")}
          icon={Wallet}
          trend={{
            direction: currentMonth.amount <= avgMonthly ? "up" : "down",
            label: currentMonth.amount <= avgMonthly ? t("dash.belowAverage") : t("dash.aboveAverage"),
          }}
        />
        <StatCard
          title={t("dash.portfolio")}
          value={visibleProperties.length.toString()}
          subtext={`${paid.length} ${t("dash.expensesPaid")}`}
          icon={Home}
          trend={{ direction: "up", label: t("dash.allActive") }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="font-semibold text-zinc-100">{t("dash.monthlySpending")}</h3>
              <p className="text-xs text-zinc-500 mt-0.5">{t("dash.last12months")}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-zinc-100">
                {formatCurrency(currentMonth.amount, currency)}
              </p>
              <p className={cn("text-xs mt-0.5 font-medium", spendUp ? "text-red-400" : "text-emerald-400")}>
                {spendUp ? "↑" : "↓"} {Math.abs(spendChange)}% vs {prevMonth.month}
              </p>
            </div>
          </div>
          <SpendingChart data={MONTHLY_SPENDING} currency={currency} />
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-100">{t("dash.upcoming")}</h3>
            <Link
              href="/dashboard/expenses"
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-2.5">
            {pending.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between p-3 rounded-lg bg-zinc-800/40 border border-zinc-800/60 hover:border-zinc-700 transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-100 truncate">{expenseTitleLabel(e.title, t)}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{e.dueDate}</p>
                </div>
                <div className="text-right shrink-0 ml-3">
                  <p className="text-sm font-bold text-zinc-100">{formatCurrency(e.amount, currency)}</p>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400">
                    {t("common.pending")}
                  </span>
                </div>
              </div>
            ))}
            {pending.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-6">{t("dash.noPending")}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <h3 className="font-semibold text-zinc-100 mb-5">{t("dash.byCategory")}</h3>
          <CategoryBreakdown expenses={activeExpenses} t={t} />
        </div>

        <div className="lg:col-span-2 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-zinc-100">{t("dash.recentExpenses")}</h3>
            <Link
              href="/dashboard/expenses"
              className="text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              {t("common.viewAll")} <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-1">
            {activeExpenses.slice(0, 6).map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800/40 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-700 transition-colors">
                    <Receipt className="h-3.5 w-3.5 text-zinc-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-zinc-100 truncate">{expenseTitleLabel(expense.title, t)}</p>
                    <p className="text-[11px] text-zinc-500">
                      {categoryLabel(expense.category, t)} · {properties.find((p) => p.id === expense.propertyId)?.name}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-semibold text-zinc-100">{formatCurrency(expense.amount, currency)}</p>
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                      expense.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-400"
                    )}
                  >
                    {expense.status === "PAID" ? t("common.paid") : t("common.pending")}
                  </span>
                </div>
              </div>
            ))}
            {activeExpenses.length === 0 && (
              <p className="text-sm text-zinc-600 text-center py-6">{t("dash.noExpenses")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
