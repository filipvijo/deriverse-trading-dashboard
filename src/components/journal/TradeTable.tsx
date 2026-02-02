"use client";

import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTradeStore } from "@/store/tradeStore";
import { Trade } from "@/types";
import { formatCurrency, formatDateTime, formatDuration, cn } from "@/lib/utils";
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  BookOpen,
  MessageSquare
} from "lucide-react";

function AnnotationCell({ tradeId }: { tradeId: string }) {
  const { annotations, updateAnnotation } = useTradeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(annotations[tradeId] || "");

  const handleSave = () => {
    updateAnnotation(tradeId, value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === "Enter" && handleSave()}
        className="h-7 text-xs"
        autoFocus
        placeholder="Add note..."
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 transition-colors"
    >
      <MessageSquare className="h-3 w-3" />
      {annotations[tradeId] || "Add note"}
    </button>
  );
}

const columns: ColumnDef<Trade>[] = [
  {
    accessorKey: "entryTime",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
        Date <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-xs text-slate-300">
        {formatDateTime(row.original.entryTime)}
      </span>
    )
  },
  {
    accessorKey: "symbol",
    header: "Symbol",
    cell: ({ row }) => (
      <span className="font-mono text-sm font-medium text-cyan-400">
        {row.original.symbol}
      </span>
    )
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant={row.original.type === "LONG" ? "long" : "short"}>
        {row.original.type}
      </Badge>
    )
  },
  {
    accessorKey: "entryPrice",
    header: "Entry",
    cell: ({ row }) => (
      <span className="font-mono text-xs">${row.original.entryPrice.toFixed(4)}</span>
    )
  },
  {
    accessorKey: "exitPrice",
    header: "Exit",
    cell: ({ row }) => (
      <span className="font-mono text-xs">
        {row.original.exitPrice ? `$${row.original.exitPrice.toFixed(4)}` : "-"}
      </span>
    )
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <span className="font-mono text-xs">{formatCurrency(row.original.size)}</span>
    )
  },
  {
    accessorKey: "pnl",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting()}>
        PnL <ArrowUpDown className="ml-1 h-3 w-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className={cn(
        "font-mono text-sm font-medium",
        row.original.pnl >= 0 ? "text-emerald-400" : "text-red-400"
      )}>
        {row.original.pnl >= 0 ? "+" : ""}{formatCurrency(row.original.pnl)}
      </span>
    )
  },
  {
    accessorKey: "fees",
    header: "Fees",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-amber-400">
        {formatCurrency(row.original.fees)}
      </span>
    )
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-xs text-slate-400">{formatDuration(row.original.duration)}</span>
    )
  },
  {
    id: "annotation",
    header: "Notes",
    cell: ({ row }) => <AnnotationCell tradeId={row.original.id} />
  }
];

export function TradeTable() {
  const { trades, isLoading } = useTradeStore();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable({
    data: trades,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } }
  });

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <BookOpen className="h-5 w-5 text-cyan-400" />
            Trade Journal
          </CardTitle>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Filter trades..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border border-slate-800">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i}>
                    {columns.map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-800/50 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="whitespace-nowrap px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-slate-400">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            of {table.getFilteredRowModel().rows.length} trades
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-slate-400">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

