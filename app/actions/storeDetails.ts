"use server";

import { createClient } from "@/utils/supabase/server";


// ───────────────────────────────────────────────────────────
// Fetch the Store ID by Store Code
// ───────────────────────────────────────────────────────────
export async function fetchStoreId(storeCode: number) {
    const supabase = await createClient();

    // Convert the numeric storeCode to string
    const { data, error } = await supabase
        .from('inhale_bay_stores')
        .select('id')
        .eq('store_code', storeCode)
        .single();

    if (error) {
        console.error("Error fetching store id:", error);
        return { success: false, message: "Failed to fetch store id." };
    }
    if (!data?.id) {
        return { success: false, message: "No store found with the provided store code." };
    }

    return { success: true, data: data.id };
}