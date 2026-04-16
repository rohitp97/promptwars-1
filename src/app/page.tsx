"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, QrCode, Ticket, Map as MapIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const JourneyMap = dynamic(() => import("@/components/JourneyMap").then(mod => mod.JourneyMap), {
  ssr: false,
  loading: () => <div className="h-64 w-full flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-2xl animate-pulse"><p className="text-neutral-500 text-sm font-medium">Loading Map Directions...</p></div>
});

export default function LandingPage() {
  const [pnr, setPnr] = useState("");
  const [error, setError] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnr.trim().toUpperCase() === "RCB123") {
      setError(false);
      router.push("/dashboard");
    } else {
      setError(true);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Logo / Header */}
        <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center mb-6 shadow-2xl shadow-emerald-900/20" aria-label="MatchRoute Ticket Logo">
          <Ticket className="w-10 h-10 text-emerald-400" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-center">
          Match<span className="text-emerald-400">Route</span>
        </h1>
        <p className="text-neutral-400 text-center mb-10">
          Smart stadium navigation. Enter your ticket PNR to get started.
        </p>

        {/* Ticket PNR Form */}
        <form
          onSubmit={handleVerify}
          className="w-full bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 p-6 rounded-3xl shadow-xl flex flex-col gap-4"
        >
          <div>
            <label htmlFor="pnr" className="text-sm font-medium text-neutral-300 mb-2 block">
              Ticket PNR
            </label>
            <input
              id="pnr"
              type="text"
              value={pnr}
              onChange={(e) => {
                setPnr(e.target.value);
                setError(false);
              }}
              placeholder="e.g. RCB123"
              aria-invalid={error}
              aria-describedby={error ? "pnr-error" : undefined}
              className={cn(
                "w-full bg-neutral-950 border px-4 py-3 rounded-xl outline-none transition-all text-lg placeholder:text-neutral-600",
                error ? "border-red-500/50 focus:border-red-500" : "border-neutral-800 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20"
              )}
            />
            {error && <p id="pnr-error" className="text-red-400 text-sm mt-2 font-medium" role="alert">Invalid PNR. Try &apos;RCB123&apos;.</p>}
          </div>

          <button
            type="button"
            onClick={() => setShowMap(!showMap)}
            className="w-full bg-neutral-800/80 hover:bg-neutral-800 text-cyan-400 font-semibold py-3.5 rounded-xl border border-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <MapIcon className="w-5 h-5" /> {showMap ? "Hide Directions" : "Get Directions to My Gate"}
          </button>

          {showMap && (
            <div className="w-full my-1">
              <JourneyMap />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] mt-2"
          >
            Enter Stadium <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
          
          <div className="flex items-center gap-4 my-2">
            <div className="flex-1 h-px bg-neutral-800" />
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-neutral-800" />
          </div>

          <button
            type="button"
            onClick={() => alert("QR Scanner would open here!")}
            className="w-full bg-neutral-800/50 hover:bg-neutral-800 text-neutral-200 font-semibold py-3.5 rounded-xl border border-neutral-700/50 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <QrCode className="w-5 h-5" /> Scan QR Code
          </button>
        </form>
      </div>
    </main>
  );
}
