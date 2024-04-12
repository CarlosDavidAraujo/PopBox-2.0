"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  SortingState,
  Table,
  VisibilityState,
} from "@tanstack/react-table";

type DataTableContextProps<TData> = {
  table: Table<TData>;
};

type DataTableProviderProps<TData, TValue> = {
  children: ReactNode;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  withPagination?: boolean;
};

const DataTableContext = createContext({} as DataTableContextProps<any>);

export function useDataTable<TData>() {
  return useContext(DataTableContext) as DataTableContextProps<TData>;
}

export function DataTableProvider<TData, TValue>({
  children,
  data,
  columns,
  withPagination = true,
}: DataTableProviderProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>(
    withPagination
      ? { pageIndex: 0, pageSize: 10 }
      : { pageIndex: 0, pageSize: data.length },
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <DataTableContext.Provider
      value={{
        table,
      }}
    >
      {children}
    </DataTableContext.Provider>
  );
}
