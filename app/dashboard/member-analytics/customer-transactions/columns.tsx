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

//
// 1) Update the interface so `onViewCustomer` expects a string customerId,
//    and `onViewTransaction` expects (transactionId: number, customerId: string).
//
interface CreateTransactionColumnsProps {
    onViewCustomer: (customerId: string) => Promise<void> | void;
    onViewTransaction: (transactionId: number, customerId: string) => Promise<void> | void;
}

/**
 * Create an array of columns. We accept two callbacks:
 * onViewCustomer & onViewTransaction. Then we define columns
 * so the "Actions" column can call these callbacks.
 */
export function createTransactionColumns({
    onViewCustomer,
    onViewTransaction,
}: CreateTransactionColumnsProps): ColumnDef<CustomerTransaction>[] {
    return [
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
            cell: ({ row }) => {
                const { transaction_type, points_changed } = row.original
                if (transaction_type === "visit" && points_changed === 0) return <div className="text-center">Return</div>
                if (transaction_type === "visit") return <div className="text-center">Visit</div>
                if (transaction_type === "redeem_reward") return <div className="text-center">Redeem Reward</div>
                if (transaction_type === "signup") return <div className="text-center">Signup</div>
                return <div className="text-center">Unknown</div>
            },
            size: 180,
            minSize: 180,
        },
        // Points Changed column
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
        // Net Points column
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
            size: 120,
            minSize: 150,
        },
        // Reward ID column
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
            size: 140,
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
                const rawVal = row.getValue<string>("created_at")
                const dateStr = rawVal ? new Date(rawVal).toLocaleString() : "N/A"
                return <div className="text-center">{dateStr}</div>
            },
            size: 160,
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
                                <DropdownMenuSeparator />
                                {/* 
                                    2) Pass 'customer_id' (string) to onViewCustomer 
                                        and pass both transaction.id + transaction.customer_id to onViewTransaction 
                                */}
                                <DropdownMenuItem
                                    onClick={() => onViewCustomer(transaction.customer_id)}
                                >
                                    View Customer
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onViewTransaction(transaction.id, transaction.customer_id)}
                                >
                                    View Transaction Details
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            },
            size: 100,
        },
    ]
}