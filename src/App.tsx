import { useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTradingStore } from "@/stores/trading-store";
import { MARKETS, DERIV_WS_URL, TICKS_REQUIRED } from "@/lib/markets";
import { Header, HeroSection } from "@/components/landing/hero";
import { FeatureCards } from "@/components/landing/feature-cards";
import { AuthSection } from "@/components/landing/auth-section";
import { Disclaimer } from "@/components/landing/disclaimer";
import { Footer } from "@/components/shared/footer";
import { DashboardHeader } from "@/components/dashboard/header";
import { StrategySelector } from "@/components/dashboard/strategy-selector";
import { StrategyPanel } from "@/components/dashboard/strategy-panel";
import { AIStrategist } from "@/components/dashboard/ai-strategist";
import { ExecuteButton } from "@/components/dashboard/execute-button";
import { DigitChart } from "@/components/dashboard/digit-chart";
import { MarketScanner } from "@/components/dashboard/market-scanner";
import { TradeHistory } from "@/components/dashboard/trade-history";
import { motion, AnimatePresence } from "framer-motion";

// WebSocket connection manager
let globalWs: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let isConnecting = false;

function processTick(symbol: string, quote: number) {
  const s = useTradingStore.getState();
  const quoteStr = quote.toString();
  const lastDigit = parseInt(quoteStr[quoteStr.length - 1], 10);
  if (isNaN(lastDigit)) return;

  const currentData = s.marketData[symbol];
  if (!currentData) return;

  // Keep last 100 digits for chart display
  const lastDigits = [...currentData.lastDigits, lastDigit].slice(-100);
  const totalTicks = lastDigits.length;

  // === Signal analysis uses a SHORT window (last 25 ticks) for fast reaction ===
  const signalWindow = lastDigits.slice(-25);
  const signalTicks = signalWindow.length;

  let evenCount = 0;
  let oddCount = 0;
  signalWindow.forEach((d) => {
    if (d % 2 === 0) evenCount++;
    else oddCount++;
  });

  const evenStrength = signalTicks > 0 ? (evenCount / signalTicks) * 100 : 50;
  const oddStrength = signalTicks > 0 ? (oddCount / signalTicks) * 100 : 50;
  const gap = Math.abs(evenStrength - oddStrength);

  // Stability: consistency across small sliding windows (5-tick windows)
  let stability = 50;
  if (signalTicks >= 5) {
    const windowSize = 5;
    let stableCount = 0;
    const totalWindows = Math.floor(signalTicks / windowSize);
    for (let w = 0; w < totalWindows; w++) {
      const slice = signalWindow.slice(w * windowSize, (w + 1) * windowSize);
      let wEven = 0;
      slice.forEach((d) => { if (d % 2 === 0) wEven++; });
      const wRatio = (wEven / windowSize) * 100;
      if (Math.abs(wRatio - evenStrength) < 25) stableCount++;
    }
    stability = totalWindows > 0 ? (stableCount / totalWindows) * 100 : 50;
  }

  const quality = (gap * 0.7) + (stability * 0.3);
  // Aggressive confidence: reacts quickly to short-term streaks
  // A gap of 8% with 50% stability → ~22%, gap 12% → ~33%, gap 16% → ~44%
  const confidence = Math.min(100, Math.max(0, (gap * 2.5) * (stability / 100) + (gap * 1.2)));
  const direction = evenStrength > oddStrength + 2 ? "EVEN" as const
    : oddStrength > evenStrength + 2 ? "ODD" as const
    : "NEUTRAL" as const;

  s.updateMarketData(symbol, {
    lastDigits, ticksCollected: totalTicks,
    evenStrength, oddStrength, gap, stability, quality, confidence, direction,
  });

  const allData = s.marketData;
  const marketsWithMinTicks = Object.values(allData).filter(
    (m) => m.ticksCollected >= TICKS_REQUIRED
  ).length;
  const scanProgress = Math.round((marketsWithMinTicks / MARKETS.length) * 100);
  s.setScanProgress(scanProgress);

  // Ready when at least half the markets have minimum ticks
  if (scanProgress >= 50 && s.scanStatus === "scanning") {
    s.setScanStatus("ready");
    s.setStatusMessage("Scan complete — ready to trade");
  }

  s.setLastTickTime(Date.now());
}

function connectWs() {
  if (globalWs?.readyState === WebSocket.OPEN || globalWs?.readyState === WebSocket.CONNECTING) return;
  if (isConnecting) return;
  isConnecting = true;

  const store = useTradingStore;
  store.getState().setWsConnected(false);
  store.getState().setStatusMessage("Connecting to Deriv...");

  const ws = new WebSocket(DERIV_WS_URL);

  ws.onopen = () => {
    isConnecting = false;
    globalWs = ws;
    store.getState().setWsConnected(true);
    store.getState().setWsRef(ws);
    store.getState().setStatusMessage("Connected to Deriv WebSocket");

    const { token, authStatus } = store.getState();
    if (token && authStatus === "authenticated") {
      ws.send(JSON.stringify({ authorize: token }));
      setTimeout(() => {
        MARKETS.forEach((market) => {
          ws.send(JSON.stringify({ ticks: market.symbol, subscribe: 1 }));
        });
        store.getState().setIsScanning(true);
        store.getState().setScanStatus("scanning");
        store.getState().setStatusMessage("Subscribed to all 10 markets — collecting ticks");
      }, 500);
    }
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data.msg_type === "authorize" && data.authorize) {
        const auth = data.authorize;
        store.getState().setBalance(auth.balance);
        store.getState().setAccountType(auth.loginid.startsWith("VRTC") ? "demo" : "real");
        store.getState().setAuthorizeResponse(data);
        store.getState().setStatusMessage(`Authorized: ${auth.fullname} · ${auth.currency} ${auth.balance.toFixed(2)}`);
      }

      if (data.msg_type === "authorize" && data.error) {
        // Still subscribe to ticks for demo
        MARKETS.forEach((market) => {
          ws.send(JSON.stringify({ ticks: market.symbol, subscribe: 1 }));
        });
        store.getState().setIsScanning(true);
        store.getState().setScanStatus("scanning");
      }

      if (data.msg_type === "tick" && data.tick) {
        processTick(data.tick.symbol, data.tick.quote);
      }
    } catch { /* ignore */ }
  };

  ws.onclose = () => {
    isConnecting = false;
    store.getState().setWsConnected(false);
    store.getState().setStatusMessage("Disconnected. Reconnecting...");
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(() => connectWs(), 3000);
  };

  ws.onerror = () => { /* handled by onclose */ };
}

function disconnectWs() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (globalWs) {
    globalWs.onclose = null;
    globalWs.close();
    globalWs = null;
  }
}

function LandingView() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] relative">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <HeroSection />
        <AuthSection />
        <FeatureCards />
      </main>
      <Disclaimer />
      <Footer />
    </div>
  );
}

function DashboardView() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712] relative">
      <DashboardHeader />
      <main className="flex-1 pb-8">
        <StrategySelector />
        <StrategyPanel />
        <AIStrategist />
        <DigitChart />
        <MarketScanner />
        <ExecuteButton />
        <TradeHistory />
      </main>
    </div>
  );
}

function AppContent() {
  const { authStatus } = useTradingStore();
  const isAuthenticated = authStatus === "authenticated";
  const prevAuthRef = useRef(authStatus);

  useEffect(() => {
    if (isAuthenticated && prevAuthRef.current !== "authenticated") {
      // Just authenticated — connect WebSocket
      setTimeout(() => connectWs(), 500);
    }
    if (!isAuthenticated && prevAuthRef.current === "authenticated") {
      // Just logged out — disconnect
      disconnectWs();
    }
    prevAuthRef.current = authStatus;
  }, [isAuthenticated]);

  // On mount, if already authenticated, reconnect
  useEffect(() => {
    if (isAuthenticated) {
      connectWs();
    }
    return () => {
      // Don't disconnect on unmount to avoid issues with React StrictMode
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardView />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LandingView />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
}
