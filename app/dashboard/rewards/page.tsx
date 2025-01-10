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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Icons (adjust these to whatever icons you’re using)
import { MoreVerticalIcon, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Reward = {
  id: number;
  reward: string;
  point_value: number;
};

// Dummy data
const dummyData: Reward[] = [
  { id: 1, reward: "$5 Reward (no tobacco)", point_value: 100 },
  { id: 2, reward: "$10 Reward (no tobacco)", point_value: 200 },
];

export default function RewardsManagementPage() {
  // The rewards data
  const [rewards, setRewards] = React.useState<Reward[]>(dummyData);

  // Sheet state
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Tracking which reward is being edited or deleted
  const [currentReward, setCurrentReward] = React.useState<Reward | null>(null);
  const [deleteRewardId, setDeleteRewardId] = React.useState<number | null>(null);

  // Temp form state for adding/editing
  const [tempReward, setTempReward] = React.useState({
    reward: "",
    point_value: 0,
  });

  // ---------------------
  // ADD / EDIT Handlers
  // ---------------------

  // Open the Sheet to add a new reward
  const handleAddReward = () => {
    setCurrentReward(null); // We’re adding, so no current reward
    setTempReward({ reward: "", point_value: 0 }); // Reset temp form
    setIsSheetOpen(true);
  };

  // Open the Sheet to edit an existing reward
  const handleEdit = (reward: Reward) => {
    setCurrentReward(reward);
    setTempReward({
      reward: reward.reward,
      point_value: reward.point_value,
    });
    setIsSheetOpen(true);
  };

  // Save the reward (either new or edited)
  const handleSaveReward = () => {
    if (currentReward) {
      // EDIT mode
      setRewards((prev) =>
        prev.map((item) =>
          item.id === currentReward.id
            ? {
              ...item,
              reward: tempReward.reward,
              point_value: tempReward.point_value,
            }
            : item
        )
      );
    } else {
      // ADD mode
      const newId = rewards.reduce((max, item) => Math.max(max, item.id), 0) + 1;
      setRewards([
        ...rewards,
        {
          id: newId,
          reward: tempReward.reward,
          point_value: tempReward.point_value,
        },
      ]);
    }
    // Close the sheet
    setIsSheetOpen(false);
  };

  // ------------
  // DELETE Logic
  // ------------

  // Open Dialog to confirm deletion
  const handleDelete = (rewardId: number) => {
    setDeleteRewardId(rewardId);
    setIsDialogOpen(true);
  };

  // Confirm deletion
  const confirmDelete = () => {
    if (deleteRewardId !== null) {
      setRewards((prev) => prev.filter((item) => item.id !== deleteRewardId));
    }
    setIsDialogOpen(false);
    setDeleteRewardId(null);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setIsDialogOpen(false);
    setDeleteRewardId(null);
  };

  return (
    <div className="space-y-4 p-4">
      {/* Title + Add Reward button */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Rewards Management</h1>
        <Button onClick={handleAddReward}>Add Reward</Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="max-w-3xl mx-auto p-6 border border-gray-200 rounded-2xl my-10">
          <Table className="pt-10">
            <TableHeader>
              <TableRow>
                <TableHead>Reward</TableHead>
                <TableHead>Point Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.reward}</TableCell>
                  <TableCell>{item.point_value}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="flex flex-col">
                        <DropdownMenuItem className="flex justify-between items-center bg-blue-900 text-blue-100 m-1" onClick={() => handleEdit(item)}>
                          Edit
                          <Pencil className="w-4 h-4 ml-2" />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex justify-between items-center bg-red-900 text-red-100 m-1" onClick={() => handleDelete(item.id)}>
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

      {/* Sheet for Add/Edit */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[320px] sm:w-[400px]">
          <SheetHeader>
            <SheetTitle>
              {currentReward ? "Edit Reward" : "Add Reward"}
            </SheetTitle>
          </SheetHeader>

          <div className="mt-4 space-y-3">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="reward">Reward</Label>
              <Input
                id="reward"
                placeholder="e.g. $5 Reward (no tobacco)"
                value={tempReward.reward}
                onChange={(e) =>
                  setTempReward((prev) => ({ ...prev, reward: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col space-y-1">
              <Label htmlFor="point_value">Point Value</Label>
              <Input
                id="point_value"
                type="number"
                placeholder="e.g. 100"
                value={tempReward.point_value}
                onChange={(e) =>
                  setTempReward((prev) => ({
                    ...prev,
                    point_value: Number(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <SheetFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsSheetOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveReward}>
              {currentReward ? "Save Changes" : "Add Reward"}
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
          <p className="py-4">Are you sure you want to delete this reward?</p>
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