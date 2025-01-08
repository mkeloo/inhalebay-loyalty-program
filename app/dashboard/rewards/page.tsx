"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import RewardsEditForm from "@/components/dashboard/rewards/RewardsEditForm"; // Dummy form component

// Define the type for a single reward
type Reward = {
  id: number;
  reward: string;
  point_value: number;
};

// Define the dummy data as an array of Reward objects
const dummyData: Reward[] = [
  { id: 1, reward: "$5 Reward (no tobacco)", point_value: 100 },
  { id: 2, reward: "$10 Reward (no tobacco)", point_value: 200 },
];

export default function RewardsManagementPage() {
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [deleteReward, setDeleteReward] = useState<Reward | null>(null);

  const handleDelete = () => {
    if (deleteReward) {
      console.log("Deleted Reward:", deleteReward);
      // Replace with an API call or state update logic.
    }
    setDeleteReward(null);
  };

  return (
    <div className="w-full flex flex-col items-start p-6 gap-6">
      {/* Title and Add Button */}
      <div className="flex justify-between w-full items-center">
        <h1 className="text-2xl font-bold">Rewards</h1>
        <Button>Add Reward</Button>
      </div>

      {/* Table */}
      <Card className="w-full">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Reward</TableHead>
                <TableHead>Point value</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dummyData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <span className="font-medium">{row.reward}</span>
                  </TableCell>
                  <TableCell>{row.point_value}</TableCell>
                  <TableCell>
                    {/* Edit Button */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => setSelectedReward(row)}
                        >
                          Edit
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Edit Reward</SheetTitle>
                        </SheetHeader>
                        {selectedReward && (
                          <RewardsEditForm reward={selectedReward} />
                        )}
                      </SheetContent>
                    </Sheet>

                    {/* Delete Button */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          onClick={() => setDeleteReward(row)}
                        >
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Delete</DialogTitle>
                        </DialogHeader>
                        <p>Are you sure you want to delete this reward?</p>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            onClick={() => setDeleteReward(null)}
                          >
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={handleDelete}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
