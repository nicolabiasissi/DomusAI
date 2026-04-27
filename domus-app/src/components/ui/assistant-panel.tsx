"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, X, Send } from "lucide-react";
import { useI18n } from "@/lib/use-i18n";
import { useAuth } from "@/context/auth-context";
import { useData } from "@/context/data-context";
import { cn } from "@/lib/utils";
import type { Expense, Property } from "@/lib/mock-data";

type Message = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

function fmt(n: number, it: boolean): string {
  return new Intl.NumberFormat(it ? "it-IT" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(n);
}

function buildResponse(
  input: string,
  locale: string,
  plan: string,
  expenses: Expense[],
  properties: Property[]
): string {
  const q = input.toLowerCase();
  const it = locale === "it";
  const isPro = plan === "Pro";

  const noData = it
    ? "Non ho trovato dati sufficienti nell'app."
    : "I could not find enough data in the app.";

  const upgrade = it
    ? "Questa funzionalità è disponibile nel piano Pro. Passa a Pro per analisi dettagliate, fatture e automazioni AI."
    : "This feature is available in the Pro plan. Upgrade to Pro for detailed analysis, invoices and AI automations.";

  const propName = (id: string) =>
    properties.find((p) => p.id === id)?.name ?? id;

  // Intent: unpaid / pending expenses
  if (/unpaid|pending|da pagare|non pagat|insolut|arretr/.test(q)) {
    const pending = expenses.filter((e) => e.status === "PENDING");
    if (!pending.length) return noData;
    if (!isPro) {
      return it
        ? `Hai ${pending.length} spesa/e non pagata/e. ${upgrade}`
        : `You have ${pending.length} unpaid expense(s). ${upgrade}`;
    }
    const lines = pending.map(
      (e) =>
        `• ${e.title} — ${fmt(e.amount, it)} — ${it ? "Scadenza" : "Due"}: ${e.dueDate} — ${propName(e.propertyId)}`
    );
    const header = it
      ? `Hai ${pending.length} spesa/e non pagata/e:\n\n`
      : `You have ${pending.length} unpaid expense(s):\n\n`;
    return header + lines.join("\n");
  }

  // Intent: upcoming deadlines (Pro only)
  if (/deadline|scadenz|prossim|upcoming|due date|when/.test(q)) {
    if (!isPro) return upgrade;
    if (!expenses.length) return noData;
    const sorted = [...expenses]
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 5);
    const lines = sorted.map(
      (e) =>
        `• ${e.title} — ${fmt(e.amount, it)} — ${e.dueDate} — ${propName(e.propertyId)}`
    );
    const header = it
      ? "Le prossime scadenze (in ordine):\n\n"
      : "Upcoming deadlines (soonest first):\n\n";
    return header + lines.join("\n");
  }

  // Intent: invoices / bills with PDF (Pro only)
  if (/invoice|fattur|bolletta|ricevut|pdf|bill|document/.test(q)) {
    if (!isPro) return upgrade;
    const withPdf = expenses.filter((e) => e.invoicePdf);
    if (!withPdf.length) return noData;
    const lines = withPdf.map(
      (e) => `• ${e.title} — ${fmt(e.amount, it)} — ${propName(e.propertyId)}`
    );
    const header = it
      ? "Fatture con allegato PDF disponibile:\n\n"
      : "Invoices with a PDF attachment:\n\n";
    const footer = it
      ? "\n\nPuoi scaricarle dalla sezione Spese."
      : "\n\nYou can download them from the Expenses section.";
    return header + lines.join("\n") + footer;
  }

  // Intent: total spending (Pro only)
  if (/total|how much|spend|cost|totale|quanto|speso|costo|spesa/.test(q)) {
    if (!isPro) return upgrade;
    if (!expenses.length) return noData;
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    const paid = expenses
      .filter((e) => e.status === "PAID")
      .reduce((s, e) => s + e.amount, 0);
    const pending = expenses
      .filter((e) => e.status === "PENDING")
      .reduce((s, e) => s + e.amount, 0);
    return it
      ? `Totale spese: ${fmt(total, it)}\n• Pagate: ${fmt(paid, it)}\n• In attesa: ${fmt(pending, it)}`
      : `Total expenses: ${fmt(total, it)}\n• Paid: ${fmt(paid, it)}\n• Pending: ${fmt(pending, it)}`;
  }

  // Default: practical tips (available to all plans)
  return it
    ? "Ecco alcuni consigli per gestire le tue spese:\n\n• Monitora le spese ricorrenti per evitare sorprese\n• Paga puntualmente per evitare more e penali\n• Confronta i fornitori periodicamente per risparmiare\n• Rivedi gli abbonamenti attivi ogni trimestre"
    : "Here are some tips to manage your expenses:\n\n• Track recurring expenses to avoid surprises\n• Pay on time to avoid late fees and penalties\n• Compare providers periodically to save money\n• Review active subscriptions every quarter";
}

export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const t = useI18n();
  const { user } = useAuth();
  const { expenses, properties } = useData();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const locale = user?.language ?? "en";
  const plan = user?.plan ?? "Basic";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setThinking(true);

    let reply: string;
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          language: locale,
          plan,
          context: { expenses, properties },
        }),
      });
      const data = await res.json();
      reply = data.fallback
        ? buildResponse(trimmed, locale, plan, expenses, properties)
        : (data.reply as string);
    } catch {
      reply = buildResponse(trimmed, locale, plan, expenses, properties);
    }

    setMessages((prev) => [
      ...prev,
      { id: (Date.now() + 1).toString(), role: "assistant", text: reply },
    ]);
    setThinking(false);
  };

  const quickSuggestions = [
    t("assistant.quick1"),
    t("assistant.quick2"),
    t("assistant.quick3"),
  ];

  const showQuicks = messages.length === 0;

  return (
    <>
      {/* Floating button — hidden while panel is open */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label={t("assistant.title")}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-zinc-900 border border-zinc-700/80 shadow-lg flex items-center justify-center text-amber-400 transition-all duration-200 hover:bg-zinc-800 hover:border-amber-400/40 hover:shadow-[0_0_24px_rgba(251,191,36,0.18)] active:scale-95"
        >
          <Sparkles className="h-5 w-5" />
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed top-14 right-0 bottom-0 z-50 w-96 flex flex-col bg-zinc-950 border-l border-zinc-800 shadow-2xl">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
                <Sparkles className="h-4 w-4 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-100 leading-none">
                  {t("assistant.title")}
                </p>
                <p className="text-[11px] text-zinc-500 mt-1 leading-none">
                  {t("assistant.subtitle")}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {/* Welcome message — always shown, always current locale */}
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed bg-zinc-900 border border-zinc-800 text-zinc-300">
                {t("assistant.welcome")}
              </div>
            </div>

            {/* Conversation messages */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "rounded-tr-sm bg-zinc-800 text-zinc-100"
                      : "rounded-tl-sm bg-zinc-900 border border-zinc-800 text-zinc-300 whitespace-pre-wrap"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 text-sm bg-zinc-900 border border-zinc-800 text-zinc-500 tracking-widest">
                  •••
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions */}
          {showQuicks && (
            <div className="px-4 pb-3 flex flex-wrap gap-2 shrink-0">
              {quickSuggestions.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-[11px] font-medium px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 py-3 border-t border-zinc-800 shrink-0">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(input); }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("assistant.placeholder")}
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-600"
              />
              <button
                type="submit"
                disabled={!input.trim() || thinking}
                className="h-10 w-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
}
