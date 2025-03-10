"use server";

import { createClient } from "@/utils/supabase/server";

// ───────────────────────────────────────────────────────────
// Fetch Customer Transactions with Pagination
// ───────────────────────────────────────────────────────────
export async function fetchCustomerTransactions(page: number = 1, pageSize: number = 20) {
    const supabase = await createClient();

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data, error } = await supabase
        .from("customer_transactions")
        .select("*")
        .order("created_at", { ascending: false }) // Show latest first
        .range(from, to); // Fetch 20 rows per page

    if (error) {
        console.error("Error fetching customer transactions:", error);
        return { success: false, data: [], message: "Failed to fetch transactions." };
    }

    return { success: true, data };
}


// ───────────────────────────────────────────────────────────
// Fetch a single Customer Transaction by ID
// ───────────────────────────────────────────────────────────
export async function fetchCustomerTransactionById(transactionId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customer_transactions")
        .select("*")
        .eq("id", transactionId)
        .single();

    if (error) {
        console.error("Error fetching customer transaction by ID:", error);
        return { success: false, data: null, message: "Failed to fetch transaction." };
    }
    return { success: true, data };
}

// ───────────────────────────────────────────────────────────
// Fetch Other Transactions for a Customer (excluding one ID)
// ───────────────────────────────────────────────────────────
export async function fetchCustomerTransactionsByCustomerId(
    customerId: string,         // <-- Must be a string (UUID)
    excludeTransactionId: number,
    limit: number = 20
) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("customer_transactions")
        .select("*")
        .eq("customer_id", customerId)         // compare string to string
        .neq("id", excludeTransactionId)       // exclude the currently viewed transaction
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching other transactions for customer:", error);
        return { success: false, data: [], message: "Failed to fetch other transactions." };
    }

    return { success: true, data };
}