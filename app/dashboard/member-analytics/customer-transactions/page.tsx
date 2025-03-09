// app/dashboard/customer-transactions/page.tsx
"use client"

import * as React from "react"
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
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { columns } from "./columns"
import { fetchCustomerTransactions } from "../../../actions/customerTransactions"

// Same type definition, but note we rely on "transaction_display" column for display logic
export type CustomerTransaction = {
    id: number
    transaction_type: "signup" | "visit" | "redeem_reward"
    points_changed: number
    net_points: number
    created_at: string
    reward_id: number
    customer_id: number
}

export default function CustomerTransactionsTable() {
    const [data, setData] = React.useState<CustomerTransaction[]>([])
    const [loading, setLoading] = React.useState<boolean>(true)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})
    const [page, setPage] = React.useState<number>(1)
    const pageSize = 20

    // 1) On mount or page change, fetch data
    React.useEffect(() => {
        const fetchData = async () => {
            const response = await fetchCustomerTransactions(page, pageSize)
            if (response.success) {
                setData(response.data)
            }
            setLoading(false)
        }
        fetchData()
    }, [page])

    // 2) Build the table
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
    })

    // 3) Options for the dropdown filter
    const transactionTypeOptions = ["All", "Return", "Visit", "Redeem Reward", "Signup"]

    // 4) Handler to set the filter on "transaction_display"
    const handleDisplayFilterChange = (newVal: string) => {
        table.getColumn("transaction_display")?.setFilterValue(newVal)
    }

    return (
        <div className="w-full max-w-[1200px]">
            {/* Filter Row */}
            <div className="flex items-center gap-4 py-4">
                {/* Example: Keep or remove this Input if you want a text-based filter. 
            But we replaced transaction_type with transaction_display. 
            You can remove it if you'd rather rely solely on the dropdown. */}
                <Input
                    placeholder="Filter by transaction type..."
                    value={(table.getColumn("transaction_display")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("transaction_display")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                {/* 5) The dropdown for discrete filters */}
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

            {/* Scrollable container */}
            <div className="w-full overflow-x-auto rounded-md border h-[600px]">
                <Table className="table-fixed w-full">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    const canResize = header.column.getCanResize()
                                    const isResizing = header.column.getIsResizing()

                                    return (
                                        <TableHead
                                            key={header.id}
                                            style={{ width: header.getSize() }}
                                            className="whitespace-nowrap overflow-hidden relative"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}

                                            {/* Resizer handle */}
                                            {canResize && (
                                                <div
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    className={`absolute right-0 top-0 h-full w-2 cursor-col-resize select-none bg-transparent ${isResizing ? "bg-blue-500 opacity-40" : ""
                                                        }`}
                                                />
                                            )}
                                        </TableHead>
                                    )
                                })}
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
    )
}