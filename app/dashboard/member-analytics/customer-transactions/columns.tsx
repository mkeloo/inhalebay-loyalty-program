// app/dashboard/customer-transactions/columns.ts

import { ColumnDef, FilterFn } from "@tanstack/react-table"
import { CustomerTransaction } from "./page"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

// 1) A custom filter function for "transaction_display"
const transactionDisplayFilter: FilterFn<CustomerTransaction> = (
    row,
    columnId,
    filterValue
) => {
    // If user selected "All", we pass everything
    if (filterValue === "All") return true

    // The cell's string value, e.g. "Visit", "Return", "Signup", etc.
    const displayVal = row.getValue<string>(columnId)

    return displayVal === filterValue
}

export const columns: ColumnDef<CustomerTransaction>[] = [
    // SELECT (checkbox) column
    {
        id: "select",
        header: ({ table }) => (
            <div className="text-center">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
        size: 50,
        minSize: 50,
        maxSize: 60,
    },

    // ID column
    {
        accessorKey: "id",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
        size: 80,
        minSize: 80,
        maxSize: 120,
    },

    // 2) Our "transaction_display" column: if points=0 => "Return"
    {
        // No accessorKey; we use accessorFn to produce "Return"/"Visit"/"Redeem Reward"/"Signup"
        id: "transaction_display",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Transaction Type
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        // Logic to determine the "display" label
        accessorFn: (row) => {
            const { transaction_type, points_changed } = row
            if (transaction_type === "visit" && points_changed === 0) {
                return "Return"
            }
            if (transaction_type === "visit") {
                return "Visit"
            }
            if (transaction_type === "redeem_reward") {
                return "Redeem Reward"
            }
            if (transaction_type === "signup") {
                return "Signup"
            }
            return "Unknown"
        },
        // Render the cell
        cell: ({ getValue }) => {
            const displayVal = getValue<string>()
            return <div className="capitalize text-center">{displayVal}</div>
        },
        sortingFn: "alphanumeric",
        // Use our custom filter for discrete "Return", "Visit", etc.
        filterFn: transactionDisplayFilter,
        size: 180,
        minSize: 180,
    },

    // Points Changed
    {
        accessorKey: "points_changed",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Points Changed
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center font-medium">{row.getValue("points_changed")}</div>
        ),
        size: 120,
        minSize: 180,
    },

    // Net Points
    {
        accessorKey: "net_points",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Net Points
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center font-medium">{row.getValue("net_points")}</div>
        ),
        size: 110,
        minSize: 150,
    },

    // Reward ID
    {
        accessorKey: "reward_id",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Reward ID
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("reward_id") ?? "N/A"}</div>
        ),
        size: 110,
        minSize: 150,
    },

    // Created At
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created At
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at")).toLocaleString()
            return <div className="text-center">{date}</div>
        },
        size: 170,
        minSize: 180,
    },

    // Customer ID
    {
        accessorKey: "customer_id",
        header: ({ column }) => (
            <div className="text-center">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Customer ID
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <div className="text-center">{row.getValue("customer_id")}</div>
        ),
        size: 300,
        minSize: 250,
    },

    // Actions column
    {
        id: "actions",
        enableHiding: false,
        header: () => <div className="text-center">Actions</div>,
        cell: ({ row }) => {
            const transaction = row.original
            return (
                <div className="flex items-center justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigator.clipboard.writeText(transaction.id.toString())
                                }
                            >
                                Copy Transaction ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Customer</DropdownMenuItem>
                            <DropdownMenuItem>View Transaction Details</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
        size: 80,
        minSize: 70,
    },
]