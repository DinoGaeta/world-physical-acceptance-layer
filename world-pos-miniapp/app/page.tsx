"use client";

import { useState } from "react";
import { Check, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
    const [step, setStep] = useState<"IDLE" | "AMOUNT" | "QR" | "SUCCESS">("IDLE");
    const [amount, setAmount] = useState("");

    const handleCharge = () => {
        if (!amount) return;
        setStep("QR");
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
            className="h-16 w-full rounded-xl bg-[#111] text-2xl font-normal text-white hover:bg-[#222] active:scale-95 transition-all border border-white/5 active:border-[#00FF57]/50"
        >
            {val}
        </button>
    );

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 font-sans text-white relative overflow-hidden bg-black">

            {/* Ambient Glows to match render */}
            <div className="absolute top-[-20%] left-[20%] w-[300px] h-[300px] bg-[#00FF57]/10 rounded-full blur-[100px]" />

            <div className="w-full max-w-sm relative z-10">

                {/* Device Container */}
                <div className="glass-card overflow-hidden rounded-[40px] border border-white/10">

                    {/* Header Bar */}
                    <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-black">
                                <div className="w-4 h-4 rounded-full border border-white"></div>
                            </div>
                            <span className="font-semibold text-lg tracking-tight">World POS</span>
                        </div>
                        {/* Status Light */}
                        <div className="w-12 h-1 bg-[#00FF57] rounded-full shadow-[0_0_10px_#00FF57]" />
                    </div>

                    {/* Content Area */}
                    <div className="relative h-[600px] p-6 flex flex-col">
                        <AnimatePresence mode="wait">

                            {/* IDLE / AMOUNT STATE */}
                            {(step === "IDLE" || step === "AMOUNT") && (
                                <motion.div
                                    key="input"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="flex h-full flex-col justify-between"
                                >
                                    <div className="flex flex-col items-center pt-10 gap-2">
                                        <span className="text-[#00FF57] text-3xl font-light">€ {amount || "0.00"}</span>
                                    </div>

                                    <div className="w-full space-y-4">
                                        <button
                                            onClick={handleCharge}
                                            disabled={!amount}
                                            className="w-full h-16 rounded-xl bg-[#00FF57] text-black text-xl font-bold shadow-[0_0_20px_rgba(0,255,87,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none disabled:bg-gray-800 disabled:text-gray-500"
                                        >
                                            Charge
                                        </button>

                                        <div className="grid grid-cols-3 gap-3">
                                            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((k) => (
                                                <KeypadButton key={k} val={k} />
                                            ))}
                                            <button
                                                onClick={() => setAmount((prev) => prev.slice(0, -1))}
                                                className="flex h-16 w-full items-center justify-center rounded-xl bg-[#111] text-white hover:bg-[#222]"
                                            >
                                                ←
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* QR STATE */}
                            {step === "QR" && (
                                <motion.div
                                    key="qr"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0, scale: 1.1 }}
                                    className="flex h-full flex-col items-center justify-center text-center pb-20"
                                >
                                    <p className="text-gray-400 mb-6 font-light">Scan with World App</p>

                                    <div className="relative p-4 bg-white rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.1)] mb-8">
                                        <QrCode className="h-56 w-56 text-black" strokeWidth={1.5} />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-[#00FF57] rounded-full animate-pulse" />
                                        <span className="text-sm text-gray-400">Waiting for confirmation...</span>
                                    </div>
                                </motion.div>
                            )}

                            {/* SUCCESS STATE */}
                            {step === "SUCCESS" && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex h-full flex-col items-center justify-center text-center pb-10"
                                >
                                    {/* Green Check Animation */}
                                    <div className="mb-8 relative">
                                        <div className="absolute inset-0 bg-[#00FF57]/20 blur-2xl rounded-full" />
                                        <Check className="w-32 h-32 text-[#00FF57] drop-shadow-[0_0_15px_rgba(0,255,87,0.8)]" strokeWidth={3} />
                                    </div>

                                    <h2 className="text-[#00FF57] text-3xl font-bold mb-2">Payment Received</h2>
                                    <p className="text-white text-lg font-light mb-12">{amount} USDC Settled</p>

                                    <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#00FF57]/50 to-transparent mb-12" />

                                    <button
                                        onClick={reset}
                                        className="w-full h-14 rounded-xl border border-[#00FF57]/30 text-[#00FF57] hover:bg-[#00FF57]/10 transition-all font-medium uppercase tracking-wider text-sm"
                                    >
                                        New Charge
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Bottom Bar Indicator */}
                    <div className="h-1 w-1/3 mx-auto bg-gray-800 rounded-full mb-4" />
                </div>
            </div>
        </main>
    );
}
