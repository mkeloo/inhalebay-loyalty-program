"use server";

import { createClient } from "@/utils/supabase/server";

// Fetch client device code
export async function getStoreClientCode() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("store_devices_codes")
        .select("*")
        .eq("device_type", "client");

    if (error) {
        console.error("Error fetching client device code:", error.message);
        return { success: false, message: "Failed to fetch client device code. Please try again later." };
    }

    if (!data || data.length === 0) {
        return { success: false, message: "No client device code found." };
    }

    // console.log(data, "data_client");
    return { success: true, data };
}

// Fetch handler device code
export async function getStoreHandlerCode() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("store_devices_codes")
        .select("*")
        .eq("device_type", "handler");

    if (error) {
        console.error("Error fetching handler device code:", error.message);
        return { success: false, message: "Failed to fetch handler device code. Please try again later." };
    }

    if (!data || data.length === 0) {
        return { success: false, message: "No handler device code found." };
    }

    // console.log(data, "data_handler");
    return { success: true, data };
}