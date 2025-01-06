"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useClientAuthStore } from "@/stores/store";

export default function ClientMainPage() {
    const isAuthenticated = useClientAuthStore((state) => state.isAuthenticated); // Access auth state
    const logout = useClientAuthStore((state) => state.logout); // Access logout action
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/client/login"); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, router]);

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
            <h1 className="text-4xl font-bold font-mono text-gray-100 py-16">
                Client Main Page
            </h1>
            <button
                onClick={() => {
                    logout(); // Logout action
                    router.push("/client/login");
                }}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Logout
            </button>
        </div>
    );
}