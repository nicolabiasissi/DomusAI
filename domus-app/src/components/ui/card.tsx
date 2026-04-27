import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

type Trend = { direction: "up" | "down"; label: string };

export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  subtext?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  trend?: Trend;
}) {
  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-400">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-zinc-100">{value}</h3>
          {subtext && <p className="text-xs text-zinc-500 mt-1">{subtext}</p>}
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 mt-2 text-xs font-medium",
                trend.direction === "up" ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.direction === "up" ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{trend.label}</span>
            </div>
          )}
        </div>
        <div className="h-9 w-9 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 shrink-0">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
