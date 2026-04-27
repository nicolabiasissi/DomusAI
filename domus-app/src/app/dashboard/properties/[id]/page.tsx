"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  Home,
  Building,
  Landmark,
  Warehouse,
  Store,
  Plus,
  Check,
  Receipt,
  Pencil,
  Trash2,
  Mail,
} from "lucide-react";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { Expense } from "@/lib/mock-data";
import { Modal } from "@/components/ui/modal";
import { formatCurrency, CurrencyCode } from "@/lib/currency";
import { useI18n } from "@/lib/use-i18n";
import { categoryLabel, expenseTitleLabel, propTypeLabel } from "@/lib/translation-helpers";
import { cn } from "@/lib/utils";

// ─── Shared config (mirrors properties/page.tsx) ─────────────────────────────

const ICON_OPTIONS = [
  { id: "building2", icon: Building2, label: "Building" },
  { id: "home",      icon: Home,      label: "Home" },
  { id: "building",  icon: Building,  label: "Office" },
  { id: "landmark",  icon: Landmark,  label: "Landmark" },
  { id: "warehouse", icon: Warehouse, label: "Warehouse" },
  { id: "store",     icon: Store,     label: "Commercial" },
] as const;

type IconId = typeof ICON_OPTIONS[number]["id"];

const ICON_MAP: Record<IconId, React.ElementType> = {
  building2: Building2,
  home:      Home,
  building:  Building,
  landmark:  Landmark,
  warehouse: Warehouse,
  store:     Store,
};

const COLOR_OPTIONS = [
  { id: "zinc",    bg: "rgba(63,63,70,0.5)",   text: "#a1a1aa", swatch: "#71717a" },
  { id: "blue",    bg: "rgba(37,99,235,0.2)",  text: "#60a5fa", swatch: "#3b82f6" },
  { id: "emerald", bg: "rgba(5,150,105,0.2)",  text: "#34d399", swatch: "#10b981" },
  { id: "amber",   bg: "rgba(217,119,6,0.2)",  text: "#fbbf24", swatch: "#f59e0b" },
  { id: "violet",  bg: "rgba(124,58,237,0.2)", text: "#a78bfa", swatch: "#8b5cf6" },
  { id: "rose",    bg: "rgba(225,29,72,0.2)",  text: "#fb7185", swatch: "#f43f5e" },
  { id: "sky",     bg: "rgba(2,132,199,0.2)",  text: "#38bdf8", swatch: "#0ea5e9" },
  { id: "orange",  bg: "rgba(234,88,12,0.2)",  text: "#fb923c", swatch: "#f97316" },
] as const;

type ColorId = typeof COLOR_OPTIONS[number]["id"];

function getColor(id: string) {
  return COLOR_OPTIONS.find((c) => c.id === id) ?? COLOR_OPTIONS[0];
}

const TYPES = ["Apartment", "Villa", "Loft", "House", "Studio"];
const CATEGORIES = ["Rent", "Utility", "Tax", "Maintenance", "Other"];


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { properties, setProperties, expenses, setExpenses } = useData();
  const { user } = useAuth();
  const t = useI18n();
  const currency = (user?.currency ?? "EUR") as CurrencyCode;

  const property = properties.find((p) => p.id === id);

  useEffect(() => {
    if (!property) router.replace("/dashboard/properties");
  }, [property, router]);

  const [editForm, setEditForm] = useState({
    name:    property?.name    ?? "",
    address: property?.address ?? "",
    type:    property?.type    ?? "Apartment",
    icon:    (property?.icon   ?? "building2") as IconId,
    color:   (property?.color  ?? "zinc")      as ColorId,
  });
  const [editSaved, setEditSaved] = useState(false);

  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "", category: "Utility", amount: "", dueDate: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!property) return null;

  const c = getColor(property.color);
  const Icon = (ICON_MAP[property.icon as IconId] ?? Building2) as React.ElementType;

  // ── Expenses for this property ──────────────────────────────────────────────
  const propExpenses = expenses.filter((e) => e.propertyId === id);
  const paidExpenses    = propExpenses.filter((e) => e.status === "PAID");
  const pendingExpenses = propExpenses.filter((e) => e.status === "PENDING");
  const totalAmount     = propExpenses.reduce((sum, e) => sum + e.amount, 0);

  const now = new Date();
  const currentMonthAmount = propExpenses
    .filter((e) => {
      const d = new Date(e.dueDate);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  // ── Handlers ────────────────────────────────────────────────────────────────

  const toggleStatus = (expId: string) => {
    setExpenses((prev) =>
      prev.map((e) => e.id === expId ? { ...e, status: e.status === "PAID" ? "PENDING" : "PAID" } : e)
    );
  };

  const handleSaveEdit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!editForm.name.trim() || !editForm.address.trim()) return;
    setProperties((prev) =>
      prev.map((p) => p.id === id ? { ...p, ...editForm } : p)
    );
    setEditSaved(true);
    setTimeout(() => setEditSaved(false), 2000);
  };

  const handleAddExpense = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!expenseForm.title || !expenseForm.amount || !expenseForm.dueDate) return;
    const newExp: Expense = {
      id: Date.now().toString(),
      title: expenseForm.title,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      dueDate: expenseForm.dueDate,
      status: "PENDING",
      propertyId: id,
    };
    setExpenses((prev) => [newExp, ...prev]);
    setShowAddExpense(false);
    setExpenseForm({ title: "", category: "Utility", amount: "", dueDate: "" });
  };

  const handleDelete = () => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    setExpenses((prev) => prev.filter((e) => e.propertyId !== id));
    router.replace("/dashboard/properties");
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-8 max-w-4xl">

      {/* Back nav */}
      <Link
        href="/dashboard/properties"
        className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {t("detail.backLink")}
      </Link>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex items-start gap-5">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: c.bg, color: c.text }}
        >
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">{property.name}</h1>
          <p className="text-[11px] font-mono tracking-widest uppercase mt-1" style={{ color: c.text }}>
            {propTypeLabel(property.type, t)}
          </p>
          <div className="flex items-center gap-2 text-sm text-zinc-400 mt-1.5">
            <MapPin className="h-3.5 w-3.5 text-zinc-600" />
            {property.address}
          </div>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: t("detail.totalExpenses"), value: formatCurrency(totalAmount, currency) },
          { label: t("detail.currentMonth"),  value: formatCurrency(currentMonthAmount, currency) },
          { label: t("detail.expenseCount"),  value: propExpenses.length.toString() },
          { label: t("detail.paidUnpaid"),    value: `${paidExpenses.length} / ${pendingExpenses.length}` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">{label}</p>
            <p className="text-2xl font-bold text-zinc-100 mt-1">{value}</p>
          </div>
        ))}
      </div>

      {/* ── Expenses list ──────────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="font-semibold text-zinc-100">{t("detail.expenses")}</h2>
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-white text-zinc-950 px-3 py-1.5 rounded-lg hover:bg-zinc-200 transition-all active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" /> {t("exp.add")}
          </button>
        </div>

        {propExpenses.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <Receipt className="h-8 w-8 text-zinc-700 mx-auto mb-3" />
            <p className="text-sm text-zinc-500">{t("detail.noExpenses")}</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50">
            {propExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800/20 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-zinc-100 truncate">{expenseTitleLabel(expense.title, t)}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    {categoryLabel(expense.category, t)} · {expense.dueDate}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 ml-4">
                  <p className="text-sm font-bold text-zinc-100">{formatCurrency(expense.amount, currency)}</p>
                  <button
                    onClick={() => toggleStatus(expense.id)}
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95",
                      expense.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                        : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                    )}
                  >
                    {expense.status === "PAID"
                      ? <><Check className="h-3 w-3 stroke-[3px]" /> {t("common.paid")}</>
                      : t("detail.markPaid")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── AI Inbox placeholder ───────────────────────────────────────────── */}
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6 flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-zinc-800/60 flex items-center justify-center shrink-0">
          <Mail className="h-5 w-5 text-zinc-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-300">{t("detail.aiInbox")}</p>
          <p className="text-xs text-zinc-500 mt-1">{t("detail.aiInboxDesc")}</p>
          <span className="inline-block mt-2 text-[10px] font-bold text-zinc-600 border border-zinc-800 rounded px-2 py-0.5 uppercase tracking-widest">
            {t("common.comingSoon")}
          </span>
        </div>
      </div>

      {/* ── Property Settings ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-2">
          <Pencil className="h-4 w-4 text-zinc-500" />
          <h2 className="font-semibold text-zinc-100">{t("detail.propertySettings")}</h2>
        </div>

        <form onSubmit={handleSaveEdit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.name")}</label>
              <input
                required
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.type")}</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              >
                {TYPES.map((ty) => <option key={ty} value={ty}>{propTypeLabel(ty, t)}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.address")}</label>
            <input
              required
              type="text"
              value={editForm.address}
              onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.icon")}</label>
            <div className="flex gap-2 flex-wrap">
              {ICON_OPTIONS.map(({ id: iconId, icon: Ic, label }) => (
                <button
                  key={iconId}
                  type="button"
                  title={label}
                  onClick={() => setEditForm((f) => ({ ...f, icon: iconId }))}
                  className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                    editForm.icon === iconId
                      ? "bg-white text-zinc-900 ring-2 ring-white/50"
                      : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                  )}
                >
                  <Ic className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.color")}</label>
            <div className="flex gap-2 flex-wrap">
              {COLOR_OPTIONS.map(({ id: colorId, swatch }) => (
                <button
                  key={colorId}
                  type="button"
                  onClick={() => setEditForm((f) => ({ ...f, color: colorId as ColorId }))}
                  className={cn(
                    "h-6 w-6 rounded-full border-2 transition-all",
                    editForm.color === colorId ? "border-white scale-110" : "border-zinc-700 hover:scale-105"
                  )}
                  style={{ backgroundColor: swatch }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="bg-white text-zinc-950 px-5 py-2 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
            >
              {editSaved ? t("detail.savedConfirm") : t("common.save")}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" /> {t("detail.deleteProperty")}
            </button>
          </div>
        </form>
      </div>

      {/* ── Add Expense modal ──────────────────────────────────────────────── */}
      {showAddExpense && (
        <Modal title={t("exp.add")} onClose={() => setShowAddExpense(false)}>
          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.title")}</label>
              <input
                required
                type="text"
                placeholder={t("exp.form.titlePlaceholder")}
                value={expenseForm.title}
                onChange={(e) => setExpenseForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.category")}</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, category: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                >
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{categoryLabel(cat, t)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.amount")}</label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="0"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm((f) => ({ ...f, amount: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.dueDate")}</label>
              <input
                required
                type="date"
                value={expenseForm.dueDate}
                onChange={(e) => setExpenseForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
            >
              {t("exp.add")}
            </button>
          </form>
        </Modal>
      )}

      {/* ── Delete confirm modal ───────────────────────────────────────────── */}
      {showDeleteConfirm && (
        <Modal title={t("prop.delete")} onClose={() => setShowDeleteConfirm(false)}>
          <p className="text-sm text-zinc-400 mb-2">
            {t("detail.deleteConfirmPre")} <span className="font-semibold text-zinc-200">{property.name}</span>?
          </p>
          <p className="text-xs text-zinc-600 mb-6">
            {t("detail.deleteLinkedPre")} {propExpenses.length} {t("detail.deleteLinkedPost")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 border border-zinc-700 text-zinc-300 py-2.5 rounded-lg font-bold text-sm hover:border-zinc-500 transition-all"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95"
            >
              {t("common.delete")}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
