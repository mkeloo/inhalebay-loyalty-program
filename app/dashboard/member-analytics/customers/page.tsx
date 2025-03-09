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
import { columns as baseColumns } from "./columns";
import { fetchCustomers, updateCustomer, deleteCustomer } from "../../../actions/customers";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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
    const [pointsDelta, setPointsDelta] = React.useState<string>("");
    const [rowSelection, setRowSelection] = React.useState({});
    const [page, setPage] = React.useState<number>(1);
    const pageSize = 20;

    // States for editing & deletion
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingCustomer, setEditingCustomer] = React.useState<Customer | null>(null);
    // Use a temporary state for edits (so that unsaved changes can be canceled)
    const [editedCustomer, setEditedCustomer] = React.useState<Partial<Customer>>({});

    // Fetch customers on mount/page change
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

    // Enhance the base columns to override the "actions" column
    const columns = React.useMemo(() => {
        return baseColumns.map((col) => {
            if (col.id === "actions") {
                return {
                    ...col,
                    cell: ({ row }: any) => {
                        const customer = row.original as Customer;
                        return (
                            <div className="flex items-center justify-center space-x-2">
                                <Button variant="secondary" onClick={() => handleEdit(customer)}>
                                    Edit
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(customer.id)}>
                                    Delete
                                </Button>
                            </div>
                        );
                    },
                };
            }
            return col;
        });
    }, []);

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

    // Handler to open the sheet for editing
    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setEditedCustomer({
            // Copy everything you want to display
            id: customer.id,
            store_id: customer.store_id,
            phone_number: customer.phone_number,
            name: customer.name,
            avatar_name: customer.avatar_name,
            current_points: customer.current_points,
            lifetime_points: customer.lifetime_points,
            total_visits: customer.total_visits,
            last_visit: customer.last_visit,
            joined_date: customer.joined_date,
            membership_level: customer.membership_level,
            is_active: customer.is_active,
            created_at: customer.created_at,
            updated_at: customer.updated_at,
        });
        setIsSheetOpen(true);
    };

    // Save changes from the sheet
    const handleSave = async () => {
        if (editingCustomer) {
            const response = await updateCustomer(editingCustomer.id, editedCustomer);
            if (response.success && response.data) {
                setData((prev) =>
                    prev.map((cust) =>
                        cust.id === editingCustomer.id ? { ...cust, ...response.data } : cust
                    )
                );
            } else {
                console.error("Failed to update customer");
            }
        }
        setIsSheetOpen(false);
        setEditingCustomer(null);
        setEditedCustomer({});
    };

    // Handler for delete action
    const handleDelete = (customerId: string) => {
        setEditingCustomer(null);
        setIsDialogOpen(true);
        setDeleteCustomerId(customerId);
    };

    // State for deletion
    const [deleteCustomerId, setDeleteCustomerId] = React.useState<string | null>(null);

    // Confirm deletion
    const confirmDelete = async () => {
        if (deleteCustomerId) {
            const response = await deleteCustomer(deleteCustomerId);
            if (response.success) {
                setData((prev) => prev.filter((cust) => cust.id !== deleteCustomerId));
            } else {
                console.error("Failed to delete customer");
            }
        }
        setIsDialogOpen(false);
        setDeleteCustomerId(null);
    };

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

            {/* Sheet for Editing Customer */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[320px] sm:w-[400px] overflow-y-scroll">
                    <SheetHeader>
                        <SheetTitle>Edit Customer</SheetTitle>
                    </SheetHeader>

                    <div className="mt-4 space-y-3">
                        {/* Name (Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Enter name"
                                value={editedCustomer.name || ""}
                                onChange={(e) =>
                                    setEditedCustomer((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />
                        </div>

                        {/* Phone Number (Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                placeholder="Enter phone number"
                                value={editedCustomer.phone_number || ""}
                                onChange={(e) =>
                                    setEditedCustomer((prev) => ({
                                        ...prev,
                                        phone_number: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Avatar Name (Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="avatar">Avatar Name</Label>
                            <Input
                                id="avatar"
                                placeholder="e.g. panda.png"
                                value={editedCustomer.avatar_name || ""}
                                onChange={(e) =>
                                    setEditedCustomer((prev) => ({
                                        ...prev,
                                        avatar_name: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        <div className="w-full flex items-center justify-between gap-4">
                            {/* Current Points (Read-Only) */}
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="currentPoints">Current Points</Label>
                                <Input
                                    id="currentPoints"
                                    type="number"
                                    value={editedCustomer.current_points?.toString() || ""}
                                    disabled
                                    className="cursor-not-allowed"
                                />
                            </div>

                            {/* Add/Remove Points (Editable) */}
                            <div className="flex flex-col space-y-1">
                                <Label htmlFor="pointsDelta">Add/Remove Points</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="pointsDelta"
                                        type="number"
                                        placeholder="e.g. 5 or -5"
                                        value={pointsDelta}
                                        onChange={(e) => setPointsDelta(e.target.value)}
                                        className="max-w-[100px]"
                                    />
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            const delta = parseInt(pointsDelta || "0", 10);
                                            if (!isNaN(delta)) {
                                                // Increase or decrease current_points
                                                const oldCurrent = editedCustomer.current_points ?? 0;
                                                const newCurrent = oldCurrent + delta;

                                                // Also adjust lifetime_points by the same delta
                                                const oldLifetime = editedCustomer.lifetime_points ?? 0;
                                                const newLifetime = oldLifetime + delta;

                                                setEditedCustomer((prev) => ({
                                                    ...prev,
                                                    current_points: newCurrent,
                                                    lifetime_points: newLifetime,
                                                }));
                                            }
                                            setPointsDelta(""); // Clear after applying
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </div>


                        {/* Lifetime Points (Read-Only) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="lifetimePoints">Lifetime Points</Label>
                            <Input
                                id="lifetimePoints"
                                type="number"
                                value={editedCustomer.lifetime_points?.toString() || ""}
                                disabled
                                className="cursor-not-allowed"
                            />
                        </div>

                        {/* Membership Level (Dropdown) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="membership">Membership Level</Label>
                            <select
                                id="membership"
                                value={editedCustomer.membership_level || ""}
                                onChange={(e) =>
                                    setEditedCustomer((prev) => ({
                                        ...prev,
                                        membership_level: e.target.value,
                                    }))
                                }
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select Membership Level</option>
                                <option value="new">New</option>
                                <option value="regular">Regular</option>
                                <option value="vip">VIP</option>
                                <option value="vvip">VVIP</option>
                            </select>
                        </div>

                        {/* Is Active (Editable, as a checkbox) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="isActive">Is Active</Label>
                            <div className="flex items-center gap-2">
                                <input
                                    id="isActive"
                                    type="checkbox"
                                    checked={!!editedCustomer.is_active}
                                    onChange={(e) =>
                                        setEditedCustomer((prev) => ({
                                            ...prev,
                                            is_active: e.target.checked,
                                        }))
                                    }
                                    className="h-5 w-5 accent-blue-600 cursor-pointer"
                                />
                                <span>{editedCustomer.is_active ? "Active" : "Inactive"}</span>
                            </div>
                        </div>

                        {/* Total Visits (Non-Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="totalVisits">Total Visits</Label>
                            <Input
                                id="totalVisits"
                                disabled
                                value={
                                    typeof editedCustomer.total_visits === "number"
                                        ? editedCustomer.total_visits.toString()
                                        : "N/A"
                                }
                            />
                        </div>

                        {/* Last Visit (Non-Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="lastVisit">Last Visit</Label>
                            <Input
                                id="lastVisit"
                                disabled
                                value={
                                    editedCustomer.last_visit &&
                                        !isNaN(new Date(editedCustomer.last_visit).getTime())
                                        ? new Date(editedCustomer.last_visit).toLocaleString()
                                        : "N/A"
                                }
                            />
                        </div>

                        {/* Joined Date (Non-Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="joinedDate">Joined Date</Label>
                            <Input
                                id="joinedDate"
                                disabled
                                value={
                                    editedCustomer.joined_date
                                        ? new Date(editedCustomer.joined_date).toLocaleDateString()
                                        : "N/A"
                                }
                            />
                        </div>

                        {/* Store ID (Non-Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="storeId">Store ID</Label>
                            <Input
                                id="storeId"
                                disabled
                                value={editedCustomer.store_id || "N/A"}
                            />
                        </div>

                        {/* Customer ID (Non-Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="customerId">Customer ID</Label>
                            <Input
                                id="customerId"
                                disabled
                                value={editedCustomer.id || "N/A"}
                            />
                        </div>

                        {/* Created At (Non-Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="createdAt">Created At</Label>
                            <Input
                                id="createdAt"
                                disabled
                                value={
                                    editedCustomer.created_at &&
                                        !isNaN(new Date(editedCustomer.created_at).getTime())
                                        ? new Date(editedCustomer.created_at).toLocaleString()
                                        : "N/A"
                                }
                            />
                        </div>

                        {/* Updated At (Non-Editable) */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="updatedAt">Updated At</Label>
                            <Input
                                id="updatedAt"
                                disabled
                                value={
                                    editedCustomer.updated_at &&
                                        !isNaN(new Date(editedCustomer.updated_at).getTime())
                                        ? new Date(editedCustomer.updated_at).toLocaleString()
                                        : "N/A"
                                }
                            />
                        </div>
                    </div>

                    <SheetFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave}>Save Changes</Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Dialog for Deletion Confirmation */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">Are you sure you want to delete this customer?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}