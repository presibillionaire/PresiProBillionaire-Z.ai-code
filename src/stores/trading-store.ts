import { create } from "zustand";
import type { Trade, MarketData, Strategy } from "@/lib/markets";
import { MARKETS } from "@/lib/markets";

export type Direction = "EVEN" | "ODD" | "MIX" | "AUTO";
export type Mode = "standard" | "reverse";
export type AuthStatus = "idle" | "connecting" | "authenticated" | "error";

interface TradingState {
  // Auth
  authStatus: AuthStatus;
  token: string;
  balance: number;
  accountType: "demo" | "real";

  // Strategy
  activeStrategy: Strategy | null;
  strategySelectorOpen: boolean;

  // Trading
  direction: Direction;
  mode: Mode;
  stake: number;
  tickDuration: number;
  signalThreshold: number;
  minGap: number;
  cooldown: number;
  confirmCycles: number;
  trendAgreement: boolean;
  takeProfit: number;
  martingaleSteps: number;

  // Market Data
  marketData: Record<string, MarketData>;
  scanProgress: number;
  isScanning: boolean;
  selectedMarket: string;

  // Trades
  trades: Trade[];
  sessionPL: number;
  isTrading: boolean;

  // UI
  settingsOpen: boolean;
  aiEnabled: boolean;
  statusMessage: string;
  scanStatus: "idle" | "scanning" | "ready" | "trading";

  // Actions
  setToken: (token: string) => void;
  setAuthStatus: (status: AuthStatus) => void;
  setBalance: (balance: number) => void;
  setAccountType: (type: "demo" | "real") => void;
  authenticate: (token: string, balance: number, type: "demo" | "real") => void;
  logout: () => void;

  setActiveStrategy: (strategy: Strategy) => void;
  toggleStrategySelector: () => void;

  setDirection: (dir: Direction) => void;
  setMode: (mode: Mode) => void;
  setStake: (stake: number) => void;
  setTickDuration: (ticks: number) => void;
  setSignalThreshold: (val: number) => void;
  setMinGap: (val: number) => void;
  setCooldown: (val: number) => void;
  setConfirmCycles: (val: number) => void;
  setTrendAgreement: (val: boolean) => void;
  setTakeProfit: (val: number) => void;
  setMartingaleSteps: (val: number) => void;

  updateMarketData: (symbol: string, data: Partial<MarketData>) => void;
  setScanProgress: (progress: number) => void;
  setIsScanning: (scanning: boolean) => void;
  setSelectedMarket: (market: string) => void;

  addTrade: (trade: Trade) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  setSessionPL: (pl: number) => void;
  setIsTrading: (trading: boolean) => void;

  toggleSettings: () => void;
  toggleAI: () => void;
  setStatusMessage: (msg: string) => void;
  setScanStatus: (status: "idle" | "scanning" | "ready" | "trading") => void;
}

const initialMarketData: Record<string, MarketData> = {};
MARKETS.forEach((m) => {
  initialMarketData[m.symbol] = {
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
    direction: "NEUTRAL",
  };
});

export const useTradingStore = create<TradingState>((set, get) => ({
  // Auth
  authStatus: "idle",
  token: "",
  balance: 0,
  accountType: "demo",

  // Strategy
  activeStrategy: null,
  strategySelectorOpen: false,

  // Trading
  direction: "EVEN",
  mode: "standard",
  stake: 10,
  tickDuration: 2,
  signalThreshold: 62,
  minGap: 6,
  cooldown: 5,
  confirmCycles: 3,
  trendAgreement: true,
  takeProfit: 100,
  martingaleSteps: 0,

  // Market Data
  marketData: initialMarketData,
  scanProgress: 0,
  isScanning: false,
  selectedMarket: "1HZ75V",

  // Trades
  trades: [],
  sessionPL: 0,
  isTrading: false,

  // UI
  settingsOpen: false,
  aiEnabled: false,
  statusMessage: "",
  scanStatus: "idle",

  // Actions
  setToken: (token) => set({ token }),
  setAuthStatus: (status) => set({ authStatus: status }),
  setBalance: (balance) => set({ balance }),
  setAccountType: (type) => set({ accountType: type }),

  authenticate: (token, balance, type) =>
    set({
      token,
      balance,
      accountType: type,
      authStatus: "authenticated",
      activeStrategy: {
        id: "m-pro",
        name: "M Pro",
        description: "Even/Odd confidence engine · 10-market auto",
        icon: "crown",
        status: "active",
      },
      scanStatus: "scanning",
    }),

  logout: () =>
    set({
      authStatus: "idle",
      token: "",
      balance: 0,
      activeStrategy: null,
      trades: [],
      sessionPL: 0,
      isScanning: false,
      scanProgress: 0,
      scanStatus: "idle",
      statusMessage: "",
      marketData: initialMarketData,
    }),

  setActiveStrategy: (strategy) => set({ activeStrategy: strategy, strategySelectorOpen: false }),
  toggleStrategySelector: () => set((s) => ({ strategySelectorOpen: !s.strategySelectorOpen })),

  setDirection: (dir) => set({ direction: dir }),
  setMode: (mode) => set({ mode }),
  setStake: (stake) => set({ stake }),
  setTickDuration: (ticks) => set({ tickDuration: ticks }),
  setSignalThreshold: (val) => set({ signalThreshold: val }),
  setMinGap: (val) => set({ minGap: val }),
  setCooldown: (val) => set({ cooldown: val }),
  setConfirmCycles: (val) => set({ confirmCycles: val }),
  setTrendAgreement: (val) => set({ trendAgreement: val }),
  setTakeProfit: (val) => set({ takeProfit: val }),
  setMartingaleSteps: (val) => set({ martingaleSteps: val }),

  updateMarketData: (symbol, data) =>
    set((s) => ({
      marketData: {
        ...s.marketData,
        [symbol]: { ...s.marketData[symbol], ...data },
      },
    })),

  setScanProgress: (progress) => set({ scanProgress: progress }),
  setIsScanning: (scanning) => set({ isScanning: scanning }),
  setSelectedMarket: (market) => set({ selectedMarket: market }),

  addTrade: (trade) => set((s) => ({ trades: [trade, ...s.trades] })),
  updateTrade: (id, updates) =>
    set((s) => ({
      trades: s.trades.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
  setSessionPL: (pl) => set({ sessionPL: pl }),
  setIsTrading: (trading) => set({ isTrading: trading }),

  toggleSettings: () => set((s) => ({ settingsOpen: !s.settingsOpen })),
  toggleAI: () => set((s) => ({ aiEnabled: !s.aiEnabled })),
  setStatusMessage: (msg) => set({ statusMessage: msg }),
  setScanStatus: (status) => set({ scanStatus: status }),
}));
