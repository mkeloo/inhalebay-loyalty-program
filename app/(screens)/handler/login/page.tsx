"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useHandlerAuthStore } from "@/stores/store"; // Zustand store for handler auth

export default function HandlerLoginPage() {
    const isAuthenticated = useHandlerAuthStore((state) => state.isAuthenticated); // Zustand state
    const login = useHandlerAuthStore((state) => state.login); // Zustand login action
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const correctCode = "1234"; // Replace with your handler lock code

    // Redirect to /handler/main/ if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/handler/main");
        }
    }, [isAuthenticated, router]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (code === correctCode) {
            login(); // Call Zustand login action
            router.push("/handler/main"); // Redirect after successful login
        } else {
            setError("Invalid code. Please try again.");
        }
    };

    const handleCodeChange = (value: string) => {
        setCode(value);
        setError(""); // Clear error when input changes
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form
                onSubmit={handleLogin}
                className="p-6 bg-gray-800 rounded-lg shadow-lg w-80 space-y-6"
            >
                <h1 className="text-xl font-bold text-gray-100 text-center">
                    Handler Login
                </h1>

                {/* OTP Input */}
                <InputOTP
                    maxLength={4}
                    onChange={handleCodeChange} // Update code on change
                >
                    <InputOTPGroup className="flex justify-center items-center gap-4">
                        <InputOTPSlot
                            index={0}
                            className="h-12 w-12 bg-gray-700 text-gray-100 text-center focus:ring-blue-500 focus:ring-2 rounded-md"
                        />
                        <InputOTPSlot
                            index={1}
                            className="h-12 w-12 bg-gray-700 text-gray-100 text-center focus:ring-blue-500 focus:ring-2 rounded-md"
                        />
                        <InputOTPSlot
                            index={2}
                            className="h-12 w-12 bg-gray-700 text-gray-100 text-center focus:ring-blue-500 focus:ring-2 rounded-md"
                        />
                        <InputOTPSlot
                            index={3}
                            className="h-12 w-12 bg-gray-700 text-gray-100 text-center focus:ring-blue-500 focus:ring-2 rounded-md"
                        />
                    </InputOTPGroup>
                </InputOTP>

                {/* Error Message */}
                {error && (
                    <p className="text-red-400 bg-red-800 p-2 rounded-md text-center">
                        {error}
                    </p>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Enter
                </button>
            </form>
        </div>
    );
}