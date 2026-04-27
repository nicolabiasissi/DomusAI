"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { LogoWordmark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { Check, Upload, FileText, Car, Plane } from "lucide-react";

const DOC_TYPES = [
  { id: "id", label: "ID Card", icon: FileText },
  { id: "license", label: "Driving License", icon: Car },
  { id: "passport", label: "Passport", icon: Plane },
];

const STEPS = ["Document Type", "Upload Document", "Email Verification"];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, loading, updateUser } = useAuth();
  const [step, setStep] = useState(0);
  const [docType, setDocType] = useState("");
  const [fileName, setFileName] = useState("");
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (user.verified) router.replace("/dashboard");
  }, [user, loading, router]);

  if (loading || !user) return null;

  const handleVerify = () => {
    if (code.length !== 6) {
      setCodeError("Please enter a 6-digit code.");
      return;
    }
    setVerifying(true);
    setTimeout(() => {
      updateUser({ verified: true });
      router.replace("/dashboard");
    }, 800);
  };

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex justify-center">
        <LogoWordmark />
      </div>

      {/* Step progress */}
      <div className="flex items-center mb-8 gap-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1 last:flex-none last:flex-initial">
            <div className="flex items-center gap-2 shrink-0">
              <div
                className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors",
                  i < step
                    ? "bg-white text-zinc-900"
                    : i === step
                    ? "bg-white text-zinc-900"
                    : "bg-zinc-800 text-zinc-500"
                )}
              >
                {i < step ? <Check className="h-3 w-3" /> : i + 1}
              </div>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block whitespace-nowrap",
                  i <= step ? "text-zinc-300" : "text-zinc-600"
                )}
              >
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-3 transition-colors",
                  i < step ? "bg-white/30" : "bg-zinc-800"
                )}
              />
            )}
          </div>
        ))}
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        {/* Step 1: Document type */}
        {step === 0 && (
          <>
            <h2 className="text-lg font-bold text-zinc-100 mb-1">Choose document type</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Select the document you&apos;ll use to verify your identity.
            </p>
            <div className="space-y-3">
              {DOC_TYPES.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setDocType(id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all",
                    docType === id
                      ? "border-white/30 bg-white/5 text-zinc-100"
                      : "border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="font-medium text-sm">{label}</span>
                  {docType === id && <Check className="ml-auto h-4 w-4 text-white" />}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(1)}
              disabled={!docType}
              className="mt-6 w-full bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </>
        )}

        {/* Step 2: Upload document */}
        {step === 1 && (
          <>
            <h2 className="text-lg font-bold text-zinc-100 mb-1">Upload your document</h2>
            <p className="text-sm text-zinc-500 mb-6">
              Upload a clear photo or scan of your{" "}
              {DOC_TYPES.find((d) => d.id === docType)?.label.toLowerCase()}.
            </p>
            <label className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-zinc-700 rounded-xl p-10 cursor-pointer hover:border-zinc-500 hover:bg-zinc-800/20 transition-all">
              <Upload className="h-8 w-8 text-zinc-500" />
              <div className="text-center">
                <p className="text-sm font-medium text-zinc-300">Click to upload</p>
                <p className="text-xs text-zinc-600 mt-1">JPG, PNG or PDF · max 10MB</p>
              </div>
              <input
                type="file"
                accept="image/*,.pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files?.[0]) setFileName(e.target.files[0].name);
                }}
              />
            </label>
            {fileName && (
              <div className="mt-3 flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                <Check className="h-3.5 w-3.5 shrink-0" />
                {fileName} ready to submit
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="flex-1 border border-zinc-700 text-zinc-300 py-2.5 rounded-lg font-bold text-sm hover:border-zinc-500 transition-all"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!fileName}
                className="flex-1 bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </>
        )}

        {/* Step 3: Email verification */}
        {step === 2 && (
          <>
            <h2 className="text-lg font-bold text-zinc-100 mb-1">Verify your email</h2>
            <p className="text-sm text-zinc-500 mb-1">
              We sent a 6-digit code to{" "}
              <span className="text-zinc-300 font-medium">{user.email}</span>.
            </p>
            <p className="text-xs text-amber-500/80 mb-6">
              Demo: enter any 6 digits to continue.
            </p>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">
                Verification Code
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => {
                  setCodeError("");
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
                }}
                placeholder="000000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-3 text-lg text-zinc-200 text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-zinc-700 transition-all placeholder:text-zinc-700 placeholder:tracking-normal"
              />
              {codeError && (
                <p className="text-xs text-red-400 mt-1.5">{codeError}</p>
              )}
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 border border-zinc-700 text-zinc-300 py-2.5 rounded-lg font-bold text-sm hover:border-zinc-500 transition-all"
              >
                Back
              </button>
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="flex-1 bg-white text-zinc-950 py-2.5 rounded-lg font-bold text-sm hover:bg-zinc-200 transition-all active:scale-95 disabled:opacity-60"
              >
                {verifying ? "Verifying…" : "Verify & Enter"}
              </button>
            </div>
          </>
        )}
      </div>

      <p className="text-center text-xs text-zinc-600 mt-6">
        Your data is stored locally and never sent to any server.
      </p>
    </div>
  );
}
