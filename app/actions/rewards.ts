"use server";

import { createClient } from "@/utils/supabase/server";

// ───────────────────────────────────────────────────────────
// Fetch All Rewards
// ───────────────────────────────────────────────────────────
export async function fetchRewards() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching rewards:", error);
        return { success: false, message: "Failed to fetch rewards." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Fetch a Single Reward by ID
// ───────────────────────────────────────────────────────────
export async function fetchRewardById(rewardId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("id", rewardId)
        .single();

    if (error) {
        console.error("Error fetching reward by ID:", error);
        return { success: false, message: "Failed to fetch reward by ID." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Create a New Reward
// ───────────────────────────────────────────────────────────
export async function createReward(
    storeId: string,
    title: string,
    reward_name: string,
    unlock_points: number,
    reward_type: "promo" | "reward",
    days_left: number | null
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("rewards")
        .insert([
            {
                store_id: storeId,
                title,
                reward_name,
                unlock_points,
                reward_type,
                days_left,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating reward:", error);
        return { success: false, message: "Failed to create reward." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Update an Existing Reward
// ───────────────────────────────────────────────────────────
export async function updateReward(
    rewardId: number,
    title: string,
    reward_name: string,
    unlock_points: number,
    reward_type: "promo" | "reward",
    days_left: number | null
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("rewards")
        .update({
            title,
            reward_name,
            unlock_points,
            reward_type,
            days_left,
            updated_at: new Date(),
        })
        .eq("id", rewardId)
        .select()
        .single();

    if (error) {
        console.error("Error updating reward:", error);
        return { success: false, message: "Failed to update reward." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Delete a Reward
// ───────────────────────────────────────────────────────────
export async function deleteReward(rewardId: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("rewards")
        .delete()
        .eq("id", rewardId);

    if (error) {
        console.error("Error deleting reward:", error);
        return { success: false, message: "Failed to delete reward." };
    }
    return { success: true };
}