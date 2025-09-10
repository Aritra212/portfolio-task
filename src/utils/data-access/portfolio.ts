"use server";

import { TableParams } from "@/components/ui/table/table.types";
import { IStock } from "@/types/common.interfaces";

export async function fetchPortfolio(params: TableParams) {
  const {
    page = 1,
    pageSize = 100,
    search = "",
    sort = "",
    filters = {},
  } = params;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/portfolio`, { cache: "no-store" });

  if (!res.ok) {
    console.error(`Error fetching portfolio data: ${res.status}`);
    return {
      success: false,
      data: [],
      totalCount: 0,
      error: "Error in getting portfolio data",
    };
  }

  const rawData: IStock[] = await res.json();

  // Step 1: Search
  let filteredData = rawData;
  if (search) {
    const lowered = search.toLowerCase();
    filteredData = filteredData.filter(
      (item) =>
        item.particulars.toLowerCase().includes(lowered) ||
        item.category.toLowerCase().includes(lowered)
    );
  }

  // Step 2: Filters (multi-select)
  Object.entries(filters).forEach(([key, values]) => {
    if (values.length > 0) {
      filteredData = filteredData.filter((item) =>
        values.includes(String(item[key as keyof IStock]))
      );
    }
  });

  // Step 3: Sorting
  if (sort) {
    const [key, direction] = sort.split("+");

    filteredData = filteredData.sort((a, b) => {
      const aValue = a[key as keyof IStock];
      const bValue = b[key as keyof IStock];

      // handle nulls
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  // Step 4: Pagination
  const totalCount = filteredData.length;
  const startIndex = (page - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return {
    success: true,
    data: paginatedData,
    totalCount,
  };
}
