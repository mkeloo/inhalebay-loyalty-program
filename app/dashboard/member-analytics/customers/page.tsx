"use client";

import * as React from "react";
import {
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    ColumnResizeMode,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { columns } from "./columns";
import { fetchCustomers } from "../../../actions/customers";

export type Customer = {
    id: string;
    store_id: string;
    phone_number: string;
    name: string;
    avatar_name?: string;
    current_points?: number;
    lifetime_points?: number;
    total_visits?: number;
    last_visit?: string;
    joined_date?: string;
    membership_level?: string;
    is_active?: boolean;
    created_at: string;
    updated_at: string;
};

export default function CustomersTable() {
    const [data, setData] = React.useState<Customer[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [page, setPage] = React.useState<number>(1);
    const pageSize = 20;

    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetchCustomers(page, pageSize);
            if (response.success) {
                setData(response.data);
            }
            setLoading(false);
        };
        fetchData();
    }, [page]);

    const table = useReactTable({
        data,
        columns,
        enableColumnResizing: true,
        columnResizeMode: "onChange" as ColumnResizeMode,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        initialState: {
            pagination: { pageSize },
        },
    });

    return (
        <div className="w-full max-w-[1200px]">
            {/* Filter input */}
            <div className="flex items-center gap-4 py-4">
                <Input
                    placeholder="Filter by customer name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
                    className="max-w-sm"
                />
            </div>

            {/* Card container with horizontal scroll for the table only */}
            <div className="rounded-md border p-4">
                <div className="w-full overflow-x-auto rounded-md border h-[68vh]">
                    <Table className="table-fixed w-full">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                            className="whitespace-nowrap overflow-hidden relative"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                            {header.column.getCanResize() && (
                                                <div
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none bg-transparent ${header.column.getIsResizing() ? "bg-blue-500 opacity-40" : ""
                                                        }`}
                                                />
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                style={{ width: cell.column.getSize() }}
                                                className="whitespace-nowrap overflow-hidden text-ellipsis"
                                            >
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
                    </Table>
                </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4">
                <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                >
                    Previous
                </Button>
                <span className="text-lg font-medium">Page {page}</span>
                <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}