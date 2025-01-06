"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHandlerAuthStore } from "@/stores/store"; // Zustand store for handler auth

export default function HandlerMainPage() {
    const isAuthenticated = useHandlerAuthStore((state) => state.isAuthenticated); // Access auth state
    const logout = useHandlerAuthStore((state) => state.logout); // Access logout action
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/handler/login"); // Redirect to login if not authenticated
        }
    }, [isAuthenticated, router]);

    const handleLogout = () => {
        logout(); // Clear Zustand auth state
        router.push("/handler/login"); // Redirect to login page
    };

    return (
        <div className="w-full h-screen flex flex-col justify-center items-center bg-gray-900">
            <h1 className="text-4xl font-bold font-mono text-gray-100 py-16">
                Handler Main Page
            </h1>
            <button
                onClick={handleLogout}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            >
                Logout
            </button>
        </div>
    );
}