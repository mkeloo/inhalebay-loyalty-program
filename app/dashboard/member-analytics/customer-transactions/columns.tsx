// app/dashboard/customer-transactions/columns.ts
import { ColumnDef } from "@tanstack/react-table"
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

export const columns: ColumnDef<CustomerTransaction>[] = [
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
        size: 50,           // Keep the checkbox column narrow
        minSize: 50,
        maxSize: 60,
    },
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
    {
        accessorKey: "transaction_type",
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
        cell: ({ row }) => <div className="capitalize text-center">{row.getValue("transaction_type")}</div>,
        size: 140,
        minSize: 180,
    },
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
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const transaction = row.original

            return (
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
            )
        },
        size: 80,
        minSize: 70,
    },
]