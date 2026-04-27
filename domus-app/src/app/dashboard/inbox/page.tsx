"use client";

import {
  Mail, ShieldCheck, CheckCircle2, Inbox, Lock, Receipt,
  ArrowLeft, FileText, Download, Plus, CheckCheck, X, AlertTriangle,
} from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { useI18n } from "@/lib/use-i18n";
import { UpgradeModal } from "@/components/ui/upgrade-modal";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { categoryLabel } from "@/lib/translation-helpers";
import { formatCurrency, CurrencyCode } from "@/lib/currency";
import { Expense } from "@/lib/mock-data";

type ScanRange = 30 | 60 | 90;
type InboxState = "onboarding" | "connected";

type MockEmail = {
  id: string;
  sender: string;
  subject: string;
  daysAgo: number;
  dueOffset: number;
  propertyId: string;
  category: string;
  amount: number;
  supplier: string;
  iban?: string;
  pdfName: string;
  body: string;
  bodyIt: string;
};

function isoOffset(dayOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString().split("T")[0];
}

const MOCK_EMAILS: MockEmail[] = [
  {
    id: "em1",
    sender: "Con Edison Billing",
    subject: "April Electricity Bill – Unit 4B",
    daysAgo: 11,
    dueOffset: 4,
    propertyId: "1",
    category: "Utility",
    amount: 148,
    supplier: "Con Edison",
    pdfName: "april_electricity_bill_2026.pdf",
    body:
`Dear Customer,

Your electricity bill for April 2026 is now available.

Account Number: 4892-7734-1
Service Address: 123 Main St, Unit 4B, New York, NY
Billing Period: March 15 – April 14, 2026

Charges Summary:
  Basic Service Charge:    $12.50
  Energy Usage (623 kWh): $118.74
  Taxes & Surcharges:      $16.76

Total Amount Due:  $148.00
Payment Due Date:  April 30, 2026

Pay online at coned.com/pay or call 1-800-752-6633.
Thank you for being a Con Edison customer.`,
    bodyIt:
`Gentile Cliente,

La bolletta dell'elettricità per aprile 2026 è ora disponibile.

Numero conto: 4892-7734-1
Indirizzo di servizio: 123 Main St, Unità 4B, New York, NY
Periodo di fatturazione: 15 marzo – 14 aprile 2026

Riepilogo addebiti:
  Quota fissa base:             $12,50
  Consumo energetico (623 kWh): $118,74
  Tasse e sovrattasse:           $16,76

Totale dovuto:  $148,00
Scadenza:       30 aprile 2026

Paga online su coned.com/pay o chiama l'1-800-752-6633.
Grazie per essere cliente Con Edison.`,
  },
  {
    id: "em2",
    sender: "NYC Water Board",
    subject: "Water & Sewage Invoice – April 2026",
    daysAgo: 29,
    dueOffset: 9,
    propertyId: "1",
    category: "Utility",
    amount: 62,
    supplier: "NYC Water Board",
    pdfName: "water_sewage_invoice_apr2026.pdf",
    body:
`Dear Property Owner,

Your water and sewage bill for the current period is enclosed.

Account: W-2024-0089421
Service Address: 123 Main St, New York, NY
Read Period: January 1 – April 1, 2026

Water Usage:     12,400 gallons
Sewage Charge:   $28.00
Water Charge:    $34.00

Total Amount Due: $62.00
Due Date:         May 5, 2026

Visit nyc.gov/dep or call 718-595-7000 to pay.`,
    bodyIt:
`Gentile Proprietario,

In allegato la bolletta dell'acqua e delle fognature per il periodo corrente.

Conto: W-2024-0089421
Indirizzo di servizio: 123 Main St, New York, NY
Periodo di lettura: 1 gennaio – 1 aprile 2026

Consumo idrico:  12.400 galloni
Quota fognatura: $28,00
Quota acqua:     $34,00

Totale dovuto: $62,00
Scadenza:      5 maggio 2026

Paga su nyc.gov/dep o chiama lo 718-595-7000.`,
  },
  {
    id: "em3",
    sender: "Comcast Business",
    subject: "Monthly Internet Service Invoice",
    daysAgo: 47,
    dueOffset: 5,
    propertyId: "3",
    category: "Utility",
    amount: 89,
    supplier: "Comcast Business",
    pdfName: "comcast_invoice_apr2026.pdf",
    body:
`Hi,

Your Comcast Business invoice is ready.

Account: 8495-1123-DT
Service Location: 789 Pine Ave, Austin, TX
Billing Period: April 1 – April 30, 2026

Business Internet 300 Mbps
  Monthly Plan:     $79.00
  Equipment Rental: $10.00

Total Due: $89.00
Due Date:  May 1, 2026

Manage your account at business.comcast.com`,
    bodyIt:
`Salve,

La sua fattura Comcast Business è pronta.

Conto: 8495-1123-DT
Sede di servizio: 789 Pine Ave, Austin, TX
Periodo di fatturazione: 1–30 aprile 2026

Internet Business 300 Mbps
  Piano mensile:     $79,00
  Noleggio apparati: $10,00

Totale dovuto: $89,00
Scadenza:      1 maggio 2026

Gestisci il tuo account su business.comcast.com`,
  },
  {
    id: "em4",
    sender: "Los Angeles Tax Collector",
    subject: "Property Tax Notice – Q2 2026",
    daysAgo: 65,
    dueOffset: 19,
    propertyId: "2",
    category: "Tax",
    amount: 2000,
    supplier: "Los Angeles County",
    pdfName: "property_tax_q2_2026.pdf",
    body:
`COUNTY OF LOS ANGELES
OFFICE OF THE TREASURER AND TAX COLLECTOR

NOTICE OF PROPERTY TAX DUE

Parcel Number: 4523-001-017
Property Address: 456 Oak Rd, Los Angeles, CA 90028

SECOND INSTALLMENT – FISCAL YEAR 2025-2026

Base Tax:             $1,850.00
Special Assessments:    $150.00

Total Amount Due: $2,000.00
Delinquent After: June 30, 2026

Pay at lacounty.gov/tax or in person at 225 N Hill St, Los Angeles.`,
    bodyIt:
`CONTEA DI LOS ANGELES
UFFICIO DEL TESORIERE E DELL'ESATTORE DELLE IMPOSTE

AVVISO DI IMPOSTA IMMOBILIARE DOVUTA

Numero parcella: 4523-001-017
Indirizzo immobile: 456 Oak Rd, Los Angeles, CA 90028

SECONDA RATA – ANNO FISCALE 2025-2026

Imposta base:       $1.850,00
Tributi speciali:     $150,00

Totale dovuto: $2.000,00
Mora dopo il:  30 giugno 2026

Paga su lacounty.gov/tax o di persona al 225 N Hill St, Los Angeles.`,
  },
  {
    id: "em5",
    sender: "Allstate Insurance",
    subject: "Annual Premium Renewal Notice",
    daysAgo: 80,
    dueOffset: 5,
    propertyId: "2",
    category: "Insurance",
    amount: 420,
    supplier: "Allstate Insurance",
    iban: "US12 3456 7890 1234 5678 90",
    pdfName: "allstate_renewal_2026.pdf",
    body:
`Dear Policyholder,

Your annual homeowner's insurance premium renewal is due.

Policy Number: ALL-2024-88-3921
Insured Property: 456 Oak Rd, Los Angeles, CA
Coverage Period: June 1, 2026 – May 31, 2027

Annual Premium: $420.00
Due Date: May 1, 2026

Payment Information:
  Bank:      First National Insurance Bank
  IBAN:      US12 3456 7890 1234 5678 90
  Reference: ALL-2024-88-3921

Contact your agent at 1-800-255-7828 with any questions.
Allstate Insurance Company`,
    bodyIt:
`Gentile Assicurato,

Il rinnovo del premio annuale dell'assicurazione sulla casa è in scadenza.

Numero polizza: ALL-2024-88-3921
Immobile assicurato: 456 Oak Rd, Los Angeles, CA
Periodo di copertura: 1 giugno 2026 – 31 maggio 2027

Premio annuale: $420,00
Scadenza: 1 maggio 2026

Dati di pagamento:
  Banca:    First National Insurance Bank
  IBAN:     US12 3456 7890 1234 5678 90
  Causale:  ALL-2024-88-3921

Contatta il tuo agente al 1-800-255-7828 per qualsiasi domanda.
Allstate Insurance Company`,
  },
];

export default function InboxPage() {
  const { user, updateUser } = useAuth();
  const { properties, setExpenses } = useData();
  const t = useI18n();
  const isPro = user?.plan === "Pro";
  const currency = (user?.currency ?? "EUR") as CurrencyCode;
  const locale = user?.language ?? "en";
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [scanRange, setScanRange] = useState<ScanRange>(() => {
    if (typeof window === "undefined") return 30;
    const s = Number(localStorage.getItem("inbox.scanRange"));
    return ([30, 60, 90].includes(s) ? s : 30) as ScanRange;
  });
  const [propertyId, setPropertyId] = useState<string>(() =>
    typeof window !== "undefined" ? (localStorage.getItem("inbox.propertyId") ?? "all") : "all"
  );
  const [inboxState, setInboxState] = useState<InboxState>(() =>
    typeof window !== "undefined"
      ? ((localStorage.getItem("inbox.state") as InboxState) ?? "onboarding")
      : "onboarding"
  );
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("inbox.dismissedIds") ?? "[]"); }
    catch { return []; }
  });
  const [addedIds, setAddedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("inbox.addedIds") ?? "[]"); }
    catch { return []; }
  });
  const [activationDate, setActivationDate] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("inbox.activationDate") : null
  );
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  useEffect(() => { localStorage.setItem("inbox.state",        inboxState); },                     [inboxState]);
  useEffect(() => { localStorage.setItem("inbox.scanRange",    String(scanRange)); },              [scanRange]);
  useEffect(() => { localStorage.setItem("inbox.propertyId",   propertyId); },                    [propertyId]);
  useEffect(() => { localStorage.setItem("inbox.dismissedIds", JSON.stringify(dismissedIds)); },  [dismissedIds]);
  useEffect(() => { localStorage.setItem("inbox.addedIds",     JSON.stringify(addedIds)); },      [addedIds]);
  useEffect(() => {
    if (activationDate) localStorage.setItem("inbox.activationDate", activationDate);
    else localStorage.removeItem("inbox.activationDate");
  }, [activationDate]);

  // ── Basic plan: full locked screen ────────────────────────────────────────
  if (!isPro) {
    return (
      <>
        <div className="space-y-8 max-w-3xl">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold text-zinc-100">{t("page.inbox.title")}</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-widest">
                {t("inbox.proTag")}
              </span>
            </div>
            <p className="text-zinc-400 mt-1 text-sm">{t("inbox.subtitle")}</p>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-8 flex flex-col items-center text-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <Lock className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <p className="text-base font-semibold text-zinc-100">{t("inbox.upgradeTitle")}</p>
              <p className="text-sm text-zinc-400 mt-2 max-w-md">{t("inbox.upgradeDesc")}</p>
            </div>
            <button
              onClick={() => setShowUpgrade(true)}
              className="bg-white text-zinc-950 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
            >
              {t("inbox.upgradeCta")}
            </button>
          </div>
        </div>
        {showUpgrade && <UpgradeModal onClose={() => setShowUpgrade(false)} />}
      </>
    );
  }

  const RANGES: ScanRange[] = [30, 60, 90];
  const rangeLabel: Record<ScanRange, string> = {
    30: t("inbox.ob.range30"),
    60: t("inbox.ob.range60"),
    90: t("inbox.ob.range90"),
  };

  const selectedProperty = properties.find((p) => p.id === propertyId);
  const propertyName = propertyId === "all"
    ? t("inbox.cn.allProps")
    : (selectedProperty?.name ?? t("inbox.cn.allProps"));

  const pageHeader = (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <h1 className="text-3xl font-bold text-zinc-100">{t("page.inbox.title")}</h1>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase tracking-widest">
          {t("inbox.proTag")}
        </span>
      </div>
      <p className="text-zinc-400 mt-1 text-sm">{t("inbox.subtitle")}</p>
    </div>
  );

  const statusRows: { label: string; value: React.ReactNode }[] = [
    { label: t("inbox.cn.connectedEmail"), value: <span className="text-zinc-200 font-medium">{user?.email}</span> },
    { label: t("inbox.cn.initialScan"),    value: <span className="text-zinc-200 font-medium">{rangeLabel[scanRange]} · {propertyName}</span> },
    { label: t("inbox.cn.activatedOn"),    value: <span className="text-zinc-200 font-medium">{activationDate ?? "—"}</span> },
    {
      label: t("inbox.cn.monitoring"),
      value: (
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-semibold">{t("inbox.cn.monitoringActive")}</span>
        </span>
      ),
    },
  ];

  const connectionBanner = (
    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-emerald-500/10">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold text-zinc-100">{t("inbox.cn.badge")}</span>
        </div>
        <button
          onClick={() => { setInboxState("onboarding"); setSelectedEmailId(null); setDismissedIds([]); setAddedIds([]); setActivationDate(null); }}
          className="text-xs text-zinc-500 hover:text-zinc-300 border border-zinc-700 hover:border-zinc-600 px-3 py-1.5 rounded-lg transition-colors"
        >
          {t("inbox.cn.disconnect")}
        </button>
      </div>
      <div className="divide-y divide-emerald-500/10">
        {statusRows.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-4 px-5 py-2.5">
            <span className="w-40 shrink-0 text-xs text-zinc-500">{label}</span>
            <span className="text-xs">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Connected state ──────────────────────────────────────────────────────
  if (inboxState === "connected") {
    const visibleEmails = MOCK_EMAILS.filter(
      (e) =>
        e.daysAgo <= scanRange &&
        (propertyId === "all" || e.propertyId === propertyId) &&
        !dismissedIds.includes(e.id)
    );

    // ── Detail panel ────────────────────────────────────────────────────────
    const activeEmail = selectedEmailId
      ? MOCK_EMAILS.find((e) => e.id === selectedEmailId) ?? null
      : null;

    if (activeEmail) {
      const prop = properties.find((p) => p.id === activeEmail.propertyId);
      const receivedDate = isoOffset(-activeEmail.daysAgo);
      const dueDate = isoOffset(activeEmail.dueOffset);

      const dataRows: { label: string; value: string; confidence: "verified" | "needs_review" }[] = [
        { label: t("inbox.detail.amount"),   value: formatCurrency(activeEmail.amount, currency),                                             confidence: "verified" },
        { label: t("inbox.detail.dueDate"),  value: dueDate,                                                                                  confidence: "verified" },
        { label: t("inbox.detail.category"), value: categoryLabel(activeEmail.category, t),                                                   confidence: "needs_review" },
        { label: t("inbox.detail.property"), value: prop?.name ?? "—",                                                                       confidence: "verified" },
        { label: t("inbox.detail.supplier"), value: activeEmail.supplier,                                                                     confidence: "verified" },
        { label: t("inbox.detail.payment"),  value: activeEmail.iban ? `IBAN: ${activeEmail.iban}` : t("inbox.detail.ibanNone"),              confidence: activeEmail.iban ? "verified" : "needs_review" },
      ];

      const alreadyAdded = addedIds.includes(activeEmail.id);

      const handleCreateExpense = (status: "PAID" | "PENDING") => {
        if (addedIds.includes(activeEmail.id)) {
          setDuplicateWarning(true);
          return;
        }
        const newExpense: Expense = {
          id: Date.now().toString(),
          title: activeEmail.subject,
          category: activeEmail.category,
          amount: activeEmail.amount,
          dueDate,
          status,
          propertyId: activeEmail.propertyId,
          source: "AI_INBOX",
          sourceEmailId: activeEmail.id,
          invoicePdf: activeEmail.pdfName,
        };
        setExpenses((prev) => [newExpense, ...prev]);
        setAddedIds((prev) => [...prev, activeEmail.id]);
        updateUser({
          notifications: [
            {
              id: `ai-${Date.now()}`,
              title: t("notif.aiInbox.title"),
              body: `${formatCurrency(activeEmail.amount, currency)} · ${prop?.name ?? ""} · ${t("notif.aiInbox.due")} ${dueDate}`,
              read: false,
              time: "just now",
            },
            ...(user?.notifications ?? []),
          ],
        });
        setSelectedEmailId(null);
      };

      const handleIgnore = () => {
        setDismissedIds((prev) => [...prev, activeEmail.id]);
        setDuplicateWarning(false);
        setSelectedEmailId(null);
      };

      return (
        <div className="space-y-6 max-w-3xl">
          {pageHeader}
          {connectionBanner}

          {/* Back */}
          <button
            onClick={() => { setSelectedEmailId(null); setDuplicateWarning(false); }}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> {t("inbox.detail.back")}
          </button>

          {/* Subject + status */}
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-xl font-bold text-zinc-100 leading-snug">{activeEmail.subject}</h2>
            {alreadyAdded ? (
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide mt-1">
                {t("inbox.cn.added")}
              </span>
            ) : (
              <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide mt-1">
                {t("inbox.cn.needsReview")}
              </span>
            )}
          </div>

          {/* Sender + received */}
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span><span className="text-zinc-600">{t("inbox.detail.from")}:</span> {activeEmail.sender}</span>
            <span className="text-zinc-700">·</span>
            <span><span className="text-zinc-600">{t("inbox.detail.received")}:</span> {receivedDate}</span>
          </div>

          {/* Email preview */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {t("inbox.detail.preview")}
              </p>
              {locale === "it" && (
                <span className="text-[10px] italic text-zinc-600">
                  {t("inbox.detail.translatedNote")}
                </span>
              )}
            </div>
            <pre className="px-5 py-4 text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto">
              {locale === "it" ? activeEmail.bodyIt : activeEmail.body}
            </pre>
          </div>

          {/* Extracted data */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {t("inbox.detail.extracted")}
              </p>
            </div>
            <div className="divide-y divide-zinc-800/60">
              {dataRows.map(({ label, value, confidence }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3">
                  <span className="w-32 shrink-0 text-xs text-zinc-500">{label}</span>
                  <span className="text-sm text-zinc-200 font-medium flex-1">{value}</span>
                  {confidence === "needs_review" && (
                    <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {t("inbox.detail.confidence.needs_review")}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-zinc-800/60 bg-zinc-900/20">
              <p className="text-[11px] text-zinc-600 italic leading-relaxed">
                {t("inbox.detail.reliabilityNotice")}
              </p>
            </div>
          </div>

          {/* PDF attachment */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                {t("inbox.detail.attachment")}
              </p>
            </div>
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-zinc-400" />
                </div>
                <span className="text-sm text-zinc-300 font-medium">{activeEmail.pdfName}</span>
              </div>
              <a
                href={`/invoices/${activeEmail.pdfName}`}
                download={activeEmail.pdfName}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-100 border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> {t("inbox.detail.download")}
              </a>
            </div>
          </div>

          {/* Duplicate warning */}
          {(duplicateWarning || alreadyAdded) && (
            <div className="flex items-center gap-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-300">
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              {t("inbox.detail.duplicate")}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => handleCreateExpense("PENDING")}
              disabled={alreadyAdded || duplicateWarning}
              className={cn(
                "flex items-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-lg font-bold text-sm transition-all active:scale-95",
                alreadyAdded || duplicateWarning
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-zinc-200"
              )}
            >
              <Plus className="h-4 w-4" /> {t("inbox.detail.createExpense")}
            </button>
            <button
              onClick={() => handleCreateExpense("PAID")}
              disabled={alreadyAdded || duplicateWarning}
              className={cn(
                "flex items-center gap-2 bg-zinc-800 text-zinc-100 px-5 py-2.5 rounded-lg font-bold text-sm border border-zinc-700 transition-all active:scale-95",
                alreadyAdded || duplicateWarning
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:bg-zinc-700"
              )}
            >
              <CheckCheck className="h-4 w-4" /> {t("inbox.detail.markPaid")}
            </button>
            <button
              onClick={handleIgnore}
              disabled={alreadyAdded}
              className={cn(
                "flex items-center gap-2 text-zinc-500 px-4 py-2.5 rounded-lg font-bold text-sm border border-transparent transition-all",
                alreadyAdded
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:text-red-400 hover:bg-red-500/5 hover:border-red-500/20"
              )}
            >
              <X className="h-4 w-4" /> {t("inbox.detail.ignore")}
            </button>
          </div>
        </div>
      );
    }

    // ── Email list ───────────────────────────────────────────────────────────
    return (
      <div className="space-y-6 max-w-3xl">
        {pageHeader}
        {connectionBanner}

        {visibleEmails.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 p-10 flex flex-col items-center text-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Inbox className="h-5 w-5 text-zinc-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-300">{t("inbox.cn.noMatch")}</p>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm">{t("inbox.cn.noResultsHint")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-zinc-500 px-1">
              <span className="text-zinc-200 font-semibold">{visibleEmails.length}</span>{" "}
              {t("inbox.cn.detected")}
            </p>
            {visibleEmails.map((email) => {
              const prop = properties.find((p) => p.id === email.propertyId);
              const receivedDate = isoOffset(-email.daysAgo);
              const dueDate = isoOffset(email.dueOffset);
              const isAdded = addedIds.includes(email.id);

              return (
                <button
                  key={email.id}
                  onClick={() => { if (!isAdded) { setSelectedEmailId(email.id); setDuplicateWarning(false); } }}
                  disabled={isAdded}
                  className={cn(
                    "w-full text-left rounded-xl border bg-zinc-900/50 p-5 space-y-3 transition-all",
                    isAdded
                      ? "border-zinc-800 opacity-60 cursor-default"
                      : "border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/80 active:scale-[0.995]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0">
                        <Receipt className="h-3.5 w-3.5 text-zinc-400" />
                      </div>
                      <p className="text-sm font-semibold text-zinc-100 truncate">{email.subject}</p>
                    </div>
                    {isAdded ? (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                        {t("inbox.cn.added")}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                        {t("inbox.cn.needsReview")}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 pl-10">
                    {email.sender} · {receivedDate}
                  </p>
                  <div className="flex flex-wrap gap-2 pl-10">
                    {prop && (
                      <span className="text-[11px] px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50 text-zinc-300 font-medium">
                        {prop.name}
                      </span>
                    )}
                    <span className="text-[11px] px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50 text-zinc-300 font-medium">
                      {categoryLabel(email.category, t)}
                    </span>
                    <span className="text-[11px] px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50 text-zinc-200 font-bold">
                      {formatCurrency(email.amount, currency)}
                    </span>
                    <span className="text-[11px] px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700/50 text-zinc-300 font-medium">
                      {dueDate}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── Onboarding state ─────────────────────────────────────────────────────
  const consentPoints = [
    t("inbox.ob.c1"),
    t("inbox.ob.c2"),
    t("inbox.ob.c3"),
    t("inbox.ob.c4"),
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {pageHeader}

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800">
        {/* Consent */}
        <div className="p-6 flex items-start gap-4">
          <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100 mb-3">{t("inbox.ob.consentTitle")}</p>
            <ul className="space-y-2">
              {consentPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-xs text-zinc-400">
                  <span className="mt-0.5 h-4 w-4 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Scan range */}
        <div className="p-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            {t("inbox.ob.rangeLabel")}
          </label>
          <div className="flex items-center gap-2">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setScanRange(r)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold border transition-all",
                  scanRange === r
                    ? "bg-white text-zinc-950 border-white"
                    : "bg-zinc-900 text-zinc-400 border-zinc-700 hover:border-zinc-500 hover:text-zinc-200"
                )}
              >
                {rangeLabel[r]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-zinc-500">{t("inbox.ob.rangeHint")}</p>
        </div>

        {/* Property selector */}
        <div className="p-6">
          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
            {t("inbox.ob.propLabel")}
          </label>
          <select
            value={propertyId}
            onChange={(e) => setPropertyId(e.target.value)}
            className="w-full max-w-xs bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-600 transition-all"
          >
            <option value="all">{t("inbox.ob.allProps")}</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* CTA */}
        <div className="p-6">
          <button
            onClick={() => { setInboxState("connected"); setActivationDate(new Date().toISOString().split("T")[0]); }}
            className="flex items-center gap-2 bg-white text-zinc-950 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95"
          >
            <Mail className="h-4 w-4" />
            {t("inbox.ob.cta")}
          </button>
        </div>
      </div>
    </div>
  );
}
