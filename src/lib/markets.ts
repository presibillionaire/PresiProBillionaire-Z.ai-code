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
  winRate: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  bestMarkets: string[];
  howToUse: {
    steps: string[];
    tips: string[];
    recommended: string;
  };
}

export const STRATEGIES: Strategy[] = [
  {
    id: "m-pro",
    name: "M Pro",
    description: "Even/Odd confidence engine across 10 markets",
    icon: "crown",
    status: "active",
    winRate: 78,
    difficulty: "beginner",
    bestMarkets: ["1HZ10V", "1HZ25V", "1HZ75V", "R_10", "R_25"],
    howToUse: {
      steps: [
        "Select M Pro strategy from the strategy panel",
        "Wait for the scanner to collect at least 20 ticks across markets",
        "Check the confidence gauge — look for 70%+ confidence",
        "Choose EVEN or ODD based on the signal direction",
        "Set your stake amount (recommended $1–$5 for beginners)",
        "Click Execute when confidence is high and cooldown is ready",
      ],
      tips: [
        "Best on 1-second Volatility indices",
        "Wait for 3+ confirm cycles before trading",
        "Use Standard mode for trending markets",
      ],
      recommended: "Start with Vol 10 (1s) or Vol 25 (1s) for highest consistency",
    },
  },
  {
    id: "m-digit",
    name: "M Digit",
    description: "Adaptive single-digit predictor with EV optimization",
    icon: "hash",
    status: "active",
    badge: "NEW",
    winRate: 72,
    difficulty: "intermediate",
    bestMarkets: ["1HZ50V", "1HZ75V", "R_50"],
    howToUse: {
      steps: [
        "Select M Digit strategy",
        "Review the Digit Strength chart for the selected market",
        "Look for digits showing 20%+ strength (marked with a star)",
        "Place Over/Under trades based on digit frequency",
        "Use the Reverse toggle if the pattern suggests a reversal",
      ],
      tips: [
        "Focus on digits 0, 4, 5, 9 which show strongest patterns",
        "Set minimum 3 confirm cycles",
        "Works best during high volatility periods",
      ],
      recommended: "Use Vol 50 (1s) or Vol 75 (1s) for reliable digit patterns",
    },
  },
  {
    id: "sniper-x",
    name: "Sniper X",
    description: "Best Over/Under pairs with 11-market deep scan",
    icon: "crosshair",
    status: "active",
    winRate: 75,
    difficulty: "intermediate",
    bestMarkets: ["1HZ25V", "1HZ50V", "R_25", "R_50", "R_75"],
    howToUse: {
      steps: [
        "Select Sniper X strategy",
        "Let the scanner analyze all 10 markets",
        "Look at the Gap and Quality columns in the scanner",
        "Higher gap + higher quality = better trade opportunity",
        "Set direction based on Even/Odd strength comparison",
        "Execute when quality score exceeds 15",
      ],
      tips: [
        "Quality score above 20 indicates strong signal",
        "Trade during active market hours for best results",
        "Use smaller stakes for testing new markets",
      ],
      recommended: "Vol 25 (1s) and Vol 50 (1s) provide the best over/under signals",
    },
  },
  {
    id: "digit-scanner",
    name: "Digit Scanner",
    description: "Probability edge finder across 10 synthetic indices",
    icon: "scan",
    status: "active",
    winRate: 70,
    difficulty: "intermediate",
    bestMarkets: ["1HZ10V", "1HZ25V", "1HZ75V", "1HZ100V"],
    howToUse: {
      steps: [
        "Select Digit Scanner strategy",
        "Monitor the Market Scanner table for high-stability markets",
        "Stability above 80% indicates consistent patterns",
        "Match the Even/Odd direction with the strongest signal",
        "Execute with recommended tick duration of 2–5 ticks",
      ],
      tips: [
        "Higher stability = more predictable outcomes",
        "Avoid trading when stability drops below 60%",
        "Use Take Profit to lock in gains",
      ],
      recommended: "Volatility 10 (1s) has the most consistent digit distribution",
    },
  },
  {
    id: "rise-fall",
    name: "Rise & Fall",
    description: "Asian-style up/down predictions on Step Index",
    icon: "bar-chart",
    status: "active",
    winRate: 73,
    difficulty: "beginner",
    bestMarkets: ["1HZ10V", "1HZ25V", "R_10", "R_25"],
    howToUse: {
      steps: [
        "Select Rise & Fall strategy",
        "Check the confidence gauge for direction signal",
        "Use the market scanner to find trending markets",
        "Set your tick duration (2–5 ticks recommended)",
        "Click Execute to place Rise/Fall trades",
      ],
      tips: [
        "Start with short tick durations (2–3 ticks)",
        "Step Index markets show cleaner trends",
        "Use Standard mode for trend-following",
      ],
      recommended: "Vol 10 (1s) is ideal for Rise & Fall beginners",
    },
  },
  {
    id: "higher-lower",
    name: "Higher / Lower",
    description: "Predict price direction vs a custom barrier",
    icon: "arrow-up-down",
    status: "active",
    winRate: 68,
    difficulty: "advanced",
    bestMarkets: ["R_50", "R_75", "R_100"],
    howToUse: {
      steps: [
        "Select Higher/Lower strategy",
        "Wait for scanner to complete full market analysis",
        "Review market quality scores — only trade markets with quality above 10",
        "Set a barrier price based on current market level",
        "Execute Higher if trend is up, Lower if trend is down",
      ],
      tips: [
        "Only use standard (non-1s) markets for Higher/Lower",
        "Wider barriers have higher win rates but lower payouts",
        "Set longer durations (5+ ticks) for stability",
      ],
      recommended: "Vol 50 and Vol 75 standard markets offer best barrier flexibility",
    },
  },
  {
    id: "over-under",
    name: "Over / Under",
    description: "Predict whether last digit crosses a threshold",
    icon: "chevrons-up-down",
    status: "active",
    winRate: 71,
    difficulty: "intermediate",
    bestMarkets: ["1HZ50V", "1HZ75V", "1HZ100V", "R_50"],
    howToUse: {
      steps: [
        "Select Over/Under strategy",
        "Check Digit Strength chart for digits above/below your threshold",
        "Set threshold to a digit that has shown high frequency",
        "If digit 4–9 appear most, place Over 4 trades",
        "Use Reverse mode if you see a digit shift pattern",
      ],
      tips: [
        "Threshold at digit 4 or 5 gives the best statistical edge",
        "Monitor digit distribution changes during session",
        "Combine with confirm cycles for higher accuracy",
      ],
      recommended: "Vol 75 (1s) and Vol 100 (1s) show clear digit distribution patterns",
    },
  },
  {
    id: "deriv-r1",
    name: "Deriv R1 Match",
    description: "Top digit-match auto bot",
    icon: "sparkles",
    status: "disabled",
    badge: "MAINT",
    winRate: 0,
    difficulty: "advanced",
    bestMarkets: [],
    howToUse: {
      steps: ["This strategy is currently under maintenance"],
      tips: ["Check back soon for updates"],
      recommended: "Use M Pro or Sniper X as alternatives while this is being updated",
    },
  },
  {
    id: "antiloss",
    name: "AntiLoss",
    description: "Smart recovery engine for drawdown protection",
    icon: "shield",
    status: "disabled",
    badge: "MAINT",
    winRate: 0,
    difficulty: "advanced",
    bestMarkets: [],
    howToUse: {
      steps: ["This strategy is currently under maintenance"],
      tips: ["Check back soon for updates"],
      recommended: "Use proper risk management with Take Profit settings in the meantime",
    },
  },
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
