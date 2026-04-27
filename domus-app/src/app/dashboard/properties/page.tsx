"use client";

import { useState } from "react";
import { Property } from "@/lib/mock-data";
import { useData } from "@/context/data-context";
import {
  Plus,
  MapPin,
  Building2,
  Home,
  Building,
  Landmark,
  Warehouse,
  Store,
  ArrowRight,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { UpgradeModal } from "@/components/ui/upgrade-modal";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/use-i18n";
import { propTypeLabel } from "@/lib/translation-helpers";

// ─── Icon & colour config ────────────────────────────────────────────────────

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

// ─── Form ────────────────────────────────────────────────────────────────────

const TYPES = ["Apartment", "Villa", "Loft", "House", "Studio"];


const EMPTY_FORM = {
  name: "",
  address: "",
  type: "Apartment",
  icon: "building2" as IconId,
  color: "zinc" as ColorId,
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function PropertyIconDisplay({ iconId, color }: { iconId: string; color: string }) {
  const Icon = (ICON_MAP[iconId as IconId] ?? Building2) as React.ElementType;
  const c = getColor(color);
  return (
    <div
      className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-6"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      <Icon className="h-6 w-6" />
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PropertiesPage() {
  const { user } = useAuth();
  const { properties, setProperties, setExpenses } = useData();
  const t = useI18n();
  const [showModal, setShowModal]     = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [deletingId, setDeletingId]   = useState<string | null>(null);
  const [form, setForm]               = useState({ ...EMPTY_FORM });

  const isPro = user?.plan === "Pro";
  const visibleProperties = isPro ? properties : properties.slice(0, 1);
  const lockedCount = isPro ? 0 : Math.max(0, properties.length - 1);

  const openAdd = () => {
    if (!isPro && properties.length >= 1) {
      setShowUpgrade(true);
      return;
    }
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (p: Property) => {
    setForm({
      name:    p.name,
      address: p.address,
      type:    p.type,
      icon:    (p.icon as IconId) || "building2",
      color:   (p.color as ColorId) || "zinc",
    });
    setEditingId(p.id);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.address.trim()) return;

    if (editingId) {
      setProperties((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      setProperties((prev) => [
        { id: Date.now().toString(), ...form },
        ...prev,
      ]);
    }
    setShowModal(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    setProperties((prev) => prev.filter((p) => p.id !== deletingId));
    setExpenses((prev) => prev.filter((e) => e.propertyId !== deletingId));
    setDeletingId(null);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ ...EMPTY_FORM });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100">{t("prop.title")}</h1>
          <p className="text-zinc-400 mt-1">{t("prop.subtitle")}</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-white text-zinc-950 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-zinc-200 transition-all active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Plus className="h-4 w-4" /> {t("prop.add")}
        </button>
      </div>

      {/* Plan notice for Basic */}
      {!isPro && (
        <div className="flex items-center justify-between bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-400/80">
            <span className="font-semibold text-amber-400">{t("prop.basicNotice")}</span>{" "}
            {t("prop.limitedTo1")}{" "}
            {lockedCount > 0
              ? `${lockedCount} ${t(lockedCount === 1 ? "prop.lockedNotice1" : "prop.lockedNoticeN")}`
              : properties.length >= 1
                ? t("prop.upgradeMore")
                : t("prop.slotRemaining")}
          </p>
          <button
            onClick={() => setShowUpgrade(true)}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            {t("common.upgrade")} ↗
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProperties.map((property) => {
          const c = getColor(property.color);
          return (
            <Card
              key={property.id}
              className="group hover:border-zinc-500 transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950"
            >
              {/* Actions — visible on hover */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(property)}
                  title={t("common.edit")}
                  className="h-7 w-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition-all"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeletingId(property.id)}
                  title={t("common.delete")}
                  className="h-7 w-7 rounded-lg bg-zinc-800 hover:bg-red-500/20 flex items-center justify-center text-zinc-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <PropertyIconDisplay iconId={property.icon} color={property.color} />
                <div>
                  <h3 className="text-lg font-bold text-zinc-100 group-hover:translate-x-1 transition-transform duration-300">
                    {property.name}
                  </h3>
                  <p
                    className="text-[10px] font-mono tracking-widest uppercase mt-0.5"
                    style={{ color: c.text }}
                  >
                    {propTypeLabel(property.type, t)}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <MapPin className="h-4 w-4 text-zinc-600" />
                  <span className="truncate">{property.address}</span>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between pt-6 border-t border-zinc-800/50">
                <div
                  className="h-1.5 w-16 rounded-full opacity-60"
                  style={{ backgroundColor: c.swatch }}
                />
                <Link
                  href={`/dashboard/properties/${property.id}`}
                  className="text-xs font-bold text-zinc-100 flex items-center gap-1 hover:gap-2 transition-all"
                >
                  {t("prop.manage")} <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="absolute inset-0 pointer-events-none bg-white opacity-0 group-hover:opacity-[0.02] transition-opacity" />
            </Card>
          );
        })}

        {/* Locked properties placeholder for Basic users */}
        {lockedCount > 0 && (
          <button
            onClick={() => setShowUpgrade(true)}
            className="border-2 border-dashed border-amber-500/20 rounded-xl p-6 flex flex-col items-center justify-center gap-3 text-amber-500/50 hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/5 transition-all group"
          >
            <div className="h-12 w-12 rounded-full border-2 border-dashed border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="text-lg font-black">+{lockedCount}</span>
            </div>
            <div className="text-center">
              <p className="font-bold text-sm">
                {lockedCount} {t(lockedCount === 1 ? "prop.lockedCard1" : "prop.lockedCardN")}
              </p>
              <p className="text-[11px] mt-0.5 opacity-70">{t("prop.lockedHint")}</p>
            </div>
          </button>
        )}

        {/* Add placeholder — respects plan limit */}
        <button
          onClick={openAdd}
          className="border-2 border-dashed border-zinc-800 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900/20 transition-all group"
        >
          <div className="h-12 w-12 rounded-full border-2 border-dashed border-zinc-700 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="h-6 w-6" />
          </div>
          <p className="font-bold text-sm">
            {!isPro && properties.length >= 1 ? t("prop.upgradeToAdd") : t("prop.addNew")}
          </p>
        </button>
      </div>

      {/* Add / Edit modal */}
      {showModal && (
        <Modal
          title={editingId ? t("prop.edit") : t("prop.add")}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                {t("prop.form.name")}
              </label>
              <input
                required
                type="text"
                placeholder={t("prop.form.namePlaceholder")}
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.address")}</label>
              <input
                required
                type="text"
                placeholder={t("prop.form.addressPlaceholder")}
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.type")}</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all"
              >
                {TYPES.map((ty) => <option key={ty} value={ty}>{propTypeLabel(ty, t)}</option>)}
              </select>
            </div>

            {/* Icon picker */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.icon")}</label>
              <div className="flex gap-2 flex-wrap">
                {ICON_OPTIONS.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    title={label}
                    onClick={() => setForm((f) => ({ ...f, icon: id }))}
                    className={cn(
                      "h-9 w-9 rounded-lg flex items-center justify-center transition-all",
                      form.icon === id
                        ? "bg-white text-zinc-900 ring-2 ring-white/50"
                        : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Color picker */}
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">{t("prop.form.color")}</label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map(({ id, swatch }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, color: id as ColorId }))}
                    className={cn(
                      "h-6 w-6 rounded-full border-2 transition-all",
                      form.color === id
                        ? "border-white scale-110"
                        : "border-zinc-700 hover:scale-105"
                    )}
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 mt-1"
            >
              {editingId ? t("common.save") : t("prop.add")}
            </button>
          </form>
        </Modal>
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <Modal title={t("prop.delete")} onClose={() => setDeletingId(null)}>
          <p className="text-sm text-zinc-400 mb-6">
            {t("prop.deleteConfirm")}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeletingId(null)}
              className="flex-1 border border-zinc-700 text-zinc-300 py-2.5 rounded-lg font-bold text-sm hover:border-zinc-500 transition-all"
            >
              {t("common.cancel")}
            </button>
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95"
            >
              {t("common.delete")}
            </button>
          </div>
        </Modal>
      )}

      {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
    </div>
  );
}
