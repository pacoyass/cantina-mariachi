import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link, useFetcher } from "react-router";
import { Edit, Eye, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "@/lib/lucide-shim";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollBar } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

export function TranslationsDataTable({ data = [], sortBy = '', sortOrder = 'asc', onSort }) {
  const fetcher = useFetcher();
  
  // Convert server-side sorting to TanStack table format
  const [sorting, setSorting] = useState(
    sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : []
  );

  // Update local sorting state when props change
  useEffect(() => {
    if (sortBy) {
      setSorting([{ id: sortBy, desc: sortOrder === 'desc' }]);
    } else {
      setSorting([]);
    }
  }, [sortBy, sortOrder]);

  const handleSort = (columnId) => {
    const currentSort = sorting.find(s => s.id === columnId);
    let newOrder = 'asc';
    
    if (currentSort) {
      // If already sorting by this column, toggle the order
      newOrder = currentSort.desc ? 'asc' : 'desc';
    }
    
    // Call parent's onSort handler for server-side sorting
    if (onSort) {
      onSort(columnId, newOrder);
    }
  };

  const columns = [
    {
      accessorKey: "key",
      enableSorting: true,
      header: ({ column }) => {
        const isSorted = sorting.find(s => s.id === 'key');
        const SortIcon = isSorted ? (isSorted.desc ? ArrowDown : ArrowUp) : ArrowUpDown;
        return (
          <Button
            variant="ghost"
            onClick={() => handleSort('key')}
            className="h-8 px-2 hover:bg-accent"
          >
            Key
            <SortIcon className={`ml-2 h-4 w-4 ${isSorted ? 'text-primary' : ''}`} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.getValue("key")}</div>
      ),
    },
    {
      accessorKey: "namespace",
      enableSorting: true,
      header: ({ column }) => {
        const isSorted = sorting.find(s => s.id === 'namespace');
        const SortIcon = isSorted ? (isSorted.desc ? ArrowDown : ArrowUp) : ArrowUpDown;
        return (
          <Button
            variant="ghost"
            onClick={() => handleSort('namespace')}
            className="h-8 w-full justify-start px-2 hover:bg-accent"
          >
            Namespace
            <SortIcon className={`ml-2 h-4 w-4 ${isSorted ? 'text-primary' : ''}`} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("namespace")}</Badge>
      ),
    },
    {
      accessorKey: "locale",
      enableSorting: true,
      header: ({ column }) => {
        const isSorted = sorting.find(s => s.id === 'locale');
        const SortIcon = isSorted ? (isSorted.desc ? ArrowDown : ArrowUp) : ArrowUpDown;
        return (
          <Button
            variant="ghost"
            onClick={() => handleSort('locale')}
            className="h-8 w-full justify-start px-2 hover:bg-accent"
          >
            Locale
            <SortIcon className={`ml-2 h-4 w-4 ${isSorted ? 'text-primary' : ''}`} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <Badge variant="secondary">{row.getValue("locale")}</Badge>
      ),
    },
    {
      accessorKey: "value",
      enableSorting: true,
      header: ({ column }) => {
        const isSorted = sorting.find(s => s.id === 'value');
        const SortIcon = isSorted ? (isSorted.desc ? ArrowDown : ArrowUp) : ArrowUpDown;
        return (
          <Button
            variant="ghost"
            onClick={() => handleSort('value')}
            className="h-8 w-full justify-start px-2 hover:bg-accent"
          >
            Value
            <SortIcon className={`ml-2 h-4 w-4 ${isSorted ? 'text-primary' : ''}`} />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="max-w-md truncate">{row.getValue("value")}</div>
      ),
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive");
        return isActive ? (
          <Badge variant="success">Active</Badge>
        ) : (
          <Badge variant="destructive">Inactive</Badge>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => {
        const translation = row.original;

        return (
          <div className="flex justify-end gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/dashboard/admin/translations/${translation.id}`}>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={10}>
                <p>View</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link to={`/dashboard/admin/translations/${translation.id}/edit`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={10}>
                <p>Edit</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!confirm("Are you sure you want to delete this translation?")) {
                      return;
                    }
                    fetcher.submit(
                      { intent: "delete", id: translation.id },
                      { method: "post" }
                    );
                  }}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={10}>
                <p>Delete</p>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    // Disable client-side sorting since we're using server-side sorting
    manualSorting: true,
    state: {
      sorting,
    },
  });

  // Safety check
  if (!Array.isArray(data)) {
    return <div className="text-center py-8 text-destructive">Invalid data format</div>;
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <ScrollBar orientation="horizontal" />
      </Table>
    </div>
  );
}
