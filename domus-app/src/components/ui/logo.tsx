import { Building2 } from "lucide-react";

export function LogoMark() {
  return (
    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-sm">
      <Building2 className="h-4 w-4 text-zinc-900" strokeWidth={2} />
    </div>
  );
}

export function LogoWordmark() {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark />
      <span className="text-[17px] font-bold tracking-tight leading-none">
        Domus<span className="text-zinc-400">AI</span>
      </span>
    </div>
  );
}
