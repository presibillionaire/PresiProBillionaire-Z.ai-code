import { Play, Wifi, WifiOff, Loader2, AlertTriangle, Bot, PartyPopper, Volume2 } from "lucide-react";
import { useTradingStore } from "@/stores/trading-store";
import { AnimatedPopup, PulseScale } from "@/components/shared/animations";
import { motion, AnimatePresence } from "framer-motion";
import { useDerivTrade } from "@/hooks/use-deriv-trade";
import { useEffect, useRef, useState, useCallback } from "react";

export function ExecuteButton() {
  const {
    direction, stake, marketData, selectedMarket,
    scanStatus, statusMessage, sessionPL, takeProfit,
    isTrading, wsConnected, trades,
    autoTradeEnabled, confidenceThreshold,
    martingaleEnabled, martMultiplier,
    reinvestEnabled, reinvestPercent,
    stakePercent, balance,
    consecutiveLosses, targetProfitReached,
    setIsTrading, setStatusMessage,
    setAutoTradeEnabled, setStake,
    setConsecutiveLosses, setTargetProfitReached,
  } = useTradingStore();

  const { executeTrade } = useDerivTrade();
  const currentMarket = marketData[selectedMarket];
  const confidence = currentMarket?.confidence || 0;

  // Use confidenceThreshold from settings (not hardcoded 30)
  const minConfidence = autoTradeEnabled ? confidenceThreshold : 30;
  const canTrade = scanStatus === "ready" && confidence >= minConfidence && wsConnected && !isTrading;
  const tpReached = sessionPL >= takeProfit && takeProfit > 0;

  // Track session stats
  const winCount = trades.filter((t) => t.result === "win").length;
  const lossCount = trades.filter((t) => t.result === "loss").length;
  const totalClosed = winCount + lossCount;
  const winRate = totalClosed > 0 ? Math.round((winCount / totalClosed) * 100) : 0;

  const [cooldownActive, setCooldownActive] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTradingRef = useRef(false);
  const autoTradeTriggeredRef = useRef(false);

  // Celebration state
  const [showCelebration, setShowCelebration] = useState(false);

  // Watch for target profit reached
  useEffect(() => {
    if (tpReached && !targetProfitReached && sessionPL > 0) {
      setTargetProfitReached(true);
      setShowCelebration(true);
      setStatusMessage(`🎉 Target Profit Reached! +$${sessionPL.toFixed(2)} USD`);
      // Disable auto trade when target reached
      setAutoTradeEnabled(false);
      // Hide celebration after 6 seconds
      setTimeout(() => setShowCelebration(false), 6000);
    }
  }, [tpReached, targetProfitReached, sessionPL, setTargetProfitReached, setAutoTradeEnabled, setStatusMessage]);

  // Calculate the effective stake before executing
  const calculateEffectiveStake = useCallback(() => {
    const s = useTradingStore.getState();
    let baseStake = s.balance * (s.stakePercent / 100);

    // Apply reinvest: add % of session profit to base stake
    if (s.reinvestEnabled && s.sessionPL > 0) {
      baseStake += s.sessionPL * (s.reinvestPercent / 100);
    }

    // Apply martingale: multiply by martMultiplier for each consecutive loss
    if (s.martingaleEnabled && s.consecutiveLosses > 0) {
      baseStake = baseStake * Math.pow(s.martMultiplier, s.consecutiveLosses);
    }

    // Cap at 95% of balance to prevent over-staking
    const effectiveStake = Math.min(baseStake, s.balance * 0.95);
    return Math.max(0.35, parseFloat(effectiveStake.toFixed(2))); // Deriv min stake
  }, []);

  const handleExecute = () => {
    if (!canTrade || cooldownActive || tpReached) return;

    const effectiveStake = calculateEffectiveStake();
    setStake(effectiveStake);

    setIsTrading(true);
    setStatusMessage(
      `Initiating trade: ${direction} · ${currentMarket?.label || "Unknown"} · $${effectiveStake.toFixed(2)} USD` +
      (martingaleEnabled && consecutiveLosses > 0 ? ` · Mart ×${Math.pow(martMultiplier, consecutiveLosses).toFixed(1)}` : "")
    );
    executeTrade();
  };

  // Cooldown: detect when isTrading transitions from true → false
  useEffect(() => {
    if (prevTradingRef.current && !isTrading) {
      const cooldownSec = useTradingStore.getState().cooldown;
      if (cooldownSec > 0) {
        setCooldownActive(true);
        cooldownTimerRef.current = setTimeout(() => {
          setCooldownActive(false);
        }, cooldownSec * 1000);
      }
    }
    prevTradingRef.current = isTrading;
  }, [isTrading]);

  // Cleanup cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  // Track trade results for martingale
  useEffect(() => {
    if (trades.length > 0) {
      const lastTrade = trades[0];
      if (lastTrade.result === "win" || lastTrade.result === "loss") {
        if (lastTrade.result === "win") {
          setConsecutiveLosses(0);
        } else if (lastTrade.result === "loss") {
          const prev = useTradingStore.getState().consecutiveLosses;
          // Check if this loss was already counted
          const prevLastLoss = trades.length > 1 ? trades[1] : null;
          if (prevLastLoss?.result !== "loss") {
            setConsecutiveLosses(prev + 1);
          }
        }
      }
    }
  }, [trades, setConsecutiveLosses]);

  // Auto-trade loop
  useEffect(() => {
    if (
      autoTradeEnabled &&
      canTrade &&
      !cooldownActive &&
      !tpReached &&
      !autoTradeTriggeredRef.current
    ) {
      autoTradeTriggeredRef.current = true;
      // Small delay before auto executing to let UI update
      const autoTimer = setTimeout(() => {
        autoTradeTriggeredRef.current = false;
        const effectiveStake = calculateEffectiveStake();
        setStake(effectiveStake);
        setIsTrading(true);
        setStatusMessage(
          `[AUTO] ${direction} · ${currentMarket?.label || "Unknown"} · $${effectiveStake.toFixed(2)} · conf ${Math.round(confidence)}%`
        );
        executeTrade();
      }, 500);
      return () => clearTimeout(autoTimer);
    } else {
      autoTradeTriggeredRef.current = false;
    }
  }, [autoTradeEnabled, canTrade, cooldownActive, tpReached, confidence, isTrading]);

  // Determine button state
  let btnDisabled = false;
  let btnLabel = "";
  let btnSub = "";

  if (tpReached) {
    btnDisabled = true;
    btnLabel = "🎉 Target Profit Reached!";
    btnSub = `+$${sessionPL.toFixed(2)} — session complete`;
  } else if (isTrading) {
    btnDisabled = true;
    btnLabel = "Executing Trade...";
    btnSub = "Waiting for Deriv response";
  } else if (cooldownActive) {
    btnDisabled = true;
    btnLabel = "Cooldown Active";
    btnSub = "Waiting before next trade";
  } else if (!wsConnected) {
    btnDisabled = true;
    btnLabel = "Not Connected";
    btnSub = "WebSocket disconnected";
  } else if (scanStatus !== "ready") {
    btnDisabled = true;
    btnLabel = "Scanning Markets";
    btnSub = "Collecting tick data...";
  } else if (autoTradeEnabled && confidence < confidenceThreshold) {
    btnDisabled = true;
    btnLabel = "AUTO — Waiting for Signal";
    btnSub = `${Math.round(confidence)}% — need ${confidenceThreshold}%+ confidence`;
  } else if (confidence < 30) {
    btnDisabled = true;
    btnLabel = "Low Signal";
    btnSub = `${Math.round(confidence)}% — need 30%+ confidence`;
  }

  const effectiveStake = calculateEffectiveStake();

  return (
    <AnimatedPopup delay={0.3}>
      <div className="w-full max-w-4xl mx-auto px-4 mt-4">
        {/* AUTO Trade Toggle */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              if (tpReached) return;
              setAutoTradeEnabled(!autoTradeEnabled);
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              autoTradeEnabled
                ? "bg-teal-500/15 border-teal-500/30 text-teal-300 shadow-lg shadow-teal-500/20"
                : tpReached
                ? "bg-white/[0.02] border-white/[0.04] text-gray-600 cursor-not-allowed"
                : "bg-white/[0.04] border-white/[0.06] text-gray-400 hover:bg-white/[0.08] hover:text-gray-300"
            }`}
          >
            <Bot size={14} className={autoTradeEnabled ? "text-teal-400 animate-pulse" : ""} />
            {autoTradeEnabled ? "AUTO TRADING ON" : "AUTO TRADE"}
          </motion.button>

          {autoTradeEnabled && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/[0.08] border border-teal-500/20"
            >
              <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-[10px] text-teal-400 font-medium">
                Waiting for {confidenceThreshold}%+ confidence · Stake: ${effectiveStake.toFixed(2)}
                {martingaleEnabled && consecutiveLosses > 0 && (
                  <span className="text-violet-400 ml-1">· Mart ×{Math.pow(martMultiplier, consecutiveLosses).toFixed(1)}</span>
                )}
              </span>
            </motion.div>
          )}
        </div>

        {/* Execute Button */}
        {!btnDisabled ? (
          <PulseScale>
            <motion.button
              whileHover={{ scale: 1.01, boxShadow: "0 0 50px rgba(20, 184, 166, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExecute}
              className={`w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xl relative overflow-hidden ${
                autoTradeEnabled
                  ? "bg-gradient-to-r from-teal-500 to-emerald-400 text-white shadow-teal-500/40"
                  : "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-teal-500/40"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
              <div className="relative flex items-center gap-2">
                {autoTradeEnabled ? <Bot size={18} /> : <Play size={18} />}
                {autoTradeEnabled ? `[AUTO] ${direction} · ${currentMarket?.label || "Select Market"}` : `${direction} · ${currentMarket?.label || "Select Market"}`}
                <span className="opacity-70">· {Math.round(confidence)}% · ${effectiveStake.toFixed(2)}</span>
              </div>
            </motion.button>
          </PulseScale>
        ) : (
          <button
            disabled
            className="w-full rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-not-allowed bg-white/[0.03] border border-white/[0.06] text-white/20"
          >
            {tpReached ? (
              <PartyPopper size={18} className="text-emerald-400/60" />
            ) : isTrading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : !wsConnected ? (
              <WifiOff size={18} />
            ) : (
              <Play size={18} />
            )}
            <span className={tpReached ? "text-emerald-400/80" : ""}>{btnLabel}</span>
            {btnSub && <span className="text-white/10">· {btnSub}</span>}
          </button>
        )}

        {/* Status Message */}
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2.5 bg-white/[0.03]"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
              statusMessage.includes("⚠") || statusMessage.includes("❌")
                ? "bg-red-400"
                : statusMessage.includes("✅") || statusMessage.includes("🎉")
                  ? "bg-emerald-400"
                  : "bg-teal-400 animate-pulse"
            }`} />
            <span className={`text-xs font-mono ${
              statusMessage.includes("⚠") || statusMessage.includes("❌")
                ? "text-red-400"
                : statusMessage.includes("✅") || statusMessage.includes("🎉")
                  ? "text-emerald-400"
                  : "text-gray-400"
            }`}>
              {statusMessage}
            </span>
          </motion.div>
        )}

        {/* Take Profit Warning */}
        {tpReached && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-xl px-4 py-2.5 flex items-center gap-2.5 bg-emerald-500/[0.08] border border-emerald-500/20"
          >
            <PartyPopper className="text-emerald-400" size={14} />
            <span className="text-emerald-400 text-xs font-medium">
              🎉 Target Profit of ${takeProfit.toFixed(2)} reached! Session P/L: +{sessionPL.toFixed(2)} USD
            </span>
          </motion.div>
        )}

        {/* Celebration Overlay */}
        <AnimatePresence>
          {showCelebration && <CelebrationOverlay />}
        </AnimatePresence>

        {/* Quick Stats */}
        {totalClosed > 0 && (
          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-gray-500">
            <span>Trades: <span className="text-white font-mono">{totalClosed}</span></span>
            <span className="text-gray-700">|</span>
            <span>Won: <span className="text-emerald-400 font-mono">{winCount}</span></span>
            <span className="text-gray-700">|</span>
            <span>Lost: <span className="text-red-400 font-mono">{lossCount}</span></span>
            <span className="text-gray-700">|</span>
            <span>Win Rate: <span className={`font-mono ${winRate >= 50 ? "text-emerald-400" : "text-red-400"}`}>{winRate}%</span></span>
            {consecutiveLosses > 0 && (
              <>
                <span className="text-gray-700">|</span>
                <span>Streak: <span className="text-red-400 font-mono">{consecutiveLosses}L</span></span>
              </>
            )}
          </div>
        )}
      </div>
    </AnimatedPopup>
  );
}

/* ─── Celebration Overlay ─── */
function CelebrationOverlay() {
  // Generate confetti particles
  const particles = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: 2 + Math.random() * 2,
    size: 4 + Math.random() * 6,
    color: [
      "bg-teal-400", "bg-emerald-400", "bg-green-400",
      "bg-amber-400", "bg-yellow-400", "bg-white",
      "bg-teal-300", "bg-emerald-300",
    ][Math.floor(Math.random() * 8)],
    rotation: Math.random() * 360,
    shape: Math.random() > 0.5 ? "rounded-full" : "rounded-sm",
  }));

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Confetti particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute ${p.color} ${p.shape}`}
          style={{
            width: p.size,
            height: p.size * (p.shape === "rounded-sm" ? 1.5 : 1),
            left: `${p.x}%`,
            top: "-5%",
          }}
          initial={{ y: 0, opacity: 1, rotate: p.rotation, scale: 0 }}
          animate={{
            y: [0, 300, 600, 900],
            x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 150],
            opacity: [1, 1, 0.8, 0],
            rotate: p.rotation + 720,
            scale: [0, 1, 1, 0.5],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Center celebration banner */}
      <motion.div
        className="relative bg-gradient-to-br from-teal-500/20 to-emerald-500/20 backdrop-blur-xl border border-teal-400/30 rounded-3xl px-10 py-8 text-center shadow-2xl shadow-teal-500/30"
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: -20 }}
        transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.3 }}
      >
        {/* Glow */}
        <div className="absolute inset-0 rounded-3xl bg-teal-500/10 blur-xl" />

        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="relative"
        >
          <div className="text-5xl mb-3">🏆</div>
          <h2 className="text-2xl font-bold text-white mb-2">Target Profit Reached!</h2>
          <p className="text-teal-300 text-sm font-medium">
            Session Complete — Auto Trading Stopped
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
