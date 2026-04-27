"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Bell,
  FileText,
  Sparkles,
  LayoutDashboard,
  Mail,
  CheckCircle,
  AlertCircle,
  FolderOpen,
  Clock,
} from "lucide-react";
import { LogoWordmark } from "@/components/ui/logo";

// ── Animation variants ─────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// ── Translations ───────────────────────────────────────────────────────────

const T = {
  en: {
    nav: { signin: "Sign in" },
    hero: {
      badge: "AI-powered property management",
      h1a: "Stop losing track of your",
      h1b: "home expenses",
      sub: "DomusAI brings all your properties, bills, deadlines, and invoices into one intelligent dashboard — with AI that reads your inbox so you never miss a payment.",
      cta1: "Try Demo",
      cta2: "Start Free",
      cta3: "View Features",
    },
    stats: [
      { value: "€4,244", label: "Total Expenses" },
      { value: "4",     label: "Pending Bills"  },
      { value: "3",     label: "Properties"     },
    ],
    expenses: [
      { title: "Property Tax Q2",    date: "May 15", amount: "€2,000", pending: true  },
      { title: "Building Insurance", date: "May 1",  amount: "€420",   pending: true  },
      { title: "Monthly Rent",       date: "Apr 1",  amount: "€1,200", pending: false },
    ],
    problem: {
      label: "The problem",
      title: "Managing home expenses is more painful than it should be",
      items: [
        { title: "Forgotten bills",   body: "Due dates pile up across utilities, insurance, and taxes. One missed payment means penalties." },
        { title: "Lost invoices",     body: "PDFs buried in email threads and downloads folders — impossible to find when you need them." },
        { title: "Missed deadlines",  body: "Tax quarters, insurance renewals, and maintenance windows slip by without a central reminder." },
        { title: "Inbox chaos",       body: "Expense emails from landlords, suppliers, and utilities mixed in with everything else you receive." },
      ],
    },
    features: {
      label: "Features",
      title: "Everything your properties need, in one place",
      items: [
        { title: "Expense Dashboard",    body: "See all your expenses at a glance. Filter by property, category, or status. Know exactly what is paid and pending.", pro: false },
        { title: "Property Management",  body: "Track multiple properties independently. Each gets its own expense history, documents, and deadlines.",             pro: false },
        { title: "Smart Reminders",      body: "Automatic alerts before due dates. Never miss a tax quarter or insurance renewal again.",                          pro: false },
        { title: "AI Inbox",             body: "Connect your email and let DomusAI automatically detect and categorise expense-related messages.",                 pro: true  },
        { title: "Virtual Assistant",    body: "Ask questions about your expenses in plain language. Get summaries and suggestions powered by AI.",                pro: true  },
        { title: "Invoice Management",   body: "All your PDF invoices stored, linked to the right expense, and always findable — even years later.",              pro: false },
      ],
    },
    inbox: {
      label: "AI Inbox",
      tag: "Pro",
      title: "Your inbox, automatically organised",
      body: "DomusAI scans incoming emails and extracts bills, invoices, and payment requests — categorised and linked to the right property before you even open them.",
    },
    assistant: {
      label: "AI Assistant",
      tag: "Pro",
      title: "Ask anything about your expenses",
      body: "\"How much did I spend on maintenance last month?\" — just ask. The assistant knows your properties, your bills, and your deadlines.",
      examples: [
        "What are my unpaid bills this month?",
        "Show deadlines for Green Valley Villa",
        "How much did I spend on utilities?",
      ],
    },
    pricing: {
      label: "Pricing",
      title: "Simple plans, no surprises",
      basic: {
        name: "Basic",
        price: "Free",
        period: "",
        features: ["1 property", "Expense tracking", "Bill reminders", "Basic assistant", "Manual invoice upload"],
        locked:   ["AI Inbox automation", "Unlimited properties", "Advanced AI analysis"],
        cta: "Get started free",
      },
      pro: {
        name: "Pro",
        price: "€9",
        period: "/month",
        badge: "RECOMMENDED",
        features: ["Unlimited properties", "Full expense dashboard", "AI Inbox automation", "Virtual AI assistant", "Invoice management & PDFs", "Advanced spending analysis", "Priority support"],
        cta: "Start Pro trial",
      },
    },
    cta: {
      title: "Start managing your home expenses today",
      sub: "Join DomusAI and take back control of your properties and bills.",
      btn: "Get started — it's free",
    },
    footer: "All rights reserved.",
  },

  it: {
    nav: { signin: "Accedi" },
    hero: {
      badge: "Gestione immobiliare con IA",
      h1a: "Smetti di perdere il controllo delle tue",
      h1b: "spese di casa",
      sub: "DomusAI raccoglie proprietà, bollette, scadenze e fatture in un unico pannello intelligente — con l'IA che legge la tua email così non perdi mai un pagamento.",
      cta1: "Prova Demo",
      cta2: "Inizia Gratis",
      cta3: "Vedi Funzionalità",
    },
    stats: [
      { value: "€4.244", label: "Spese Totali"       },
      { value: "4",      label: "Bollette in Attesa"  },
      { value: "3",      label: "Proprietà"           },
    ],
    expenses: [
      { title: "Tassa Proprietà T2",     date: "15 mag", amount: "€2.000", pending: true  },
      { title: "Assicurazione Edificio", date: "1 mag",  amount: "€420",   pending: true  },
      { title: "Affitto Mensile",        date: "1 apr",  amount: "€1.200", pending: false },
    ],
    problem: {
      label: "Il problema",
      title: "Gestire le spese di casa è più difficile del necessario",
      items: [
        { title: "Bollette dimenticate", body: "Le scadenze si accumulano tra utenze, assicurazioni e tasse. Un pagamento perso significa more." },
        { title: "Fatture perse",        body: "PDF sepolti in thread email e cartelle download — impossibili da trovare quando servono." },
        { title: "Scadenze mancate",     body: "Trimestri fiscali, rinnovi assicurativi e manutenzioni passano senza un sistema di promemoria." },
        { title: "Inbox caotica",        body: "Email di spese da proprietari, fornitori e utilities mescolate con tutto il resto." },
      ],
    },
    features: {
      label: "Funzionalità",
      title: "Tutto ciò di cui le tue proprietà hanno bisogno",
      items: [
        { title: "Dashboard Spese",      body: "Visualizza tutte le spese a colpo d'occhio. Filtra per proprietà, categoria o stato.",                             pro: false },
        { title: "Gestione Proprietà",   body: "Gestisci più proprietà in modo indipendente. Ognuna ha la sua cronologia spese e scadenze.",                       pro: false },
        { title: "Promemoria Intelligenti", body: "Avvisi automatici prima delle scadenze. Non perdere mai più un trimestre fiscale o rinnovo assicurativo.",       pro: false },
        { title: "AI Inbox",             body: "Connetti la tua email e lascia che DomusAI rilevi e categorizzi automaticamente i messaggi di spesa.",              pro: true  },
        { title: "Assistente Virtuale",  body: "Fai domande sulle tue spese in linguaggio naturale. Ottieni riepiloghi e suggerimenti con l'IA.",                  pro: true  },
        { title: "Gestione Fatture",     body: "Tutte le tue fatture PDF archiviate, collegate alla spesa giusta e sempre trovabili — anche anni dopo.",           pro: false },
      ],
    },
    inbox: {
      label: "AI Inbox",
      tag: "Pro",
      title: "La tua inbox, organizzata automaticamente",
      body: "DomusAI analizza le email in arrivo ed estrae bollette, fatture e richieste di pagamento — categorizzate e collegate alla proprietà giusta prima ancora che tu le apra.",
    },
    assistant: {
      label: "Assistente IA",
      tag: "Pro",
      title: "Chiedi qualsiasi cosa sulle tue spese",
      body: "\"Quanto ho speso per la manutenzione il mese scorso?\" — chiedilo e basta. L'assistente conosce le tue proprietà, bollette e scadenze.",
      examples: [
        "Quali bollette non ho pagato questo mese?",
        "Mostrami le scadenze di Villa Green Valley",
        "Quanto ho speso per le utenze?",
      ],
    },
    pricing: {
      label: "Prezzi",
      title: "Piani semplici, senza sorprese",
      basic: {
        name: "Basic",
        price: "Gratis",
        period: "",
        features: ["1 proprietà", "Tracciamento spese", "Promemoria bollette", "Assistente base", "Caricamento fatture manuale"],
        locked:   ["Automazione AI Inbox", "Proprietà illimitate", "Analisi IA avanzata"],
        cta: "Inizia gratis",
      },
      pro: {
        name: "Pro",
        price: "€9",
        period: "/mese",
        badge: "CONSIGLIATO",
        features: ["Proprietà illimitate", "Dashboard spese completo", "Automazione AI Inbox", "Assistente IA virtuale", "Gestione fatture e PDF", "Analisi spese avanzata", "Supporto prioritario"],
        cta: "Prova Pro gratis",
      },
    },
    cta: {
      title: "Inizia a gestire le tue spese di casa oggi",
      sub: "Unisciti a DomusAI e riprendi il controllo delle tue proprietà e bollette.",
      btn: "Inizia gratis",
    },
    footer: "Tutti i diritti riservati.",
  },
} as const;

type Locale = keyof typeof T;

// ── Feature icon map ───────────────────────────────────────────────────────

const featureIcons = [LayoutDashboard, Building2, Bell, Mail, Sparkles, FileText];
const problemIcons = [Bell, FolderOpen, Clock, Mail];

// ── Component ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    try {
      const session = localStorage.getItem("domusai_users_session");
      if (session) {
        const u = JSON.parse(session) as { language?: string };
        if (u?.language === "it" || u?.language === "en") {
          setLocale(u.language as Locale);
          return;
        }
      }
      const lang = localStorage.getItem("domusai_lang");
      if (lang === "it" || lang === "en") setLocale(lang as Locale);
    } catch {}
  }, []);

  const switchLocale = (l: Locale) => {
    setLocale(l);
    try { localStorage.setItem("domusai_lang", l); } catch {}
  };

  const t = T[locale];

  return (
    <div className="min-h-screen scroll-smooth bg-zinc-950 text-zinc-100">

      {/* ── Nav ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <LogoWordmark />
          <div className="flex items-center gap-3">
            <div className="flex overflow-hidden rounded-lg border border-zinc-800">
              {(["en", "it"] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => switchLocale(l)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                    locale === l
                      ? "bg-zinc-800 text-zinc-100"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
            >
              {t.nav.signin}
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pb-24 pt-24 text-center">
        {/* Ambient glow */}
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          animate={{ opacity: [0.25, 0.55, 0.25] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="h-[500px] w-[500px] rounded-full bg-amber-400/10 blur-3xl" />
        </motion.div>

        <div className="relative mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-400"
          >
            <Sparkles className="h-3 w-3" />
            {t.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            {t.hero.h1a}{" "}
            <span className="text-amber-400">{t.hero.h1b}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
          >
            {t.hero.sub}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/login"
              className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
            >
              {t.hero.cta1}
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-zinc-600 px-8 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-400 hover:text-zinc-100"
            >
              {t.hero.cta2}
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-300"
            >
              {t.hero.cta3} ↓
            </a>
          </motion.div>

          {/* Floating dashboard mockup */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mx-auto mt-16 max-w-4xl"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 shadow-2xl shadow-black/70 sm:p-6"
            >
              <div className="mb-4 flex items-center gap-1.5">
                {["bg-red-500/40","bg-yellow-500/40","bg-green-500/40"].map((c) => (
                  <div key={c} className={`h-2.5 w-2.5 rounded-full ${c}`} />
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {t.stats.map((s) => (
                  <div key={s.label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <p className="text-[11px] text-zinc-500">{s.label}</p>
                    <p className="mt-1 text-xl font-bold text-zinc-100 sm:text-2xl">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3 space-y-2">
                {t.expenses.map((e) => (
                  <div
                    key={e.title}
                    className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5"
                  >
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{e.title}</p>
                      <p className="text-xs text-zinc-500">{e.date}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-zinc-100">{e.amount}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          e.pending
                            ? "bg-amber-400/10 text-amber-400"
                            : "bg-emerald-400/10 text-emerald-400"
                        }`}
                      >
                        {e.pending ? "PENDING" : "PAID"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Problem ─────────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              {t.problem.label}
            </p>
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              {t.problem.title}
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {t.problem.items.map((item, i) => {
              const Icon = problemIcons[i];
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6"
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                    <Icon className="h-5 w-5 text-zinc-400" />
                  </div>
                  <h3 className="mb-2 font-semibold text-zinc-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{item.body}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              {t.features.label}
            </p>
            <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
              {t.features.title}
            </h2>
          </motion.div>

          <motion.div
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            {t.features.items.map((item, i) => {
              const Icon = featureIcons[i];
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`rounded-2xl border p-6 ${
                    item.pro
                      ? "border-amber-400/20 bg-amber-400/5"
                      : "border-zinc-800 bg-zinc-900/60"
                  }`}
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${
                      item.pro
                        ? "border-amber-400/20 bg-amber-400/10"
                        : "border-zinc-800 bg-zinc-900"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${item.pro ? "text-amber-400" : "text-zinc-400"}`}
                    />
                  </div>
                  <h3 className="mb-2 font-semibold text-zinc-100">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-zinc-500">{item.body}</p>
                  {item.pro && (
                    <span className="mt-3 inline-block rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                      Pro
                    </span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── AI Inbox spotlight ───────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col items-center gap-12 lg:flex-row"
          >
            <motion.div variants={fadeUp} className="flex-1">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-400">
                <Mail className="h-3 w-3" />
                {t.inbox.label} · {t.inbox.tag}
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {t.inbox.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                {t.inbox.body}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="flex-1 w-full">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
                {[
                  { from: "Enel Energia",     subject: "Bolletta Aprile 2026 — €148.00",  time: "09:12", tag: "Utility"     },
                  { from: "Agenzia delle Entrate", subject: "Avviso IMU — Scadenza 16 Giugno", time: "ieri",  tag: "Tax"        },
                  { from: "Generali Assicurazioni", subject: "Rinnovo polizza — €420/anno",     time: "2 gg",  tag: "Insurance"  },
                ].map((email) => (
                  <motion.div
                    key={email.from}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-zinc-300">{email.from}</p>
                      <p className="truncate text-xs text-zinc-500">{email.subject}</p>
                    </div>
                    <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                      <span className="text-[10px] text-zinc-600">{email.time}</span>
                      <span className="rounded-full bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold text-amber-400">
                        {email.tag}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Assistant spotlight ──────────────────────────────────────────── */}
      <section className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="flex flex-col-reverse items-center gap-12 lg:flex-row"
          >
            <motion.div variants={fadeUp} className="flex-1 w-full">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
                {t.assistant.examples.map((ex, i) => (
                  <motion.div
                    key={ex}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                    </div>
                    <p className="text-sm text-zinc-300">{ex}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="flex-1">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-bold text-amber-400">
                <Sparkles className="h-3 w-3" />
                {t.assistant.label} · {t.assistant.tag}
              </span>
              <h2 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                {t.assistant.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-400">
                {t.assistant.body}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="mb-16 text-center"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              {t.pricing.label}
            </p>
            <h2 className="mx-auto max-w-xl text-2xl font-bold tracking-tight sm:text-3xl">
              {t.pricing.title}
            </h2>
          </motion.div>

          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* Basic */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ scale: 1.01, y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8"
            >
              <p className="mb-1 text-sm font-semibold text-zinc-400">{t.pricing.basic.name}</p>
              <div className="mb-6 flex items-end gap-1">
                <p className="text-4xl font-bold text-zinc-100">{t.pricing.basic.price}</p>
                {t.pricing.basic.period && (
                  <p className="mb-1 text-sm text-zinc-500">{t.pricing.basic.period}</p>
                )}
              </div>
              <ul className="mb-8 space-y-3">
                {t.pricing.basic.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircle className="h-4 w-4 shrink-0 text-zinc-600" />
                    {f}
                  </li>
                ))}
                {t.pricing.basic.locked.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-700">
                    <AlertCircle className="h-4 w-4 shrink-0 text-zinc-800" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-xl border border-zinc-700 py-2.5 text-center text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
              >
                {t.pricing.basic.cta}
              </Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              whileHover={{ scale: 1.01, y: -4 }}
              animate={{
                boxShadow: [
                  "0 0 0px rgba(251,191,36,0)",
                  "0 0 40px rgba(251,191,36,0.12)",
                  "0 0 0px rgba(251,191,36,0)",
                ],
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20, boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
              className="relative rounded-2xl border border-amber-400/30 bg-zinc-950 p-8"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full border border-amber-400/30 bg-zinc-950 px-3 py-1 text-[10px] font-bold text-amber-400">
                  {t.pricing.pro.badge}
                </span>
              </div>
              <p className="mb-1 text-sm font-semibold text-amber-400">{t.pricing.pro.name}</p>
              <div className="mb-6 flex items-end gap-1">
                <p className="text-4xl font-bold text-zinc-100">{t.pricing.pro.price}</p>
                <p className="mb-1 text-sm text-zinc-500">{t.pricing.pro.period}</p>
              </div>
              <ul className="mb-8 space-y-3">
                {t.pricing.pro.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 shrink-0 text-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className="block w-full rounded-xl bg-white py-2.5 text-center text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
              >
                {t.pricing.pro.cta}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div
              variants={fadeUp}
              className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10"
            >
              <Sparkles className="h-6 w-6 text-amber-400" />
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="mx-auto mb-4 max-w-xl text-2xl font-bold tracking-tight sm:text-3xl"
            >
              {t.cta.title}
            </motion.h2>
            <motion.p variants={fadeUp} className="mb-10 text-zinc-400">
              {t.cta.sub}
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                href="/register"
                className="inline-block rounded-xl bg-white px-10 py-3.5 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
              >
                {t.cta.btn}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
          <LogoWordmark />
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} DomusAI. {t.footer}
          </p>
        </div>
      </footer>

    </div>
  );
}
