"use server";

import { createClient } from "@/utils/supabase/server";

// ───────────────────────────────────────────────────────────
// Fetch All Screen Codes
// ───────────────────────────────────────────────────────────
export async function fetchScreenCodes() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("screen_codes")
        .select("*")
        .order("created_at", { ascending: true });

    if (error) {
        console.error("Error fetching screen codes:", error);
        return { success: false, message: "Failed to fetch screen codes." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Fetch a Single Screen Code by ID
// ───────────────────────────────────────────────────────────
export async function fetchScreenCodeById(screenCodeId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("screen_codes")
        .select("*")
        .eq("id", screenCodeId)
        .single();

    if (error) {
        console.error("Error fetching screen code by ID:", error);
        return { success: false, message: "Failed to fetch screen code by ID." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Create a New Screen Code
// ───────────────────────────────────────────────────────────
export async function createScreenCode(
    storeId: string,
    screen_name: string,
    screen_code: number
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("screen_codes")
        .insert([
            {
                store_id: storeId,
                screen_name,
                screen_code,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Error creating screen code:", error);
        return { success: false, message: "Failed to create screen code." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Update an Existing Screen Code
// ───────────────────────────────────────────────────────────
export async function updateScreenCode(
    screenCodeId: number,
    screen_name: string,
    screen_code: number
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("screen_codes")
        .update({
            screen_name,
            screen_code,
            updated_at: new Date(),
        })
        .eq("id", screenCodeId)
        .select()
        .single();

    if (error) {
        console.error("Error updating screen code:", error);
        return { success: false, message: "Failed to update screen code." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Delete a Screen Code
// ───────────────────────────────────────────────────────────
export async function deleteScreenCode(screenCodeId: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("screen_codes")
        .delete()
        .eq("id", screenCodeId);

    if (error) {
        console.error("Error deleting screen code:", error);
        return { success: false, message: "Failed to delete screen code." };
    }
    return { success: true };
}