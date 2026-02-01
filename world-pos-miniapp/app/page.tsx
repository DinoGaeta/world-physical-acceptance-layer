"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, QrCode, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const [step, setStep] = useState<"IDLE" | "AMOUNT" | "QR" | "SUCCESS">("IDLE");
    const [amount, setAmount] = useState("");

    const handleCharge = () => {
        if (!amount) return;
        setStep("QR");
        // Simulate payment confirmation after 4 seconds
        setTimeout(() => {
            setStep("SUCCESS");
        }, 4000);
    };

    const reset = () => {
        setAmount("");
        setStep("IDLE");
    };

    const KeypadButton = ({ val }: { val: string }) => (
        <button
            onClick={() => setAmount((prev) => prev + val)}
            className="h-16 w-full rounded-xl bg-gray-800 text-2xl font-semibold text-white hover:bg-gray-700 active:scale-95 transition-all"
        >
            {val}
        </button>
    );

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 font-sans text-white">
            <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-800 p-6">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-white text-black flex items-center justify-center font-bold">W</div>
                        <span className="text-lg font-bold tracking-tight">World POS</span>
                    </div>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>

                {/* Content Area */}
                <div className="relative h-[500px] p-6">
                    <AnimatePresence mode="wait">

                        {/* IDLE / AMOUNT STATE */}
                        {(step === "IDLE" || step === "AMOUNT") && (
                            <motion.div
                                key="input"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex h-full flex-col justify-between"
                            >
                                <div className="flex flex-col gap-2 pt-8 text-center">
                                    <span className="text-gray-400">Enter Amount</span>
                                    <div className="text-6xl font-bold tracking-tighter">
                                        € {amount || "0.00"}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((k) => (
                                        <KeypadButton key={k} val={k} />
                                    ))}
                                    <button
                                        onClick={() => setAmount((prev) => prev.slice(0, -1))}
                                        className="flex h-16 w-full items-center justify-center rounded-xl bg-gray-800 text-white hover:bg-gray-700"
                                    >
                                        ←
                                    </button>
                                </div>

                                <button
                                    onClick={handleCharge}
                                    disabled={!amount}
                                    className="mt-4 w-full rounded-xl bg-white py-4 text-lg font-bold text-black disabled:opacity-50 hover:bg-gray-200 transition-colors"
                                >
                                    Charge Card
                                </button>
                            </motion.div>
                        )}

                        {/* QR STATE */}
                        {step === "QR" && (
                            <motion.div
                                key="qr"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="flex h-full flex-col items-center justify-center gap-6 text-center"
                            >
                                <div className="relative rounded-2xl bg-white p-4 shadow-lg shadow-green-900/20">
                                    <QrCode className="h-48 w-48 text-black" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                        <div className="h-16 w-16 rounded-full bg-black" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Scan to Pay</h3>
                                    <p className="text-sm text-gray-400">Open World App to confirm</p>
                                </div>

                                <div className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-xs text-gray-400">
                                    <div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Waiting for settlement...
                                </div>
                            </motion.div>
                        )}

                        {/* SUCCESS STATE */}
                        {step === "SUCCESS" && (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex h-full flex-col items-center justify-center gap-8 text-center"
                            >
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-green-500/20 text-green-500">
                                    <CheckCircle2 className="h-16 w-16" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold text-white">Payment Received</h2>
                                    <p className="text-lg text-gray-400">{amount} USDC Settled</p>
                                </div>

                                <div className="w-full rounded-xl bg-gray-900 p-4 text-left text-sm text-gray-400">
                                    <div className="flex justify-between border-b border-gray-800 pb-2">
                                        <span>Tx Hash</span>
                                        <span className="font-mono text-white">0x7f2...9a1</span>
                                    </div>
                                    <div className="flex justify-between pt-2">
                                        <span>Network</span>
                                        <span className="text-white">World Chain</span>
                                    </div>
                                </div>

                                <button
                                    onClick={reset}
                                    className="w-full rounded-xl bg-white py-4 font-bold text-black"
                                >
                                    New Charge
                                </button>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            <div className="mt-8 flex gap-2 text-xs text-gray-600">
                <span>Powered by World Physical Layer</span>
                <span>•</span>
                <span>v0.9 Alpha Sandbox</span>
            </div>
        </main>
    );
}
