"use client";

import { useEffect, useCallback, useRef } from "react";
import { useTradingStore } from "@/stores/trading-store";
import { MARKETS } from "@/lib/markets";

import { Header, HeroSection } from "@/components/landing/hero";
import { AuthSection } from "@/components/landing/auth-section";
import { FeatureCards } from "@/components/landing/feature-cards";
import { Disclaimer } from "@/components/landing/disclaimer";
import { Footer } from "@/components/shared/footer";
import { DashboardHeader } from "@/components/dashboard/header";
import { StrategySelector } from "@/components/dashboard/strategy-selector";
import { StrategyPanel } from "@/components/dashboard/strategy-panel";
import { AIStrategist } from "@/components/dashboard/ai-strategist";
import { DigitChart } from "@/components/dashboard/digit-chart";
import { MarketScanner } from "@/components/dashboard/market-scanner";
import { ExecuteButton } from "@/components/dashboard/execute-button";
import { TradeHistory } from "@/components/dashboard/trade-history";

export default function Home() {
  const {
    authStatus,
    scanStatus,
    scanProgress,
    marketData,
    selectedMarket,
    updateMarketData,
    setScanProgress,
    setScanStatus,
    setStatusMessage,
    setBalance,
    setSelectedMarket,
    token,
  } = useTradingStore();

  const wsRef = useRef<WebSocket | null>(null);
  const tickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Simulated tick collection and scanning
  const simulateTicks = useCallback(() => {
    const allData = { ...marketData };

    MARKETS.forEach((m) => {
      const current = allData[m.symbol] || {
        symbol: m.symbol,
        label: m.label,
        ticksCollected: 0,
        evenStrength: 0,
        oddStrength: 0,
        gap: 0,
        stability: 0,
        quality: 0,
        lastDigits: [],
        confidence: 0,
        direction: "NEUTRAL" as const,
      };

      // Only collect ticks for some markets to simulate real behavior
      if (current.ticksCollected < 20 && Math.random() > 0.3) {
        current.ticksCollected += 1;
        current.lastDigits.push(Math.floor(Math.random() * 10));
      }

      // Calculate strengths when we have data
      if (current.lastDigits.length > 0) {
        const evenCount = current.lastDigits.filter((d: number) => d % 2 === 0).length;
        const oddCount = current.lastDigits.length - evenCount;
        current.evenStrength = (evenCount / current.lastDigits.length) * 100;
        current.oddStrength = (oddCount / current.lastDigits.length) * 100;
        current.gap = Math.abs(current.evenStrength - current.oddStrength);
        current.stability = Math.max(0, 100 - current.gap * 3);
        current.quality = current.gap * current.stability / 100;

        if (current.evenStrength > current.oddStrength) {
          current.direction = "EVEN";
          current.confidence = current.evenStrength;
        } else if (current.oddStrength > current.evenStrength) {
          current.direction = "ODD";
          current.confidence = current.oddStrength;
        }
      }

      updateMarketData(m.symbol, current);
    });
  }, [marketData, updateMarketData]);

  // Simulated balance updates
  const updateBalanceFromAPI = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/validate-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
      }
    } catch {
      // Silently fail - balance will be set from trade results
    }
  }, [token, setBalance]);

  // Start scanning simulation on auth
  useEffect(() => {
    if (authStatus !== "authenticated") return;

    setStatusMessage("Collecting ticks (0/20 min)...");
    setScanStatus("scanning");

    // Simulate tick collection
    tickIntervalRef.current = setInterval(() => {
      simulateTicks();
    }, 2000);

    // Simulate scan progress
    let progress = 0;
    scanIntervalRef.current = setInterval(() => {
      progress += 1;
      setScanProgress(progress);

      if (progress >= 20) {
        setScanStatus("ready");
        setStatusMessage("Ready to trade. Select a market and execute.");
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);

        // Find best market
        const allMarkets = useTradingStore.getState().marketData;
        let bestMarket = "1HZ75V";
        let bestQuality = 0;
        Object.entries(allMarkets).forEach(([symbol, data]) => {
          if (data.quality > bestQuality) {
            bestQuality = data.quality;
            bestMarket = symbol;
          }
        });
        setSelectedMarket(bestMarket);
      } else {
        setStatusMessage(`Collecting ticks (${progress}/20 min)...`);
      }
    }, 5000);

    return () => {
      if (tickIntervalRef.current) clearInterval(tickIntervalRef.current);
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [authStatus, simulateTicks, setScanProgress, setScanStatus, setStatusMessage, setSelectedMarket]);

  const isAuthenticated = authStatus === "authenticated";

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      {isAuthenticated ? (
        <>
          <DashboardHeader />
          <main className="flex-1 py-4 space-y-0">
            <StrategySelector />
            <StrategyPanel />
            <AIStrategist />
            <DigitChart />
            <MarketScanner />
            <ExecuteButton />
            <TradeHistory />
          </main>
          <Footer />
        </>
      ) : (
        <>
          <Header />
          <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
            <HeroSection />
            <AuthSection />
            <FeatureCards />
          </main>
          <Disclaimer />
          <Footer />
        </>
      )}
    </div>
  );
}
