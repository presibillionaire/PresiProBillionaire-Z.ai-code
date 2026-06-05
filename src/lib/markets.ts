// PresiProBillionaire - Deriv Trading Signal Bot

export interface Market {
  symbol: string;
  label: string;
  is1s: boolean;
}

export const MARKETS: Market[] = [
  { symbol: "1HZ10V", label: "Vol 10 (1s)", is1s: true },
  { symbol: "1HZ25V", label: "Vol 25 (1s)", is1s: true },
  { symbol: "1HZ50V", label: "Vol 50 (1s)", is1s: true },
  { symbol: "1HZ75V", label: "Vol 75 (1s)", is1s: true },
  { symbol: "1HZ100V", label: "Vol 100 (1s)", is1s: true },
  { symbol: "R_10", label: "Vol 10", is1s: false },
  { symbol: "R_25", label: "Vol 25", is1s: false },
  { symbol: "R_50", label: "Vol 50", is1s: false },
  { symbol: "R_75", label: "Vol 75", is1s: false },
  { symbol: "R_100", label: "Vol 100", is1s: false },
];

export const TICKS_REQUIRED = 20;

export const TICK_DURATIONS = [
  { label: "1 tick", ticks: 1 },
  { label: "2 ticks", ticks: 2 },
  { label: "3 ticks", ticks: 3 },
  { label: "4 ticks", ticks: 4 },
  { label: "5 ticks", ticks: 5 },
  { label: "6 ticks", ticks: 6 },
  { label: "7 ticks", ticks: 7 },
  { label: "8 ticks", ticks: 8 },
  { label: "9 ticks", ticks: 9 },
  { label: "10 ticks", ticks: 10 },
];

export interface Strategy {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "active" | "disabled" | "new";
  badge?: string;
}

export const STRATEGIES: Strategy[] = [
  { id: "m-pro", name: "M Pro", description: "Even/Odd confidence engine · 10-market auto", icon: "crown", status: "active" },
  { id: "m-digit", name: "M Digit", description: "Adaptive single-digit predictor · EV-optimized", icon: "hash", status: "active", badge: "NEW" },
  { id: "sniper-x", name: "Sniper X", description: "Best over/under pairs · 11-market scan", icon: "crosshair", status: "active" },
  { id: "digit-scanner", name: "Digit Scanner", description: "Probability edge · 10-index scan", icon: "scan", status: "active" },
  { id: "deriv-r1", name: "Deriv R1 Match", description: "Top digit-match auto bot", icon: "sparkles", status: "disabled", badge: "MAINT" },
  { id: "rise-fall", name: "Rise & Fall", description: "Asian up/down · Step Index", icon: "bar-chart", status: "active" },
  { id: "higher-lower", name: "Higher / Lower", description: "Predict price direction vs barrier", icon: "arrow-up-down", status: "active" },
  { id: "over-under", name: "Over / Under", description: "Predict last digit threshold", icon: "chevrons-up-down", status: "active" },
  { id: "antiloss", name: "AntiLoss", description: "Recovery engine", icon: "shield", status: "disabled", badge: "MAINT" },
];

export interface Trade {
  id: string;
  market: string;
  marketLabel: string;
  direction: "EVEN" | "ODD";
  stake: number;
  result: "win" | "loss" | "open" | "pending";
  profit: number;
  timestamp: number;
  contractId?: number;
}

export interface MarketData {
  symbol: string;
  label: string;
  ticksCollected: number;
  evenStrength: number;
  oddStrength: number;
  gap: number;
  stability: number;
  quality: number;
  lastDigits: number[];
  confidence: number;
  direction: "EVEN" | "ODD" | "NEUTRAL";
}

export const DERIV_APP_ID = 119390;
export const DERIV_WS_URL = "wss://ws.binaryws.com/websockets/v3?app_id=119390";
export const DERIV_REST_URL = "https://api.derivws.com";
export const DERIV_OAUTH_URL = "https://auth.deriv.com/oauth2/auth";
