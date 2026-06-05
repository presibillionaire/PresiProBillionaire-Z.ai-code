"use client";

import { useState } from "react";
import { Key, Eye, EyeOff, LogIn, ExternalLink, Play } from "lucide-react";
import { SlideUp, AnimatedPopup, FadeIn } from "@/components/shared/animations";
import { useTradingStore } from "@/stores/trading-store";

export function AuthSection() {
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const { authenticate, setAuthStatus } = useTradingStore();

  const handleConnect = async () => {
    if (!tokenInput.trim()) return;
    setLoading(true);
    setAuthStatus("connecting");

    try {
      // Demo mode: accept the special token
      if (tokenInput.trim() === "XtY8ut3mrwhrUg5") {
        authenticate(tokenInput.trim(), 5397.98, "demo");
        return;
      }

      const res = await fetch("/api/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        authenticate(tokenInput.trim(), data.balance, data.accountType);
      } else {
        setAuthStatus("error");
      }
    } catch {
      setAuthStatus("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    authenticate("demo-token", 5397.98, "demo");
  };

  return (
    <>
      {/* Divider */}
      <SlideUp delay={0.5}><div className="w-full max-w-sm flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-800" />
        <span className="text-gray-600 text-xs uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-800" />
      </div></SlideUp>

      {/* Manual Token Card */}
      <AnimatedPopup delay={0.55}><div className="w-full max-w-sm bg-gray-900/70 border border-gray-800/60 rounded-xl p-5 text-left space-y-3">
        <div className="flex items-center gap-2">
          <Key className="text-teal-400" size={14} />
          <h3 className="text-gray-200 text-sm font-semibold">Manual API Token</h3>
        </div>
        <p className="text-gray-500 text-xs leading-relaxed">
          Paste your token below to authorise.
        </p>

        {/* Token Input */}
        <div className="relative">
          <input
            type={showToken ? "text" : "password"}
            placeholder="Paste your Deriv API token…"
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2.5 pr-10 focus:outline-none focus:border-teal-500 placeholder-gray-600 transition-colors"
            autoComplete="off"
            spellCheck={false}
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleConnect()}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors cursor-pointer"
            onClick={() => setShowToken(!showToken)}
            tabIndex={-1}
            aria-label="Show token"
          >
            {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        {/* Connect Button */}
        <button
          disabled={!tokenInput.trim() || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm bg-teal-500 hover:bg-teal-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 shadow-lg shadow-teal-500/20 cursor-pointer"
          onClick={handleConnect}
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <LogIn size={14} />
          )}
          {loading ? "Connecting..." : "Connect with Token"}
        </button>

        {/* API Token Link */}
        <a
          href="https://app.deriv.com/account/api-token"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 text-xs text-gray-500 hover:text-teal-400 transition-colors"
        >
          <ExternalLink size={11} />
          Get your API token from Deriv
        </a>
      </div></AnimatedPopup>

      {/* Demo Mode */}
      <SlideUp delay={0.6}><div className="w-full max-w-sm mt-4">
        <button
          onClick={handleDemo}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-xs bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:bg-white/[0.06] hover:text-gray-300 transition-all cursor-pointer"
        >
          <Play size={14} />
          Try Demo Mode
        </button>
      </div></SlideUp>

      {/* New User */}
      <FadeIn delay={0.65}><p className="text-sm text-gray-600 mt-6">
        New to trading?{" "}
        <a
          href="https://track.deriv.be/_mZmaFu2DPTM5TVC3w-F7AGNd7ZgqdRLk/1/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-500 hover:text-teal-400 font-medium transition-colors underline underline-offset-2"
        >
          Open a free account
        </a>
      </p></FadeIn>
    </>
  );
}
