import { useState } from "react";
import { Key, Eye, EyeOff, LogIn, ExternalLink, Play, Wifi, WifiOff, Loader2 } from "lucide-react";
import { SlideUp, AnimatedPopup, FadeIn } from "@/components/shared/animations";
import { useTradingStore } from "@/stores/trading-store";
import { motion } from "framer-motion";

export function AuthSection() {
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const { authenticate, setAuthStatus } = useTradingStore();

  const handleConnect = async () => {
    if (!tokenInput.trim()) return;
    setLoading(true);
    setErrorMsg("");
    setAuthStatus("connecting");

    try {
      // Demo mode: accept the special token
      if (tokenInput.trim() === "XtY8ut3mrwhrUg5") {
        authenticate(tokenInput.trim(), 5397.98, "demo");
        return;
      }

      // For real tokens, connect via WebSocket authorize
      // We'll store the token and let App.tsx handle the WS auth
      authenticate(tokenInput.trim(), 0, "demo");
    } catch {
      setAuthStatus("error");
      setErrorMsg("Connection failed. Please check your token and try again.");
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
      <SlideUp delay={0.5}>
        <div className="w-full max-w-sm flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
          <span className="text-gray-600 text-xs uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
        </div>
      </SlideUp>

      {/* Manual Token Card */}
      <AnimatedPopup delay={0.55}>
        <div className="w-full max-w-sm bg-white/[0.04] backdrop-blur-xl rounded-2xl p-5 text-left space-y-4 shadow-2xl shadow-black/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-teal-500/12 rounded-lg flex items-center justify-center">
              <Key className="text-teal-400" size={14} />
            </div>
            <div>
              <h3 className="text-gray-200 text-sm font-semibold">Manual API Token</h3>
              <p className="text-gray-500 text-[10px] mt-0.5">Connect directly via Deriv WebSocket</p>
            </div>
          </div>

          {/* Connection indicator */}
          <div className="flex items-center gap-2 bg-white/[0.04] rounded-lg px-3 py-2">
            <WifiOff className="text-gray-600" size={12} />
            <span className="text-gray-500 text-[10px]">WebSocket: <span className="text-gray-400">Ready to connect</span></span>
          </div>

          {/* Token Input */}
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              placeholder="Paste your Deriv API token…"
              className="w-full bg-white/[0.04] text-gray-200 text-sm rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-1 focus:ring-teal-500/30 placeholder-gray-600 transition-all"
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
          <motion.button
            disabled={!tokenInput.trim() || loading}
            whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(20, 184, 166, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-teal-500 to-teal-400 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-teal-500/20"
            onClick={handleConnect}
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <LogIn size={14} />
            )}
            {loading ? "Connecting..." : "Connect with Token"}
          </motion.button>

          {/* Error message */}
          {errorMsg && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-400 text-xs text-center"
            >
              {errorMsg}
            </motion.p>
          )}

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
        </div>
      </AnimatedPopup>

      {/* Demo Mode */}
      <SlideUp delay={0.6}>
        <div className="w-full max-w-sm mt-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDemo}
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-medium text-sm bg-white/[0.04] text-gray-400 hover:bg-white/[0.07] hover:text-gray-300 transition-all cursor-pointer"
          >
            <Play size={16} className="text-teal-400" />
            Try Demo Mode
          </motion.button>
        </div>
      </SlideUp>

      {/* New User */}
      <FadeIn delay={0.65}>
        <p className="text-sm text-gray-600 mt-6">
          New to trading?{" "}
          <a
            href="https://track.deriv.be/_mZmaFu2DPTM5TVC3w-F7AGNd7ZgqdRLk/1/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-500 hover:text-teal-400 font-medium transition-colors underline underline-offset-2"
          >
            Open a free account
          </a>
        </p>
      </FadeIn>
    </>
  );
}
