import DashboardWrapper from "@/components/dashboard/dashboard-wrapper";
import ThemeSwitcher from "@/components/theme-switcher";

export default function Dashboard() {
  return (
    <div className="container mx-auto py-10 space-y-10 h-screen">
      <div className="space-y-2 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-muted-foreground">
            Portfolio Dashboard
          </h1>
          <p className="text-lg">
            Track your investments with real-time market data
          </p>
        </div>
        <ThemeSwitcher />
      </div>

      <DashboardWrapper />
    </div>
  );
}
