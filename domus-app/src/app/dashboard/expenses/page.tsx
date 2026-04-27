"use client";

import { useState } from "react";
import { Expense } from "@/lib/mock-data";
import { useData } from "@/context/data-context";
import { useAuth } from "@/context/auth-context";
import { formatCurrency, CurrencyCode } from "@/lib/currency";
import { useI18n } from "@/lib/use-i18n";
import { categoryLabel } from "@/lib/translation-helpers";
import { Search, Plus, Check, Filter, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/ui/modal";

const CATEGORIES = ["Rent", "Utility", "Tax", "Maintenance", "Other"];

export default function ExpensesPage() {
  const { expenses, setExpenses, properties } = useData();
  const { user } = useAuth();
  const t = useI18n();
  const currency = (user?.currency ?? "EUR") as CurrencyCode;
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Utility",
    amount: "",
    dueDate: "",
    propertyId: properties[0]?.id ?? "",
  });

  const openModal = () => {
    setForm({
      title: "",
      category: "Utility",
      amount: "",
      dueDate: "",
      propertyId: properties[0]?.id ?? "",
    });
    setShowModal(true);
  };

  const toggleStatus = (id: string) => {
    setExpenses(prev => prev.map(e =>
      e.id === id ? { ...e, status: e.status === "PAID" ? "PENDING" : "PAID" } : e
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount || !form.dueDate) return;
    const newExpense: Expense = {
      id: Date.now().toString(),
      title: form.title,
      category: form.category,
      amount: Number(form.amount),
      dueDate: form.dueDate,
      status: "PENDING",
      propertyId: form.propertyId,
    };
    setExpenses(prev => [newExpense, ...prev]);
    setShowModal(false);
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filterLabel = (status: string) => {
    if (status === "ALL")     return t("common.all");
    if (status === "PAID")    return t("common.paid");
    return t("common.pending");
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">{t("exp.title")}</h1>
          <p className="text-zinc-400 mt-1">{t("exp.subtitle")}</p>
        </div>
        <button
          onClick={openModal}
          className="bg-white text-zinc-950 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Plus className="h-4 w-4" /> {t("exp.add")}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900/40 p-4 rounded-xl border border-zinc-800 backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder={t("exp.searchPlaceholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
            {["ALL", "PENDING", "PAID"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                  statusFilter === status
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {filterLabel(status)}
              </button>
            ))}
          </div>
          <button className="p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-zinc-100 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-widest font-bold">
                <th className="px-6 py-4">{t("exp.col.details")}</th>
                <th className="px-6 py-4">{t("exp.col.property")}</th>
                <th className="px-6 py-4">{t("exp.col.category")}</th>
                <th className="px-6 py-4">{t("exp.col.dueDate")}</th>
                <th className="px-6 py-4">{t("exp.col.amount")}</th>
                <th className="px-6 py-4 text-right">{t("exp.col.action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="group hover:bg-zinc-800/20 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-zinc-100 group-hover:text-white">{expense.title}</p>
                      {expense.invoicePdf && (
                        <a
                          href={`/invoices/${expense.invoicePdf}`}
                          download={expense.invoicePdf}
                          onClick={(e) => e.stopPropagation()}
                          title={expense.invoicePdf}
                          className="shrink-0 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/50 text-zinc-400 hover:text-zinc-200 hover:border-zinc-500 transition-colors"
                        >
                          <Download className="h-2.5 w-2.5" /> PDF
                        </a>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-600 mt-0.5 font-mono">{t("common.id")}: {expense.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-zinc-400">
                      {properties.find(p => p.id === expense.propertyId)?.name ?? "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-800/50 border border-zinc-700/50 px-2 py-1 rounded text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                      {categoryLabel(expense.category, t)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-500">{expense.dueDate}</td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-sm text-zinc-100">{formatCurrency(expense.amount, currency)}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleStatus(expense.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95",
                        expense.status === "PAID"
                          ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                          : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700"
                      )}
                    >
                      {expense.status === "PAID" ? (
                        <><Check className="h-3.5 w-3.5 stroke-[3px]" /> {t("common.paid")}</>
                      ) : (
                        t("common.markAsPaid")
                      )}
                    </button>
                  </td>
                </tr>
              ))}
              {filteredExpenses.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-zinc-600 italic">
                    {t("exp.noResults")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={t("exp.add")} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.title")}</label>
              <input
                required
                type="text"
                placeholder={t("exp.form.titlePlaceholder")}
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.category")}</label>
                <select
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{categoryLabel(c, t)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.amount")}</label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.amount}
                  onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.dueDate")}</label>
                <input
                  required
                  type="date"
                  value={form.dueDate}
                  onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("exp.form.property")}</label>
                <select
                  value={form.propertyId}
                  onChange={e => setForm(f => ({ ...f, propertyId: e.target.value }))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
                >
                  {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 mt-2"
            >
              {t("exp.add")}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
