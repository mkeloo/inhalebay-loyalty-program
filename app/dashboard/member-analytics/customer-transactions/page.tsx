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

// 1) Import the new function for “other transactions”
import {
    fetchCustomerTransactions,
    fetchCustomerTransactionsByCustomerId,
} from "../../../actions/customerTransactions";

// 2) Also import the function to fetch a single customer by ID
import { fetchCustomerById } from "../../../actions/customers"; // <-- Adjust path if needed

import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useState, useEffect, useMemo } from "react";

// If your "Customers" type is in "@/lib/types" or similar, import it:
import { Customers } from "@/lib/types";

/** 
 * Adjust the shape of `customer_id` to be a string if it's a UUID in the DB. 
 * Otherwise, you won't fetch matching data. 
 */
export type CustomerTransaction = {
    id: number;
    transaction_type: "signup" | "visit" | "redeem_reward";
    points_changed: number;
    net_points: number;
    created_at: string;
    reward_id: number | null;
    customer_id: string;  // <-- must be string if it's a UUID in your table
};

export default function CustomerTransactionsTable() {
    const [data, setData] = useState<CustomerTransaction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Table states
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = useState({});

    // Pagination
    const [page, setPage] = useState<number>(1);
    const pageSize = 20;

    // Dialog states
    const [isCustomerDialogOpen, setIsCustomerDialogOpen] = useState(false);
    const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

    // For “View Customer” details
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>(""); // string, not number
    const [customerDetails, setCustomerDetails] = useState<Customers | null>(null);

    // For “View Transaction” details
    const [selectedTransactionId, setSelectedTransactionId] = useState<number | null>(null);

    // For listing other transactions for the same customer
    const [otherTransactions, setOtherTransactions] = useState<CustomerTransaction[]>([]);

    // 1) Callback to open “View Customer” dialog
    const onViewCustomer = async (customerId: string) => {
        setSelectedCustomerId(customerId);

        // Attempt to fetch the single customer by ID (must be a string if your DB is UUID)
        const response = await fetchCustomerById(customerId);
        if (response.success && response.data) {
            setCustomerDetails(response.data);
        } else {
            setCustomerDetails(null);
        }
        setIsCustomerDialogOpen(true);
    };

    // 2) Callback to open “View Transaction” dialog
    const onViewTransaction = (transactionId: number, custId: string) => {
        setSelectedTransactionId(transactionId);
        setSelectedCustomerId(custId);
        setIsTransactionDialogOpen(true);
    };

    // Fetch main table data
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

    // When we open the Transaction dialog, also fetch other transactions
    useEffect(() => {
        const fetchOtherTx = async () => {
            if (isTransactionDialogOpen && selectedCustomerId && selectedTransactionId !== null) {
                const res = await fetchCustomerTransactionsByCustomerId(
                    selectedCustomerId,        // string
                    selectedTransactionId,     // number
                    20
                );
                if (res.success) {
                    setOtherTransactions(res.data);
                } else {
                    setOtherTransactions([]);
                }
            }
        };
        fetchOtherTx();
    }, [isTransactionDialogOpen, selectedCustomerId, selectedTransactionId]);

    // Build the columns
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

    // Filter options
    const transactionTypeOptions = ["All", "Return", "Visit", "Redeem Reward", "Signup"];

    // Filter setter
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
                        value={(table.getColumn("transaction_type")?.getFilterValue() as string) ?? ""}
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
                    <div className="space-y-2">
                        {customerDetails ? (
                            <>
                                <p><strong>ID:</strong> {customerDetails.id}</p>
                                <p><strong>Store ID:</strong> {customerDetails.store_id}</p>
                                <p><strong>Phone Number:</strong> {customerDetails.phone_number}</p>
                                <p><strong>Name:</strong> {customerDetails.name}</p>
                                <p><strong>Avatar:</strong> {customerDetails.avatar_name || "N/A"}</p>
                                <p><strong>Current Points:</strong> {customerDetails.current_points}</p>
                                <p><strong>Lifetime Points:</strong> {customerDetails.lifetime_points}</p>
                                <p><strong>Total Visits:</strong> {customerDetails.total_visits}</p>
                                <p>
                                    <strong>Last Visit:</strong>{" "}
                                    {customerDetails.last_visit
                                        ? new Date(customerDetails.last_visit).toLocaleString()
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Joined Date:</strong>{" "}
                                    {customerDetails.joined_date
                                        ? new Date(customerDetails.joined_date).toLocaleDateString()
                                        : "N/A"}
                                </p>
                                <p><strong>Membership Level:</strong> {customerDetails.membership_level}</p>
                                <p><strong>Active:</strong> {customerDetails.is_active ? "Yes" : "No"}</p>
                                <p>
                                    <strong>Created At:</strong>{" "}
                                    {customerDetails.created_at
                                        ? new Date(customerDetails.created_at).toLocaleString()
                                        : "N/A"}
                                </p>
                                <p>
                                    <strong>Updated At:</strong>{" "}
                                    {customerDetails.updated_at
                                        ? new Date(customerDetails.updated_at).toLocaleString()
                                        : "N/A"}
                                </p>
                            </>
                        ) : (
                            <p>Loading customer details...</p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCustomerDialogOpen(false)}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Transaction Details Dialog */}
            {/* Transaction Details Dialog */}
            <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
                <DialogContent className="h-[65vh] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {/* Display selected transaction details */}
                        {selectedTransactionId !== null && (() => {
                            const mainTransaction = data.find(tx => tx.id === selectedTransactionId);
                            return mainTransaction ? (
                                <div className="space-y-2">
                                    <p><strong>Transaction ID:</strong> {mainTransaction.id}</p>
                                    <p><strong>Type:</strong> {mainTransaction.transaction_type}</p>
                                    <p><strong>Points Changed:</strong> {mainTransaction.points_changed}</p>
                                    <p><strong>Net Points:</strong> {mainTransaction.net_points}</p>
                                    <p><strong>Created At:</strong> {new Date(mainTransaction.created_at).toLocaleString()}</p>
                                    <p><strong>Reward ID:</strong> {mainTransaction.reward_id ?? "N/A"}</p>
                                </div>
                            ) : (
                                <p>No transaction details available.</p>
                            );
                        })()}

                        {/* Separator */}
                        <hr className="border-t border-gray-300" />

                        {/* Section to display other transactions for this customer */}
                        <div>
                            <h2 className="text-lg font-semibold">Other Transactions for this Customer</h2>
                            {otherTransactions.length > 0 ? (
                                otherTransactions.map(tx => (
                                    <div key={tx.id} className="mt-2 border-b border-gray-200 pb-2">
                                        <p><strong>ID:</strong> {tx.id}</p>
                                        <p><strong>Type:</strong> {tx.transaction_type}</p>
                                        <p><strong>Points Changed:</strong> {tx.points_changed}</p>
                                        <p><strong>Net Points:</strong> {tx.net_points}</p>
                                        <p><strong>Created At:</strong> {new Date(tx.created_at).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p>No other transactions for this customer.</p>
                            )}
                        </div>
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