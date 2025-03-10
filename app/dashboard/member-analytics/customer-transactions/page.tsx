// app/dashboard/customer-transactions/page.tsx
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
import { createTransactionColumns } from "./columns";
import { fetchCustomerTransactions } from "../../../actions/customerTransactions";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";

// Define the transaction type
export type CustomerTransaction = {
    id: number;
    transaction_type: "signup" | "visit" | "redeem_reward";
    points_changed: number;
    net_points: number;
    created_at: string;
    reward_id: number;
    customer_id: number;
};

export default function CustomerTransactionsTable() {
    const [data, setData] = useState<CustomerTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});
    const [page, setPage] = useState<number>(1);
    const pageSize = 20;

    // Local states for dialogs
    const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);

    // Callbacks to open dialogs
    const onViewCustomer = (customerId: number) => {
        setSelectedCustomerId(customerId);
        setIsCustomerDialogOpen(true);
    };

    const onViewTransaction = (transactionId: number) => {
        setSelectedTransactionId(transactionId);
        setIsTransactionDialogOpen(true);
    };

    // Fetch data on mount or page change
    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchCustomerTransactions(page, pageSize);
            if (response.success) {
                setData(response.data);
            }
            setLoading(false);
        };
        fetchData();
    }, [page]);

    // Build the columns using our callback-based creator
    const transactionColumns = useMemo(
        () =>
            createTransactionColumns({
                onViewCustomer,
                onViewTransaction,
            }),
        [onViewCustomer, onViewTransaction]
    );

    // Build the table instance
    const table = useReactTable({
        data,
        columns: transactionColumns,
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

    // Options for the dropdown filter
    const transactionTypeOptions = ["All", "Return", "Visit", "Redeem Reward", "Signup"];

    // Handler to set the filter on "transaction_type"
    const handleDisplayFilterChange = (newVal: string) => {
        table.getColumn("transaction_type")?.setFilterValue(newVal);
    };

    return (
        <div className="w-full max-w-[1200px]">
            {/* Title & Filter Row */}
            <Card className="flex items-center justify-between gap-4 px-6 py-4 mb-4">
                <h1 className="w-1/2 text-2xl font-semibold">Customer Transactions</h1>
                <div className="w-1/2 flex items-center justify-between">
                    <Input
                        placeholder="Filter by transaction type..."
                        value={
                            (table.getColumn("transaction_type")?.getFilterValue() as string) ?? ""
                        }
                        onChange={(event) =>
                            table.getColumn("transaction_type")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <select
                        onChange={(e) => handleDisplayFilterChange(e.target.value)}
                        className="border px-2 py-1 rounded"
                        defaultValue="All"
                    >
                        {transactionTypeOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </Card>

            {/* Scrollable container for the table */}
            <div className="w-full overflow-x-auto rounded-md border h-[600px]">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canResize = header.column.getCanResize();
                                    const isResizing = header.column.getIsResizing();
                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                            className="whitespace-nowrap overflow-hidden relative"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(header.column.columnDef.header, header.getContext())}
                                            {canResize && (
                                                <div
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none bg-transparent ${isResizing ? "bg-blue-500 opacity-40" : ""
                                                        }`}
                                                />
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={transactionColumns.length} className="h-24 text-center">
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
                                <TableCell colSpan={transactionColumns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
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

            {/* Customer Details Dialog */}
            <Dialog open={isCustomerDialogOpen} onOpenChange={setIsCustomerDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Customer Details</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Customer ID: {selectedCustomerId}</p>
                        {/* TODO: Extend this dialog to fetch and display full customer details */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Transaction Details Dialog */}
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                    </DialogHeader>
                    <div>
                        <p>Transaction ID: {selectedTransactionId}</p>
                        {/* TODO: Extend this dialog to fetch and display full transaction details */}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}