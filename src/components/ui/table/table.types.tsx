import { IStock } from "@/types/common.interfaces";
import { ColumnDef } from "@tanstack/react-table";

import React from "react";

export type TableTypeDef = IStock;

type SortOption = {
  label: string;
  value: string;
};

export type FilterOption = {
  id: string;
  label: string;
  options: {
    label: string;
    value: string;
  }[];
};

export type CustomColumnDef = Omit<ColumnDef<TableTypeDef>, "cell"> & {
  type: "text" | "custom" | "status" | "id";
  sortable?: boolean;
  accessorKey: string;
  cell?: (row: TableTypeDef) => React.ReactNode;
  style?: ColumnStyles;
};
export type ColumnStyles = {
  columnStyleClassName?: string;
  rowStyleClassName?: string;
};
export type ColumnDefinition = CustomColumnDef[];

export type TableProps = {
  columns: ColumnDefinition;
  data: TableTypeDef[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  sortOptions?: SortOption[];
  filterOptions?: FilterOption[];
  onParamsChange: (params: TableParams) => void;
  isLoading?: boolean;
  searchPlaceholder?: string;
};

export type TableParams = {
  page: number;
  sort?: string;
  filters?: Record<string, string[]>;
  search?: string;
  pageSize?: number;
};
