"use client";

import { Zap } from "lucide-react";
import { Logo } from "@/components/shared/logo";

export function Header() {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-gray-800/50">
      <Logo size="md" />
    </header>
  );
}

export function HeroSection() {
  return (
    <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
      {/* Animated Badge */}
      <div className="flex items-center gap-2 bg-gray-800/60 border border-gray-700/50 rounded-full px-3 py-1 sm:px-4 sm:py-1.5 mb-8">
        <div className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span className="text-sky-400 text-xs sm:text-sm font-medium">
          AI-Powered Deriv Trading Signals
        </span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
        Win More on{" "}
        <span className="text-sky-400">Deriv</span>
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-lg leading-relaxed mb-3">
        AI-powered signals for smarter Rise/Fall entries with dual-thread
        simultaneous contract deployment.
      </p>
      <p className="text-gray-600 text-sm mb-10">
        Real-time. Precise. Built for Deriv.
      </p>

      {/* OAuth Button */}
      <div className="w-full max-w-sm space-y-3">
        <button className="w-full bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white font-semibold text-base px-8 py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-sky-500/20 hover:shadow-sky-400/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer">
          <Zap size={16} />
          Connect with Deriv OAuth
        </button>
      </div>
    </div>
  );
}
