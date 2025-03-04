"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
    SheetDescription,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreVerticalIcon, Pencil, Trash2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
    fetchScreenCodes,
    createScreenCode,
    updateScreenCode,
    deleteScreenCode,
} from "../../../actions/screenCodes";
import { fetchStoreId } from "../../../actions/storeDetails";
import { ScreenCode, STORE_CODE } from "@/lib/types";

export default function ClientDevicePage() {
    const [screenCodes, setScreenCodes] = useState<ScreenCode[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [currentScreenCode, setCurrentScreenCode] = useState<ScreenCode | null>(null);
    const [deleteScreenCodeId, setDeleteScreenCodeId] = useState<number | null>(null);

    // Load screen codes on mount
    useEffect(() => {
        async function loadScreenCodes() {
            setIsLoading(true);
            const result = await fetchScreenCodes();
            if (result.success) {
                setScreenCodes(result.data ?? []);
            } else {
                console.error(result.message);
                setScreenCodes([]);
            }
            setIsLoading(false);
        }
        loadScreenCodes();
    }, []);

    // Handler to add a new screen code
    const handleAddScreenCode = () => {
        setCurrentScreenCode({
            id: 0,
            store_id: "",
            screen_name: "",
            screen_code: 0,
            created_at: "",
            updated_at: "",
        });
        setIsSheetOpen(true);
    };

    // Handler to edit an existing screen code
    const handleEdit = (code: ScreenCode) => {
        setCurrentScreenCode(code);
        setIsSheetOpen(true);
    };

    // Save (create or update) a screen code
    const handleSaveScreenCode = async () => {
        if (!currentScreenCode) return;
        setIsSaving(true);

        if (currentScreenCode.id) {
            // Edit mode
            const updateResult = await updateScreenCode(
                currentScreenCode.id,
                currentScreenCode.screen_name,
                currentScreenCode.screen_code
            );
            if (!updateResult.success) {
                console.error(updateResult.message);
            }
        } else {
            // Add mode – fetch the store id using STORE_CODE first
            const storeResult = await fetchStoreId(STORE_CODE);
            if (storeResult.success && storeResult.data) {
                const createResult = await createScreenCode(
                    storeResult.data,
                    currentScreenCode.screen_name,
                    currentScreenCode.screen_code
                );
                if (!createResult.success) {
                    console.error(createResult.message);
                }
            } else {
                console.error("Error fetching store id.");
            }
        }

        // Refresh data
        const result = await fetchScreenCodes();
        if (result.success) {
            setScreenCodes(result.data ?? []);
        }
        setIsSaving(false);
        setIsSheetOpen(false);
    };

    // Delete a screen code – set the id for deletion confirmation
    const handleDelete = (codeId: number) => {
        setDeleteScreenCodeId(codeId);
        setIsDialogOpen(true);
    };

    // Confirm deletion
    const confirmDelete = async () => {
        if (deleteScreenCodeId !== null) {
            setIsDeleting(true);
            const deleteResult = await deleteScreenCode(deleteScreenCodeId);
            if (!deleteResult.success) {
                console.error(deleteResult.message);
            }
            // Refresh data
            const result = await fetchScreenCodes();
            if (result.success) {
                setScreenCodes(result.data ?? []);
            }
            setIsDeleting(false);
        }
        setIsDialogOpen(false);
        setDeleteScreenCodeId(null);
    };

    return (
        <div className="space-y-4 p-4">
            {/* Page Title and Add Button */}
            <div className="flex items-center justify-center pb-4">
                <h1 className="text-4xl font-semibold">Client Device</h1>
            </div>

            {/* Loading Indicator */}
            {isLoading && <p className="text-sm text-gray-500">Loading screen codes...</p>}

            {/* Table of Screen Codes */}
            <Card className="w-full px-6 py-6 border border-gray-700 rounded-2xl">
                <CardHeader className="flex flex-row items-center justify-between mb-4 py-4 border border-gray-700 rounded-2xl">
                    <h1 className="text-2xl font-semibold">Current Screen Codes</h1>
                    <Button onClick={handleAddScreenCode}>Add Screen Code</Button>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Screen Name</TableHead>
                            <TableHead>Screen Code</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {screenCodes.map((code) => (
                            <TableRow key={code.id}>
                                <TableCell>{code.screen_name}</TableCell>
                                <TableCell>{code.screen_code}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <MoreVerticalIcon className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="flex flex-col">
                                            <DropdownMenuItem
                                                className="bg-yellow-700 text-yellow-100 m-1 flex items-center justify-between"
                                                onClick={() => handleEdit(code)}
                                            >
                                                Edit <Pencil className="w-4 h-4" />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="bg-red-700 text-red-100 m-1 flex items-center justify-between"
                                                onClick={() => handleDelete(code.id)}
                                            >
                                                Delete <Trash2 className="w-4 h-4" />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            {/* Sheet for Add/Edit Screen Code */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            {currentScreenCode?.id ? "Edit Screen Code" : "Add Screen Code"}
                        </SheetTitle>
                        <VisuallyHidden.Root>
                            <SheetDescription>Enter screen code details</SheetDescription>
                        </VisuallyHidden.Root>
                    </SheetHeader>
                    <div className="mt-4 space-y-3">
                        <Label>Screen Name</Label>
                        <Input
                            value={currentScreenCode?.screen_name || ""}
                            onChange={(e) =>
                                setCurrentScreenCode((prev) =>
                                    prev ? { ...prev, screen_name: e.target.value } : prev
                                )
                            }
                        />
                        <Label>Screen Code</Label>
                        <Input
                            type="number"
                            value={currentScreenCode?.screen_code || 0}
                            onChange={(e) =>
                                setCurrentScreenCode((prev) =>
                                    prev ? { ...prev, screen_code: Number(e.target.value) } : prev
                                )
                            }
                        />
                    </div>
                    <SheetFooter>
                        <Button onClick={handleSaveScreenCode} disabled={isSaving}>
                            {isSaving ? "Saving..." : "Save"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Dialog for Delete Confirmation */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Delete</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        Are you sure you want to delete this screen code?
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                            {isDeleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}