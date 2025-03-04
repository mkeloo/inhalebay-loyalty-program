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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MoreVerticalIcon, Pencil, Trash2 } from "lucide-react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
    fetchMemberTiers,
    createMemberTier,
    updateMemberTier,
    deleteMemberTier,
} from "../../actions/memberTiers";
import { fetchStoreId } from "../../actions/storeDetails";
import { MemberTier, STORE_CODE } from "@/lib/types";

export default function MemberTiersManagement() {
    const [tiers, setTiers] = useState<MemberTier[]>([]);

    // Loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // UI states
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Data
    const [currentTier, setCurrentTier] = useState<MemberTier | null>(null);
    const [deleteTierId, setDeleteTierId] = useState<number | null>(null);

    // ───────────────────────────────────────────────────────
    // ✅ Load Tiers on Component Mount
    // ───────────────────────────────────────────────────────
    useEffect(() => {
        async function loadTiers() {
            setIsLoading(true);
            const result = await fetchMemberTiers();
            if (result.success) {
                setTiers(result.data ?? []);
            } else {
                console.error(result.message);
                setTiers([]);
            }
            setIsLoading(false);
        }
        loadTiers();
    }, []);

    // ───────────────────────────────────────────────────────
    // ✅ Add / Edit Member Tier
    // ───────────────────────────────────────────────────────
    const handleAddTier = () => {
        setCurrentTier({
            id: 0,
            member_tier_name: "",
            description: "",
            value_type: "days",
            value: 0,
        });
        setIsSheetOpen(true);
    };

    const handleEdit = (tier: MemberTier) => {
        setCurrentTier(tier);
        setIsSheetOpen(true);
    };

    const handleSaveTier = async () => {
        if (!currentTier) return;

        setIsSaving(true);

        if (currentTier.id) {
            // **Edit Mode**
            const updateResult = await updateMemberTier(
                currentTier.id,
                currentTier.member_tier_name,
                currentTier.description,
                currentTier.value_type,
                currentTier.value
            );
            if (!updateResult.success) {
                console.error(updateResult.message);
            }
        } else {
            // **Add Mode**
            const storeResult = await fetchStoreId(STORE_CODE);
            if (storeResult.success && storeResult.data) {
                const createResult = await createMemberTier(
                    storeResult.data,
                    currentTier.member_tier_name,
                    currentTier.description,
                    currentTier.value_type,
                    currentTier.value
                );
                if (!createResult.success) {
                    console.error(createResult.message);
                }
            } else {
                console.error("Error fetching store id.");
            }
        }

        // Refresh data
        const result = await fetchMemberTiers();
        if (result.success) {
            setTiers(result.data ?? []);
        }

        setIsSaving(false);
        setIsSheetOpen(false);
    };

    // ───────────────────────────────────────────────────────
    // ✅ Delete Member Tier
    // ───────────────────────────────────────────────────────
    const handleDelete = (tierId: number) => {
        setDeleteTierId(tierId);
        setIsDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (deleteTierId !== null) {
            setIsDeleting(true);

            const deleteResult = await deleteMemberTier(deleteTierId);
            if (!deleteResult.success) {
                console.error(deleteResult.message);
            }

            // Refresh data
            const result = await fetchMemberTiers();
            if (result.success) {
                setTiers(result.data ?? []);
            }

            setIsDeleting(false);
        }
        setIsDialogOpen(false);
        setDeleteTierId(null);
    };
    return (
        <div className="space-y-4 p-4">
            {/* Title + Add Tier button */}
            <div className="flex items-center justify-center pb-4">
                <h1 className="text-4xl font-semibold">Member Tiers Management</h1>
            </div>

            {/* Loading indicator */}
            {isLoading && <p className="text-sm text-gray-500">Loading tiers...</p>}

            {/* Table */}
            <Card className="w-full px-6 py-6 border border-gray-700 rounded-2xl ">
                <CardHeader className="flex flex-row items-center justify-between mb-4  py-4 border border-gray-700 rounded-2xl">
                    <h1 className="text-2xl font-semibold">Current Member Tiers</h1>
                    <Button onClick={handleAddTier}>Add Tier</Button>
                </CardHeader>
                <Table className="">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Condition Type</TableHead>
                            <TableHead>Condition Value</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tiers.map((tier) => (
                            <TableRow key={tier.id}>
                                <TableCell>{tier.member_tier_name}</TableCell>
                                <TableCell className="max-w-xs">
                                    <p className="line-clamp-2">{tier.description}</p>
                                </TableCell>
                                <TableCell>{tier.value_type}</TableCell>
                                <TableCell>{tier.value}</TableCell>
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
                                                onClick={() => handleEdit(tier)}
                                            >
                                                Edit <Pencil className="w-4 h-4" />
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="bg-red-700 text-red-100 m-1 flex items-center justify-between"
                                                onClick={() => handleDelete(tier.id)}
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

            {/* Sheet for Add/Edit Tier */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>
                            {currentTier?.id ? "Edit Tier" : "Add Tier"}
                        </SheetTitle>
                        <VisuallyHidden.Root>
                            <SheetDescription>
                                Description goes here
                            </SheetDescription>
                        </VisuallyHidden.Root>
                    </SheetHeader>
                    <div className="mt-4 space-y-3">
                        <Label>Name</Label>
                        <Input
                            value={currentTier?.member_tier_name || ""}
                            onChange={(e) =>
                                setCurrentTier((prev) =>
                                    prev ? { ...prev, member_tier_name: e.target.value } : prev
                                )
                            }
                        />
                        <Label>Description</Label>
                        <Input
                            value={currentTier?.description || ""}
                            onChange={(e) =>
                                setCurrentTier((prev) =>
                                    prev ? { ...prev, description: e.target.value } : prev
                                )
                            }
                        />
                        <Label>Condition Type</Label>
                        <Select
                            value={currentTier?.value_type || "days"}
                            onValueChange={(value) =>
                                setCurrentTier((prev) =>
                                    prev
                                        ? { ...prev, value_type: value as "days" | "points" }
                                        : prev
                                )
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="days">Days</SelectItem>
                                <SelectItem value="points">Points</SelectItem>
                            </SelectContent>
                        </Select>
                        <Label>Condition Value</Label>
                        <Input
                            type="number"
                            value={currentTier?.value || 0}
                            onChange={(e) =>
                                setCurrentTier((prev) =>
                                    prev ? { ...prev, value: Number(e.target.value) } : prev
                                )
                            }
                        />
                    </div>
                    <SheetFooter>
                        <Button onClick={handleSaveTier} disabled={isSaving}>
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
                        Are you sure you want to delete this tier?
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