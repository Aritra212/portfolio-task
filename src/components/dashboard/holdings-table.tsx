"use client";

import { CustomTable } from "@/components/ui/table/table";
import {
  ColumnDefinition,
  TableParams,
} from "@/components/ui/table/table.types";
import { IStock } from "@/types/common.interfaces";
import { fetchPortfolio } from "@/utils/data-access/portfolio";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import getFilterOptionsFromData from "@/lib/getFilterOptions";

type Props = {
  data: IStock[];
  totalCount: number;
  params: TableParams;
};

export default function HoldingsTable({
  data: initialData,
  totalCount: initialCount,
  params: initialParams,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 100;
  const columns: ColumnDefinition = [
    {
      id: "particulars",
      header: "Particulars",
      type: "custom" as const,
      sortable: true,
      accessorKey: "particulars",
    },
    {
      id: "category",
      header: "Category",
      type: "custom" as const,
      sortable: true,
      accessorKey: "category",
      cell: (row) => <Badge variant={"outline"}>{row.category}</Badge>,
    },
    {
      id: "purchasePrice",
      header: "Purchase Price",
      type: "custom" as const,
      sortable: true,
      accessorKey: "purchasePrice",
      cell: (row) => <div>₹ {row.purchasePrice.toLocaleString()}</div>,
    },
    {
      id: "quantity",
      header: "Quantity",
      type: "custom" as const,
      sortable: true,
      accessorKey: "quantity",
    },
    {
      id: "investment",
      header: "Investment",
      type: "custom" as const,
      accessorKey: "investment",
      cell: (row) => <div>₹ {row.investment.toLocaleString()}</div>,
    },
    {
      id: "portfolioPercent",
      header: "Portfolio %",
      type: "custom" as const,
      accessorKey: "portfolioPercent",
      cell: (row) => <div>{(row.portfolioPercent * 100).toFixed(2)}%</div>,
    },
    {
      id: "nseBse",
      header: "NSE/BSE Code",
      type: "custom" as const,
      accessorKey: "nseBse",
    },
    {
      id: "cmp",
      header: "CMP",
      type: "custom" as const,
      accessorKey: "cmp",
      cell: (row) =>
        row.cmp !== null ? (
          <div>₹ {row.cmp.toLocaleString()}</div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
    },
    {
      id: "presentValue",
      header: "Present Value",
      type: "custom" as const,
      accessorKey: "presentValue",
      cell: (row) =>
        row.presentValue !== null ? (
          <div>₹ {row.presentValue.toLocaleString()}</div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
    },
    {
      id: "gainLoss",
      header: "Gain / Loss",
      type: "custom" as const,
      accessorKey: "gainLoss",
      cell: (row) =>
        row.gainLoss !== null ? (
          <div
            className={row.gainLoss >= 0 ? "text-green-600 " : "text-red-600"}
          >
            ₹ {row.gainLoss.toLocaleString()}
          </div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
    },
    {
      id: "peRatio",
      header: "P/E Ratio",
      type: "custom" as const,
      accessorKey: "peRatio",
      cell: (row) =>
        row.peRatio !== null ? (
          <div>{row.peRatio.toFixed(2)}</div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
    },
    {
      id: "latestEarnings",
      header: "Latest Earnings",
      type: "custom" as const,
      accessorKey: "latestEarnings",
      cell: (row) =>
        row.latestEarnings ? (
          <div>{row.latestEarnings}</div>
        ) : (
          <div className="text-muted-foreground">-</div>
        ),
    },
  ];

  const [data, setData] = useState<IStock[]>(initialData);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [isLoading, setIsLoading] = useState(false);
  const [params, setParams] = useState<TableParams>(initialParams);
  const filterOptions = getFilterOptionsFromData(data);
  const handleParamsChange = async (params: TableParams) => {
    setIsLoading(true);
    setParams(params);

    try {
      const result = await fetchPortfolio(params);

      if (result.success) {
        setData(result.data);
        setTotalCount(result.totalCount);
        setCurrentPage(params.page);
      } else {
        toast.error(result.error || "Error fetching portfolio");
      }
    } catch (error) {
      toast.error(`Unexpected error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    handleParamsChange(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  return (
    <CustomTable
      columns={columns}
      data={data}
      totalCount={totalCount}
      pageSize={pageSize}
      currentPage={currentPage}
      isLoading={isLoading}
      onParamsChange={handleParamsChange}
      searchPlaceholder="Search by particulars/category"
      filterOptions={filterOptions ?? []}
      sortOptions={[
        { label: "Name (A-Z)", value: "particulars+asc" },
        { label: "Name (Z-A)", value: "particulars+dsc" },
        { label: "Investment (Low to High)", value: "investment+asc" },
        { label: "Investment (High to Low)", value: "investment+dsc" },
        { label: "Gain/Loss (Low to High)", value: "gainLoss+asc" },
        { label: "Gain/Loss (High to Low)", value: "gainLoss+dsc" },
      ]}
    />
  );
}
