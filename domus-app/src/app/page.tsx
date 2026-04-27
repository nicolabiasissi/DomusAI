import Link from "next/link";
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

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 scroll-smooth">

      {/* ── Nav ───────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <LogoWordmark />
          <Link
            href="/login"
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-24 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-medium text-amber-400">
          <Sparkles className="h-3 w-3" />
          AI-powered property expense management
        </div>

        <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-6xl">
          Stop losing track of your{" "}
          <span className="text-amber-400">home expenses</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          DomusAI brings all your properties, bills, deadlines, and invoices
          into one intelligent dashboard — with AI automation that reads your
          inbox so you never miss a payment again.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/login"
            className="rounded-xl bg-white px-8 py-3 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
          >
            Try Demo
          </Link>
          <a
            href="#features"
            className="rounded-xl border border-zinc-700 px-8 py-3 text-sm font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:text-zinc-100"
          >
            View Features ↓
          </a>
        </div>

        {/* Dashboard preview mockup */}
        <div className="mx-auto mt-16 max-w-4xl rounded-2xl border border-zinc-800 bg-zinc-900 p-6 text-left shadow-2xl shadow-black/60">
          <div className="mb-4 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total Expenses", value: "€4,244", sub: "This month" },
              { label: "Pending Bills", value: "4", sub: "Due soon" },
              { label: "Properties", value: "3", sub: "Active" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-xs text-zinc-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-zinc-100">{stat.value}</p>
                <p className="text-xs text-zinc-600">{stat.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            {[
              { title: "Property Tax Q2", amount: "€2,000", date: "May 15", status: "PENDING" },
              { title: "Building Insurance", amount: "€420", date: "May 1", status: "PENDING" },
              { title: "Monthly Rent", amount: "€1,200", date: "Apr 1", status: "PAID" },
            ].map((exp) => (
              <div key={exp.title} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5">
                <div>
                  <p className="text-sm font-medium text-zinc-200">{exp.title}</p>
                  <p className="text-xs text-zinc-500">Due {exp.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-zinc-100">{exp.amount}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${exp.status === "PENDING" ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"}`}>
                    {exp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem ───────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500">
            The problem
          </p>
          <h2 className="mx-auto mb-16 max-w-2xl text-center text-3xl font-bold tracking-tight text-zinc-100">
            Managing home expenses is more painful than it should be
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Bell,
                title: "Forgotten bills",
                body: "Due dates pile up across utilities, insurance, and taxes — and one missed payment means penalties.",
              },
              {
                icon: FolderOpen,
                title: "Lost invoices",
                body: "PDF receipts buried in email threads, downloads folders, and paper stacks you can't find when you need them.",
              },
              {
                icon: Clock,
                title: "Missed deadlines",
                body: "Tax quarters, insurance renewals, and maintenance windows slip by without a centralised reminder system.",
              },
              {
                icon: Mail,
                title: "Inbox chaos",
                body: "Expense-related emails from landlords, suppliers, and utilities mixed in with everything else you receive.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900">
                  <Icon className="h-5 w-5 text-zinc-400" />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Features
          </p>
          <h2 className="mx-auto mb-16 max-w-2xl text-center text-3xl font-bold tracking-tight text-zinc-100">
            Everything your properties need, in one place
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: LayoutDashboard,
                title: "Expense Dashboard",
                body: "See all your expenses at a glance. Filter by property, category, or status. Know exactly what is paid and what is pending.",
                accent: false,
              },
              {
                icon: Building2,
                title: "Property Management",
                body: "Track multiple properties independently. Each property gets its own expense history, documents, and deadlines.",
                accent: false,
              },
              {
                icon: Bell,
                title: "Smart Reminders",
                body: "Automatic alerts before due dates so you always pay on time. Never miss a tax quarter or insurance renewal again.",
                accent: false,
              },
              {
                icon: Mail,
                title: "AI Inbox",
                body: "Connect your email and let DomusAI automatically detect, extract, and categorise expense-related messages.",
                accent: true,
              },
              {
                icon: Sparkles,
                title: "Virtual Assistant",
                body: "Ask questions about your expenses in plain language. Get summaries, breakdowns, and suggestions powered by AI.",
                accent: true,
              },
              {
                icon: FileText,
                title: "Invoice Management",
                body: "All your PDF invoices stored, linked to the right expense, and always findable — even years later.",
                accent: false,
              },
            ].map(({ icon: Icon, title, body, accent }) => (
              <div
                key={title}
                className={`rounded-2xl border p-6 transition-colors ${
                  accent
                    ? "border-amber-400/20 bg-amber-400/5"
                    : "border-zinc-800 bg-zinc-900/60"
                }`}
              >
                <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl border ${accent ? "border-amber-400/20 bg-amber-400/10" : "border-zinc-800 bg-zinc-900"}`}>
                  <Icon className={`h-5 w-5 ${accent ? "text-amber-400" : "text-zinc-400"}`} />
                </div>
                <h3 className="mb-2 font-semibold text-zinc-100">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{body}</p>
                {accent && (
                  <span className="mt-3 inline-block rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-amber-400">
                    Pro
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" className="border-t border-zinc-800 bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Pricing
          </p>
          <h2 className="mx-auto mb-16 max-w-xl text-center text-3xl font-bold tracking-tight text-zinc-100">
            Simple plans, no surprises
          </h2>

          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-2">
            {/* Basic */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-8">
              <p className="mb-1 text-sm font-semibold text-zinc-400">Basic</p>
              <p className="mb-6 text-4xl font-bold text-zinc-100">Free</p>
              <ul className="mb-8 space-y-3">
                {[
                  "1 property",
                  "Expense tracking",
                  "Bill reminders",
                  "Basic assistant",
                  "Manual invoice upload",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-400">
                    <CheckCircle className="h-4 w-4 shrink-0 text-zinc-600" />
                    {f}
                  </li>
                ))}
                {[
                  "AI Inbox automation",
                  "Unlimited properties",
                  "Advanced AI analysis",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-600">
                    <AlertCircle className="h-4 w-4 shrink-0 text-zinc-700" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full rounded-xl border border-zinc-700 py-2.5 text-center text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-500 hover:text-zinc-100"
              >
                Get started free
              </Link>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border border-amber-400/30 bg-zinc-950 p-8 shadow-[0_0_40px_rgba(251,191,36,0.06)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold text-amber-400">
                  RECOMMENDED
                </span>
              </div>
              <p className="mb-1 text-sm font-semibold text-amber-400">Pro</p>
              <div className="mb-6 flex items-end gap-1">
                <p className="text-4xl font-bold text-zinc-100">€9</p>
                <p className="mb-1 text-sm text-zinc-500">/month</p>
              </div>
              <ul className="mb-8 space-y-3">
                {[
                  "Unlimited properties",
                  "Full expense dashboard",
                  "AI Inbox automation",
                  "Virtual AI assistant",
                  "Invoice management & PDFs",
                  "Advanced spending analysis",
                  "Priority support",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-zinc-300">
                    <CheckCircle className="h-4 w-4 shrink-0 text-amber-400" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/login"
                className="block w-full rounded-xl bg-white py-2.5 text-center text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
              >
                Start Pro trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/20 bg-amber-400/10">
            <Sparkles className="h-6 w-6 text-amber-400" />
          </div>
          <h2 className="mx-auto mb-4 max-w-xl text-3xl font-bold tracking-tight text-zinc-100">
            Start managing your home expenses today
          </h2>
          <p className="mb-10 text-zinc-400">
            Join DomusAI and take back control of your properties and bills.
          </p>
          <Link
            href="/login"
            className="inline-block rounded-xl bg-white px-10 py-3.5 text-sm font-bold text-zinc-950 transition-all hover:bg-zinc-200 active:scale-95"
          >
            Get started — it&apos;s free
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 bg-zinc-950">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <LogoWordmark />
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} DomusAI. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
