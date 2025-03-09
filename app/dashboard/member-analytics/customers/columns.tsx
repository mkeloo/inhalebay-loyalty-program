"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Customers } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const columns: ColumnDef<Customers>[] = [
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

    {
        accessorKey: "phone_number",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Phone Number
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("phone_number")}</div>,
        size: 150,
        minSize: 180,
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Name
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("name")}</div>,
        size: 200,
        minSize: 200,
    },
    {
        accessorKey: "avatar_name",
        header: () => <div className="text-center">Avatar</div>,
        cell: ({ row }) => <div className="text-center">{row.getValue("avatar_name") || "N/A"}</div>,
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "current_points",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Current Points
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("current_points")}</div>,
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "lifetime_points",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Lifetime Points
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("lifetime_points")}</div>,
        size: 200,
        minSize: 200,
    },
    {
        accessorKey: "total_visits",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Total Visits
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("total_visits")}</div>,
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "last_visit",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Last Visit
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const date = row.getValue("last_visit")
                ? new Date(row.getValue("last_visit")).toLocaleDateString()
                : "N/A";
            return <div className="text-center">{date}</div>;
        },
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "joined_date",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Joined Date
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const date = row.getValue("joined_date")
                ? new Date(row.getValue("joined_date")).toLocaleDateString()
                : "N/A";
            return <div className="text-center">{date}</div>;
        },
        size: 150,
        minSize: 150,
    },
    {
        accessorKey: "membership_level",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Membership Level
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("membership_level")}</div>,
        size: 150,
        minSize: 180,
    },
    {
        accessorKey: "is_active",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Active
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const active = row.getValue("is_active");
            return <div className="text-center">{active ? "Yes" : "No"}</div>;
        },
        size: 100,
        minSize: 120,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Created At
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("created_at")).toLocaleString();
            return <div className="text-center">{date}</div>;
        },
        size: 150,
        minSize: 180,
    },
    {
        accessorKey: "updated_at",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    Updated At
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const date = new Date(row.getValue("updated_at")).toLocaleString();
            return <div className="text-center">{date}</div>;
        },
        size: 150,
        minSize: 180,
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <div className="text-center">
                <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                    ID
                    <ArrowUpDown className="ml-2" />
                </Button>
            </div>
        ),
        cell: ({ row }) => <div className="text-center">{row.getValue("id")}</div>,
        size: 200,
        minSize: 200,
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        // cell: ({ row }) => {
        //     const customer = row.original;
        //     return (
        //         <div className="w-full flex items-center justify-center">
        //             <DropdownMenu>
        //                 <DropdownMenuTrigger asChild>
        //                     <Button variant="ghost" className="h-8 w-8 p-0">
        //                         <span className="sr-only">Open menu</span>
        //                         <MoreHorizontal />
        //                     </Button>
        //                 </DropdownMenuTrigger>
        //                 <DropdownMenuContent align="end">
        //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
        //                     <DropdownMenuItem onClick={() => navigator.clipboard.writeText(customer.id ?? "")}>
        //                         Copy Customer ID
        //                     </DropdownMenuItem>
        //                     <DropdownMenuSeparator />
        //                     <DropdownMenuItem>Edit Customer</DropdownMenuItem>
        //                     <DropdownMenuItem>Delete Customer</DropdownMenuItem>
        //                 </DropdownMenuContent>
        //             </DropdownMenu>
        //         </div>
        //     );
        // },
        size: 80,
        minSize: 180,
    },
];