"use client";

import * as React from "react";
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
// Icons (adjust to whatever icons you’re using)
import { MoreVerticalIcon, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type MemberTier = {
    id: number;
    name: string;
    description: string;
    conditionType: "days" | "points";
    conditionValue: number;
};

// Dummy data
const memberTiers: MemberTier[] = [
    {
        id: 1,
        name: "New",
        description: "Members who visited for the first time in the past 30 days.",
        conditionType: "days",
        conditionValue: 30,
    },
    {
        id: 2,
        name: "Regular",
        description:
            "Members who have visited in the past 30 days. Regulars become Inactive if they haven't visited your business within this period.",
        conditionType: "days",
        conditionValue: 30,
    },
    {
        id: 3,
        name: "VIP",
        description: "Regulars with at least 10 lifetime points.",
        conditionType: "points",
        conditionValue: 100,
    },
    {
        id: 4,
        name: "Elite",
        description: "Members with at least 300 lifetime points.",
        conditionType: "points",
        conditionValue: 300,
    },
];

export default function MemberTiersManagement() {
    const [tiers, setTiers] = React.useState<MemberTier[]>(memberTiers);

    // Sheet state
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    // Tracking which tier is being edited or deleted
    const [currentTier, setCurrentTier] = React.useState<MemberTier | null>(null);
    const [deleteTierId, setDeleteTierId] = React.useState<number | null>(null);

    // Temp form state for adding/editing
    const [tempTier, setTempTier] = React.useState<{
        name: string;
        description: string;
        conditionType: "days" | "points";
        conditionValue: number;
    }>({
        name: "",
        description: "",
        conditionType: "days",
        conditionValue: 0,
    });

    // -----------------------
    // ADD / EDIT Handlers
    // -----------------------
    // Open the Sheet to add a new tier
    const handleAddTier = () => {
        setCurrentTier(null);
        setTempTier({
            name: "",
            description: "",
            conditionType: "days",
            conditionValue: 0,
        });
        setIsSheetOpen(true);
    };

    // Open the Sheet to edit an existing tier
    const handleEdit = (tier: MemberTier) => {
        setCurrentTier(tier);
        setTempTier({
            name: tier.name,
            description: tier.description,
            conditionType: tier.conditionType,
            conditionValue: tier.conditionValue,
        });
        setIsSheetOpen(true);
    };

    // Save the tier (either new or edited)
    const handleSaveTier = () => {
        if (currentTier) {
            // EDIT mode
            setTiers((prev) =>
                prev.map((item) =>
                    item.id === currentTier.id
                        ? {
                            ...item,
                            name: tempTier.name,
                            description: tempTier.description,
                            conditionType: tempTier.conditionType,
                            conditionValue: tempTier.conditionValue,
                        }
                        : item
                )
            );
        } else {
            // ADD mode
            const newId = tiers.reduce((max, item) => Math.max(max, item.id), 0) + 1;
            setTiers([
                ...tiers,
                {
                    id: newId,
                    name: tempTier.name,
                    description: tempTier.description,
                    conditionType: tempTier.conditionType,
                    conditionValue: tempTier.conditionValue,
                },
            ]);
        }

        // Close the sheet
        setIsSheetOpen(false);
    };

    // --------------------
    // DELETE Logic
    // --------------------
    // Open Dialog to confirm deletion
    const handleDelete = (tierId: number) => {
        setDeleteTierId(tierId);
        setIsDialogOpen(true);
    };

    // Confirm deletion
    const confirmDelete = () => {
        if (deleteTierId !== null) {
            setTiers((prev) => prev.filter((item) => item.id !== deleteTierId));
        }
        setIsDialogOpen(false);
        setDeleteTierId(null);
    };

    // Cancel deletion
    const cancelDelete = () => {
        setIsDialogOpen(false);
        setDeleteTierId(null);
    };

    return (
        <div className="space-y-4 p-4">
            {/* Title + Add Tier button */}
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Member Tiers Management</h1>
                <Button onClick={handleAddTier}>Add Tier</Button>
            </div>

            {/* Table */}
            <Card>
                <CardContent className="max-w-5xl mx-auto p-6 border border-gray-200 rounded-2xl my-10">
                    <Table className="pt-10">
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
                                    <TableCell>{tier.name}</TableCell>
                                    <TableCell className="max-w-xs">
                                        <p className="line-clamp-2">{tier.description}</p>
                                    </TableCell>
                                    <TableCell>{tier.conditionType}</TableCell>
                                    <TableCell>{tier.conditionValue}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <MoreVerticalIcon className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="flex flex-col">
                                                <DropdownMenuItem className="flex justify-between items-center bg-blue-900 text-blue-100 m-1" onClick={() => handleEdit(tier)}>
                                                    Edit
                                                    <Pencil className="w-4 h-4 ml-2" />
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex justify-between items-center bg-red-900 text-red-100 m-1" onClick={() => handleDelete(tier.id)}>
                                                    Delete
                                                    <Trash2 className="w-4 h-4 ml-2" />
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Sheet for Add/Edit Tier */}
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent className="w-[320px] sm:w-[400px]">
                    <SheetHeader>
                        <SheetTitle>
                            {currentTier ? "Edit Tier" : "Add Tier"}
                        </SheetTitle>
                    </SheetHeader>

                    <div className="mt-4 space-y-3">
                        {/* Name */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="e.g. VIP"
                                value={tempTier.name}
                                onChange={(e) =>
                                    setTempTier((prev) => ({ ...prev, name: e.target.value }))
                                }
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Short description"
                                value={tempTier.description}
                                onChange={(e) =>
                                    setTempTier((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                            />
                        </div>

                        {/* Condition Type */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="conditionType">Condition Type</Label>
                            <Select
                                value={tempTier.conditionType}
                                onValueChange={(value: "days" | "points") =>
                                    setTempTier((prev) => ({
                                        ...prev,
                                        conditionType: value,
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="days">Days</SelectItem>
                                    <SelectItem value="points">Points</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Condition Value */}
                        <div className="flex flex-col space-y-1">
                            <Label htmlFor="conditionValue">Condition Value</Label>
                            <Input
                                id="conditionValue"
                                type="number"
                                placeholder="e.g. 30"
                                value={tempTier.conditionValue}
                                onChange={(e) =>
                                    setTempTier((prev) => ({
                                        ...prev,
                                        conditionValue: Number(e.target.value),
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <SheetFooter className="mt-4">
                        <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTier}>
                            {currentTier ? "Save Changes" : "Add Tier"}
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Dialog for Delete Confirmation */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p className="py-4">Are you sure you want to delete this tier?</p>
                    <DialogFooter>
                        <Button variant="outline" onClick={cancelDelete}>
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