"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { useClientAuthStore } from "@/stores/store";
import { getStoreClientCode } from '../../../actions/screenCodes'

export default function ClientLoginPage() {
    const isAuthenticated = useClientAuthStore((state) => state.isAuthenticated); // Zustand state
    const login = useClientAuthStore((state) => state.login); // Zustand login action
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [correctCode, setCorrectCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // const correctCode = "5678"; // Replace with your client lock code

    // Redirect to /client/main/ if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/client/main"); // Redirect if already logged in
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        async function fetchClientCode() {
            try {
                const response = await getStoreClientCode();
                if (response.success && response.data && response.data.length > 0) {
                    const clientCode = response.data[0]?.device_code;
                    setCorrectCode(clientCode);
                } else {
                    setError("Failed to fetch client code. Please try again later.");
                }
            } catch (err) {
                console.error("Error fetching client code:", err);
                setError("An error occurred while fetching client code.");
            } finally {
                setLoading(false);
            }
        }

        fetchClientCode();
    }, []);



    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loading || correctCode === null) {
            setError("Please wait while we fetch the code.");
            return;
        }
        if (parseInt(code, 10) === Number(correctCode)) {
            login(); // Call Zustand login action
            router.push("/client/main"); // Redirect after successful login
        } else {
            setError("Invalid code. Please try again.");
        }
    };



    const handleCodeChange = (value: string) => {
        setCode(value);
        setError(""); // Clear error when input changes
    };

    // console.log("correctCode", correctCode);
    // console.error("error", error);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="text-gray-100 font-bold text-3xl animate-bounce">Loading Client...</p>
            </div>
        );
    }

    if (!correctCode) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-900">
                <p className="text-red-400 font-bold text-2xl">Client code not available. Please contact support.</p>
            </div>
        );
    }




    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <form
                onSubmit={handleLogin}
                className="p-6 bg-gray-800 rounded-lg shadow-lg w-80 space-y-6"
            >
                <h1 className="text-xl font-bold text-gray-100 text-center">
                    Client Login
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
                    <p className="text-red-800 bg-red-300 p-2 rounded-md text-center">
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