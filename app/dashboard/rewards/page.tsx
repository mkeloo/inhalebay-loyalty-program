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
  fetchRewards,
  createReward,
  updateReward,
  deleteReward,
} from "../../actions/rewards";
import { fetchStoreId } from "../../actions/storeDetails";
import { Reward, STORE_CODE } from "@/lib/types";

export default function RewardsManagement() {
  const [rewards, setRewards] = useState<Reward[]>([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // UI states
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Data
  const [currentReward, setCurrentReward] = useState<Reward | null>(null);
  const [deleteRewardId, setDeleteRewardId] = useState<number | null>(null);

  // ───────────────────────────────────────────────────────
  // Load Rewards on Component Mount
  // ───────────────────────────────────────────────────────
  useEffect(() => {
    async function loadRewards() {
      setIsLoading(true);
      const result = await fetchRewards();
      if (result.success) {
        setRewards(result.data ?? []);
      } else {
        console.error(result.message);
        setRewards([]);
      }
      setIsLoading(false);
    }
    loadRewards();
  }, []);

  // ───────────────────────────────────────────────────────
  // Add / Edit Reward
  // ───────────────────────────────────────────────────────
  const handleAddReward = () => {
    setCurrentReward({
      id: 0,
      title: "",
      reward_name: "",
      unlock_points: null,
      reward_type: "promo",
      days_left: null,
    });
    setIsSheetOpen(true);
  };

  const handleEdit = (reward: Reward) => {
    setCurrentReward(reward);
    setIsSheetOpen(true);
  };

  const handleSaveReward = async () => {
    if (!currentReward) return;
    setIsSaving(true);

    if (currentReward.id) {
      // Edit Mode
      const updateResult = await updateReward(
        currentReward.id,
        currentReward.title,
        currentReward.reward_name,
        currentReward.unlock_points ?? 0,
        currentReward.reward_type,
        currentReward.days_left
      );
      if (!updateResult.success) {
        console.error(updateResult.message);
      }
    } else {
      // Add Mode
      const storeResult = await fetchStoreId(STORE_CODE);
      if (storeResult.success && storeResult.data) {
        const createResult = await createReward(
          storeResult.data,
          currentReward.title,
          currentReward.reward_name,
          currentReward.unlock_points ?? 0,
          currentReward.reward_type,
          currentReward.days_left
        );
        if (!createResult.success) {
          console.error(createResult.message);
        }
      } else {
        console.error("Error fetching store id.");
      }
    }

    // Refresh data
    const result = await fetchRewards();
    if (result.success) {
      setRewards(result.data ?? []);
    }

    setIsSaving(false);
    setIsSheetOpen(false);
  };

  // ───────────────────────────────────────────────────────
  // Delete Reward
  // ───────────────────────────────────────────────────────
  const handleDelete = (rewardId: number) => {
    setDeleteRewardId(rewardId);
    setIsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (deleteRewardId !== null) {
      setIsDeleting(true);
      const deleteResult = await deleteReward(deleteRewardId);
      if (!deleteResult.success) {
        console.error(deleteResult.message);
      }
      // Refresh data
      const result = await fetchRewards();
      if (result.success) {
        setRewards(result.data ?? []);
      }
      setIsDeleting(false);
    }
    setIsDialogOpen(false);
    setDeleteRewardId(null);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Title + Add Reward button */}
      <div className="flex items-center justify-center pb-4">
        <h1 className="text-4xl font-semibold">Rewards Management</h1>
      </div>

      {/* Loading indicator */}
      {isLoading && <p className="text-sm text-gray-500">Loading rewards...</p>}

      {/* Table */}
      <Card className="w-full px-6 py-6 border border-gray-700 rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between mb-4 py-4 border border-gray-700 rounded-2xl">
          <h1 className="text-2xl font-semibold">Current Rewards</h1>
          <Button onClick={handleAddReward}>Add Reward</Button>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Reward Name</TableHead>
              <TableHead>Unlock Points</TableHead>
              <TableHead>Reward Type</TableHead>
              <TableHead>Days Left</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewards.map((reward) => (
              <TableRow key={reward.id}>
                <TableCell>{reward.title}</TableCell>
                <TableCell>{reward.reward_name}</TableCell>
                <TableCell>{reward.unlock_points ?? "-"}</TableCell>
                <TableCell>{reward.reward_type}</TableCell>
                <TableCell>{reward.days_left ?? "-"}</TableCell>
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
                        onClick={() => handleEdit(reward)}
                      >
                        Edit <Pencil className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="bg-red-700 text-red-100 m-1 flex items-center justify-between"
                        onClick={() => handleDelete(reward.id)}
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

      {/* Sheet for Add/Edit Reward */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {currentReward?.id ? "Edit Reward" : "Add Reward"}
            </SheetTitle>
            <VisuallyHidden.Root>
              <SheetDescription>Description goes here</SheetDescription>
            </VisuallyHidden.Root>
          </SheetHeader>
          <div className="mt-4 space-y-3">
            <Label>Title</Label>
            <Input
              value={currentReward?.title || ""}
              onChange={(e) =>
                setCurrentReward((prev) =>
                  prev ? { ...prev, title: e.target.value } : prev
                )
              }
            />
            <Label>Reward Name</Label>
            <Input
              value={currentReward?.reward_name || ""}
              onChange={(e) =>
                setCurrentReward((prev) =>
                  prev ? { ...prev, reward_name: e.target.value } : prev
                )
              }
            />
            <Label>Unlock Points</Label>
            <Input
              type="number"
              value={currentReward?.unlock_points ?? 0}
              onChange={(e) =>
                setCurrentReward((prev) =>
                  prev ? { ...prev, unlock_points: Number(e.target.value) } : prev
                )
              }
            />
            <Label>Reward Type</Label>
            <Select
              value={currentReward?.reward_type || "promo"}
              onValueChange={(value) =>
                setCurrentReward((prev) =>
                  prev ? { ...prev, reward_type: value as "promo" | "reward" } : prev
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="promo">Promo</SelectItem>
                <SelectItem value="reward">Reward</SelectItem>
              </SelectContent>
            </Select>
            <Label>Days Left</Label>
            <Input
              type="number"
              value={currentReward?.days_left ?? 0}
              onChange={(e) =>
                setCurrentReward((prev) =>
                  prev ? { ...prev, days_left: Number(e.target.value) } : prev
                )
              }
            />
          </div>
          <SheetFooter>
            <Button onClick={handleSaveReward} disabled={isSaving}>
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
            Are you sure you want to delete this reward?
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