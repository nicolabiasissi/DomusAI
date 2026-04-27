import { Sidebar } from "@/components/ui/sidebar";
import { Topbar } from "@/components/ui/topbar";
import { AuthGuard } from "@/components/ui/auth-guard";
import { DataProvider } from "@/context/data-context";
import { AssistantWidget } from "@/components/ui/assistant-panel";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DataProvider>
        <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
          <Sidebar />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Topbar />
            <main className="flex-1 overflow-y-auto p-6">
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
        <AssistantWidget />
      </DataProvider>
    </AuthGuard>
  );
}
