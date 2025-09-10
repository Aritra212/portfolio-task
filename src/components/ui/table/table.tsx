"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  ArrowUpDown,
  X,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  RefreshCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CustomColumnDef,
  FilterOption,
  TableProps,
  TableTypeDef,
} from "./table.types";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "../separator";
import { Checkbox } from "../checkbox";
import { Label } from "../label";
import { usePathname } from "next/navigation";
import { Badge } from "../badge";
import { PopoverClose } from "@radix-ui/react-popover";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import getRiskStatusColorByName from "@/lib/risk-status-color";

type FilterState = {
  [filterId: string]: string[];
};

export function CustomTable({
  columns,
  data,
  totalCount,
  pageSize,
  currentPage,
  sortOptions = [],
  filterOptions = [],
  onParamsChange,
  isLoading,
  searchPlaceholder = "Search...",
}: TableProps) {
  const pathname = usePathname();

  const initialFilterState = filterOptions.reduce((acc, filter) => {
    acc[filter.id] = [];
    return acc;
  }, {} as FilterState);

  const [search, setSearch] = useState("");
  const [selectedFilters, setSelectedFilters] =
    useState<FilterState>(initialFilterState);
  const [currentSort, setCurrentSort] = useState<string>(sortOptions[0].value);
  const [tempFilters, setTempFilters] =
    useState<FilterState>(initialFilterState);
  const [filterSearches, setFilterSearches] = useState<Record<string, string>>(
    {}
  );
  const [expandedFilters, setExpandedFilters] = useState<
    Record<string, boolean>
  >({});
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const totalPages = Math.ceil(totalCount / rowsPerPage);

  const debouncedSearchTerm = useDebounce(search, 300);

  useEffect(() => {
    if (debouncedSearchTerm === "") return;

    onParamsChange({
      page: 1,
      search: debouncedSearchTerm,
      sort: currentSort,
      filters: selectedFilters,
      pageSize,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handlePageChange = (newPage: number) => {
    onParamsChange({
      page: newPage,
      search,
      sort: currentSort,
      filters: selectedFilters,
      pageSize,
    });
  };

  const handleSortChange = (value: string, checked: boolean) => {
    if (!checked) value = sortOptions[0].value;

    setCurrentSort(value);
    onParamsChange({
      page: currentPage,
      search,
      sort: value,
      filters: selectedFilters,
      pageSize,
    });
  };

  const totalSelectedFilters = Object.values(selectedFilters).reduce(
    (total, group) => total + group.length,
    0
  );

  const handleTempFilterChange = (
    filterId: string,
    value: string,
    checked: boolean
  ) => {
    setTempFilters((prev) => {
      const filterGroup = [...(prev[filterId] || [])];

      if (checked) {
        if (!filterGroup.includes(value)) filterGroup.push(value);
      } else {
        const index = filterGroup.indexOf(value);
        if (index > -1) filterGroup.splice(index, 1);
      }

      return {
        ...prev,
        [filterId]: filterGroup,
      };
    });
  };

  const handleApplyFilters = () => {
    const nonEmptyFilters = Object.entries(tempFilters).reduce(
      (acc, [key, values]) => {
        if (values.length > 0) {
          acc[key] = values;
        }
        return acc;
      },
      {} as FilterState
    );

    setSelectedFilters(nonEmptyFilters);
    onParamsChange({
      page: 1,
      search,
      sort: currentSort,
      filters: nonEmptyFilters,
      pageSize,
    });
  };

  const clearFilters = () => {
    setSelectedFilters(initialFilterState);
    setTempFilters(initialFilterState);
    onParamsChange({
      page: 1,
      search,
      sort: currentSort,
      filters: {},
    });
  };

  const getFilteredOptions = (filter: FilterOption) => {
    const searchTerm = filterSearches[filter.id]?.toLowerCase() || "";
    const options = filter.options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm)
    );

    if (!expandedFilters[filter.id]) {
      return options.slice(0, 5);
    }
    return options;
  };

  const resetFilters = () => {
    setSelectedFilters(initialFilterState);
    setTempFilters(initialFilterState);
    setCurrentSort(sortOptions[0].value);
    setFilterSearches({});
    setExpandedFilters({});

    onParamsChange({
      page: 1,
      search: "",
      sort: sortOptions[0].value,
      filters: {},
      pageSize: 100,
    });
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPageInput(value);
  };

  const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newPage = parseInt(pageInput);

      if (!isNaN(newPage) && newPage >= 1 && newPage <= totalPages)
        return handlePageChange(newPage);

      setPageInput(currentPage.toString());
    }
  };

  const handleRowsPerPageChange = (value: string) => {
    const newSize = parseInt(value);
    setRowsPerPage(newSize);
    onParamsChange({
      page: 1,
      search,
      sort: currentSort,
      filters: selectedFilters,
      pageSize: newSize,
    });
  };
  return (
    <div className="flex flex-col border-2 rounded-2xl divide-y-2 h-full pr-2">
      {/* Table Controls */}
      <div className="flex flex-wrap flex-shrink-0 justify-between items-center gap-4 px-4 h-16 min-h-16">
        <div className="flex items-center gap-4">
          {/* Sort */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size={"sm"} className="border-2">
                <ArrowUpDown />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 max-h-96" align="start">
              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Sort By
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  checked={option.value === currentSort}
                  onCheckedChange={(checked) =>
                    handleSortChange(option.value, checked)
                  }
                >
                  {option.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Filters */}
          {filterOptions && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size={"sm"} className="border-2">
                  <Filter />
                  Filter
                  {totalSelectedFilters > 0 && (
                    <span className="flex justify-center items-center bg-primary ml-2 rounded-full w-5 h-5 text-background text-xs">
                      {totalSelectedFilters}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="relative p-0 w-80" align="start">
                <div className="top-0 z-10 sticky flex justify-between items-center bg-background/40 backdrop-blur-3xl px-4 py-2">
                  <p className="font-bold text-muted-foreground text-xs">
                    Filter By
                  </p>
                  <PopoverClose asChild>
                    <Button
                      size="sm"
                      variant={"link"}
                      onClick={handleApplyFilters}
                      className="p-0"
                    >
                      Apply
                    </Button>
                  </PopoverClose>
                </div>
                <Separator />
                <Accordion type="single" collapsible className="w-full">
                  {filterOptions.map((filter) => {
                    const _selectedFilters = tempFilters[filter.id] || [];
                    const selectedCount = _selectedFilters.length;

                    return (
                      <AccordionItem key={filter.id} value={filter.id}>
                        <AccordionTrigger>
                          <span className="flex items-center mx-4">
                            {filter.label}
                            {selectedCount > 0 && (
                              <span className="flex justify-center items-center bg-primary ml-2 rounded-full w-4 h-4 font-bold text-[10px] text-background">
                                {selectedCount}
                              </span>
                            )}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3">
                            <div className="space-y-2 px-4">
                              <div className="relative">
                                <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
                                <Input
                                  placeholder="Search..."
                                  value={filterSearches[filter.id] || ""}
                                  onChange={(e) =>
                                    setFilterSearches((prev) => ({
                                      ...prev,
                                      [filter.id]: e.target.value,
                                    }))
                                  }
                                  className="bg-transparent pl-8"
                                />
                              </div>
                              {!!(selectedCount > 0) && (
                                <div className="flex flex-wrap items-center gap-2">
                                  {_selectedFilters.map((v) => (
                                    <Badge key={v}>
                                      {
                                        getFilteredOptions(filter).find(
                                          (d) => d.value === v
                                        )?.label
                                      }{" "}
                                      <X
                                        className="ml-2 w-3 h-3 cursor-pointer"
                                        onClick={() =>
                                          handleTempFilterChange(
                                            filter.id,
                                            v,
                                            false
                                          )
                                        }
                                      />
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="space-y-3">
                              {getFilteredOptions(filter).map((option) => (
                                <div
                                  key={option.value}
                                  className="flex items-center space-x-2.5 px-4"
                                >
                                  <Checkbox
                                    id={`${filter.id}-${option.value}`}
                                    checked={(
                                      tempFilters[filter.id] ||
                                      selectedFilters[filter.id] ||
                                      []
                                    ).includes(option.value)}
                                    onCheckedChange={(checked) =>
                                      handleTempFilterChange(
                                        filter.id,
                                        option.value,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={`${filter.id}-${option.value}`}
                                    className="peer-disabled:opacity-70 font-normal text-sm leading-none peer-disabled:cursor-not-allowed cursor-pointer"
                                  >
                                    {option.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            {filter.options.length > 5 && (
                              <Button
                                variant="link"
                                size={"sm"}
                                onClick={() =>
                                  setExpandedFilters((prev) => ({
                                    ...prev,
                                    [filter.id]: !prev[filter.id],
                                  }))
                                }
                                className="px-4 py-0 font-normal"
                              >
                                {expandedFilters[filter.id]
                                  ? "Show Less"
                                  : "View All..."}
                              </Button>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
                <Separator />
                <div className="text-right bottom-0 sticky bg-background/40 backdrop-blur-3xl">
                  <PopoverClose asChild>
                    <Button
                      size="sm"
                      variant="link"
                      onClick={clearFilters}
                      className="px-4 py-0 text-xs"
                      disabled={totalSelectedFilters === 0}
                    >
                      Clear all
                    </Button>
                  </PopoverClose>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        <div className="flex items-center gap-4 divide-x min-w-[300px]">
          {/* Total Count */}
          <div className="text-muted-foreground text-nowrap text-sm">
            Total: {totalCount} items
          </div>

          <div className="relative min-w-96">
            <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent pl-8"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="relative flex-1 min-h-0">
        <div className="absolute inset-0 overflow-auto no-scrollbar">
          <Table>
            <TableHeader className="top-0 z-30 sticky">
              <TableRow>
                {columns.map((column, i) => (
                  <TableHead
                    key={column.id}
                    className={cn(
                      "min-w-28 bg-accent",
                      i === 0 && "sticky left-0 min-w-40"
                    )}
                  >
                    {`${column.header}`}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      {columns.map((_, colIndex) => (
                        <TableCell
                          key={`${index}-${colIndex}`}
                          className={cn(
                            colIndex === 0 && "sticky left-0 z-20 bg-input"
                          )}
                        >
                          <div className="bg-muted rounded w-full h-6 animate-pulse" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No results found
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column, i) => (
                      <TableCell
                        key={`${rowIndex}-${column.id}`}
                        className={cn(
                          i === 0 && "sticky left-0 z-20 backdrop-blur-2xl"
                        )}
                      >
                        {column.cell ? (
                          column.cell(row)
                        ) : (
                          <RenderCell
                            pathname={pathname}
                            row={row}
                            column={column}
                          />
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap flex-shrink-0 justify-between items-center gap-4 px-4 h-12 min-h-12">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <span className="text-muted-foreground text-sm shrink-0">Page</span>
          <Input
            className="bg-transparent rounded-md w-12 h-7"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyDown}
          />
          <span className="text-muted-foreground text-sm shrink-0">
            of {totalPages}
          </span>
          <Button
            variant="outline"
            className="shrink-0"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={handleRowsPerPageChange}
          >
            <SelectTrigger className="bg-transparent w-28 h-7 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="100">100 rows</SelectItem>
              <SelectItem value="200">200 rows</SelectItem>
              <SelectItem value="500">500 rows</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            {totalCount} records
          </span>
          {/* Reset Filters */}
          <Button
            variant={"link"}
            size={"sm"}
            onClick={resetFilters}
            className=""
          >
            <RefreshCcw /> Refresh
          </Button>
        </div>
      </div>
    </div>
  );
}

const RenderCell = ({
  row,
  pathname,
  column,
}: {
  row: TableTypeDef;
  column: CustomColumnDef;
  pathname: string;
}) => {
  const key = column.accessorKey;

  if (!key || !(key in row)) return <span>—</span>;

  const value = row[key];

  switch (column.type) {
    case "id":
      return (
        <Link
          className="flex items-center gap-2 hover:text-primary group"
          href={`${pathname}/${value}`}
          target="_blank"
        >
          {(value as string).slice(-4)}
          <ExternalLink className="w-4 h-4 group-hover:text-primary text-muted-foreground" />
        </Link>
      );
    case "status":
      return <StatusBadge color={String(value)} />;
    default:
      return (
        <span>
          {value !== null && value !== undefined ? String(value) : "—"}
        </span>
      );
  }
};

type StatusBadgeProps = {
  color: string;
};

const StatusBadge = ({ color }: StatusBadgeProps) => (
  <span
    className="px-3 py-1 rounded-lg font-medium text-xs uppercase text-white"
    style={{ backgroundColor: getRiskStatusColorByName(color) }}
  >
    {color}
  </span>
);
