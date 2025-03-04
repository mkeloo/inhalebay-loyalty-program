"use server";

import { createClient } from "@/utils/supabase/server";

// ───────────────────────────────────────────────────────────
// Fetch All Member Tiers
// ───────────────────────────────────────────────────────────
export async function fetchMemberTiers() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("member_tiers")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching member tiers:", error);
        return { success: false, message: "Failed to fetch member tiers." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Fetch a Single Member Tier by ID
// ───────────────────────────────────────────────────────────
export async function fetchMemberTierById(tierId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("member_tiers")
        .select("*")
        .eq("id", tierId)
        .single();

    if (error) {
        console.error("Error fetching member tier by ID:", error);
        return { success: false, message: "Failed to fetch member tier by ID." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Create a New Member Tier
// ───────────────────────────────────────────────────────────
export async function createMemberTier(
    storeId: string,
    name: string,
    description: string,
    valueType: "days" | "points",
    value: number
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("member_tiers")
        .insert([
            {
                store_id: storeId,
                member_tier_name: name,
                description,
                value_type: valueType,
                value,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating member tier:", error);
        return { success: false, message: "Failed to create member tier." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Update an Existing Member Tier
// ───────────────────────────────────────────────────────────
export async function updateMemberTier(
    tierId: number,
    name: string,
    description: string,
    valueType: "days" | "points",
    value: number
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("member_tiers")
        .update({
            member_tier_name: name,
            description,
            value_type: valueType,
            value,
            updated_at: new Date(),
        })
        .eq("id", tierId)
        .select()
        .single();

    if (error) {
        console.error("Error updating member tier:", error);
        return { success: false, message: "Failed to update member tier." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Delete a Member Tier
// ───────────────────────────────────────────────────────────
export async function deleteMemberTier(tierId: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("member_tiers")
        .delete()
        .eq("id", tierId);

    if (error) {
        console.error("Error deleting member tier:", error);
        return { success: false, message: "Failed to delete member tier." };
    }
    return { success: true };
}