"use server";

import { createClient } from "@/utils/supabase/server";
import { Customers } from "@/lib/types";

// ───────────────────────────────────────────────────────────
// Fetch Customers with Pagination
// ───────────────────────────────────────────────────────────
export async function fetchCustomers(page: number = 1, pageSize: number = 20) {
    const supabase = await createClient();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching customers:", error);
        return { success: false, data: [], message: "Failed to fetch customers." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Fetch Customer by Phone Number
// ───────────────────────────────────────────────────────────
export async function fetchCustomerByPhone(phoneNumber: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("phone_number", phoneNumber)
        .maybeSingle();

    if (error) {
        console.error("Error fetching customer by phone:", error);
        return { success: false, data: null, message: "Failed to fetch customer by phone." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Create a New Customer
// ───────────────────────────────────────────────────────────
export async function createCustomer(customer: Partial<Customers>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .insert([customer])
        .select()
        .single();

    if (error) {
        console.error("Error creating customer:", error);
        return { success: false, data: null, message: "Failed to create customer." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Update an Existing Customer
// ───────────────────────────────────────────────────────────
export async function updateCustomer(customerId: string, updates: Partial<Customers>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", customerId)
        .select()
        .single();

    if (error) {
        console.error("Error updating customer:", error);
        return { success: false, data: null, message: "Failed to update customer." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Delete a Customer
// ───────────────────────────────────────────────────────────
export async function deleteCustomer(customerId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", customerId);

    if (error) {
        console.error("Error deleting customer:", error);
        return { success: false, message: "Failed to delete customer." };
    }
    return { success: true };
}