"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define the prop type
type RewardsEditFormProps = {
  reward?: {
    reward: string;
    point_value: number;
  };
};

export default function RewardsEditForm({ reward }: RewardsEditFormProps) {
  return (
    <form className="flex flex-col gap-4 mt-4">
      <div>
        <Label htmlFor="reward">Reward</Label>
        <Input
          id="reward"
          defaultValue={reward?.reward || ""}
          placeholder="Enter reward name"
        />
      </div>
      <div>
        <Label htmlFor="points">Point Value</Label>
        <Input
          id="points"
          defaultValue={reward?.point_value || ""}
          placeholder="Enter point value"
          type="number"
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
}
