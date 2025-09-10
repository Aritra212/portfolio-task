import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HoldingsTable from "./holdings-table";
import { IStock } from "@/types/common.interfaces";
import { fetchPortfolio } from "@/utils/data-access/portfolio";
import PerformanceSection from "./PerformanceSection";
import SectorAnalysisSection from "./SectorAnalysisSection";
import SectorOverviewSection from "./SectorOverviewSection";

export default async function DashboardWrapper() {
  const { data, error } = await fetchPortfolio({ page: 1 });

  if (error) {
    console.error("Error in fetching data");
    return null;
  }

  const stockData = data as IStock[];

  return (
    <Tabs defaultValue="holdings" className="w-full h-[78vh]">
      <TabsList className="grid w-full grid-cols-4 shrink-0">
        <TabsTrigger value="holdings">Holdings</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="sectors">Sector Analysis</TabsTrigger>
        <TabsTrigger value="overview">Sector Overview</TabsTrigger>
      </TabsList>

      <TabsContent value="holdings">
        <HoldingsTable
          data={stockData}
          params={{ page: 1 }}
          totalCount={stockData.length}
        />
      </TabsContent>

      <TabsContent value="performance">
        <PerformanceSection data={stockData} />
      </TabsContent>

      <TabsContent value="sectors">
        <SectorAnalysisSection data={stockData} />
      </TabsContent>

      <TabsContent value="overview">
        <SectorOverviewSection data={stockData} />
      </TabsContent>
    </Tabs>
  );
}
