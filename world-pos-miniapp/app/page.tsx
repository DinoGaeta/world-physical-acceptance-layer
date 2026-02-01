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
            className="h-16 w-full rounded-2xl glass text-2xl font-light text-white hover:bg-white/10 active:scale-95 transition-all duration-200 border border-white/5"
        >
            {val}
        </button>
    );

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 font-sans text-white relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-sm relative z-10">

                {/* Device Container */}
                <div className="glass-card overflow-hidden rounded-[2.5rem] shadow-2xl">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/5 p-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white text-black flex items-center justify-center font-black text-lg shadow-lg shadow-white/20">W</div>
                            <span className="text-xl font-medium tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">World POS</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse" />
                            <span className="text-xs text-green-500 font-medium">ONLINE</span>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="relative h-[580px] p-6 flex flex-col">
                        <AnimatePresence mode="wait">

                            {/* IDLE / AMOUNT STATE */}
                            {(step === "IDLE" || step === "AMOUNT") && (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex h-full flex-col justify-between"
                                >
                                    <div className="flex flex-col gap-2 pt-8 text-center">
                                        <span className="text-gray-400 text-sm uppercase tracking-widest font-medium">Total Amount</span>
                                        <div className="text-6xl font-light tracking-tighter text-white drop-shadow-xl">
                                            <span className="text-3xl opacity-50 align-top mr-1">€</span>
                                            {amount || "0.00"}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 mt-8">
                                        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((k) => (
                                            <KeypadButton key={k} val={k} />
                                        ))}
                                        <button
                                            onClick={() => setAmount((prev) => prev.slice(0, -1))}
                                            className="flex h-16 w-full items-center justify-center rounded-2xl glass text-white hover:bg-white/10 active:scale-95 transition-all"
                                        >
                                            ←
                                        </button>
                                    </div>

                                    <button
                                        onClick={handleCharge}
                                        disabled={!amount}
                                        className="mt-6 w-full rounded-2xl bg-white py-4 text-lg font-bold text-black shadow-lg shadow-white/10 disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
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
                                    className="flex h-full flex-col items-center justify-center gap-8 text-center"
                                >
                                    <div className="relative p-6 bg-white rounded-3xl shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                                        <QrCode className="h-48 w-48 text-black" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-10">
                                            <div className="h-16 w-16 rounded-full bg-black" />
                                        </div>
                                        {/* Corners */}
                                        <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-black rounded-tl-lg" />
                                        <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-black rounded-tr-lg" />
                                        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-black rounded-bl-lg" />
                                        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-black rounded-br-lg" />
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Scan to Pay</h3>
                                        <p className="text-sm text-gray-400">Open World App to confirm payment</p>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-full glass px-5 py-3 text-xs text-gray-300">
                                        <div className="h-2 w-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                        Waiting for settlement...
                                    </div>
                                </motion.div>
                            )}

                            {/* SUCCESS STATE */}
                            {step === "SUCCESS" && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex h-full flex-col items-center justify-center gap-10 text-center"
                                >
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-green-500/30 blur-[40px] rounded-full" />
                                        <div className="relative flex h-32 w-32 items-center justify-center rounded-full glass border-green-500/20 text-green-400">
                                            <CheckCircle2 className="h-16 w-16 drop-shadow-[0_0_10px_rgba(74,222,128,0.5)]" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold text-white tracking-tight">Payment Received</h2>
                                        <p className="text-xl text-gray-300 font-light">{amount} USDC Settled</p>
                                    </div>

                                    <div className="w-full rounded-2xl glass p-5 text-left space-y-3">
                                        <div className="flex justify-between border-b border-white/10 pb-3">
                                            <span className="text-xs text-gray-400 uppercase tracking-widest">Transaction Hash</span>
                                            <span className="font-mono text-xs text-green-400">0x7f2...9a1</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-gray-400 uppercase tracking-widest">Network</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                                <span className="text-sm text-white">World Chain</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={reset}
                                        className="w-full rounded-2xl bg-white py-4 font-bold text-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-white/10"
                                    >
                                        New Charge
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex gap-2 text-[10px] text-gray-600 uppercase tracking-widest opacity-50">
                <span>Powered by World Physical Layer</span>
                <span>•</span>
                <span>v0.9 Alpha Sandbox</span>
            </div>
        </main>
    );
}
