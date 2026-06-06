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

export const TICKS_REQUIRED = 5;

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

export const STRATEGIES: Strategy[] = [
  {
    id: "m-pro",
    name: "M Pro",
    description: "Multi-market Even/Odd scanner that analyzes all 10 Deriv indices simultaneously to find the strongest even or odd bias",
    icon: "crown",
    status: "active",
    winRate: 78,
    difficulty: "beginner",
    bestMarkets: ["1HZ10V", "1HZ25V", "1HZ75V", "R_10", "R_25"],
    howToUse: {
      steps: [
        "Select M Pro from the strategy selector grid on the dashboard",
        "Wait for the WebSocket to connect — watch for the green live indicator in the header",
        "Allow the scanner to collect at least 20 ticks per market (progress shown below the selector)",
        "Review the Market Scanner table to see which markets have the highest quality scores and largest gaps",
        "Check the confidence gauge in the Strategy Panel — look for readings above 70%",
        "Set your preferred direction: EVEN if even strength is dominant, ODD if odd strength leads",
        "Adjust your stake amount in the Settings panel (recommended $1–$5 for beginners)",
        "Click Execute when confidence is high, cooldown is ready, and the live indicator is green",
      ],
      tips: [
        "Best performance on 1-second Volatility indices (1HZ10V, 1HZ25V) due to rapid tick flow",
        "Wait for at least 3+ confirm cycles (stable confidence readings) before placing trades",
        "Use Standard mode when the even/odd gap is widening, Reverse mode when it starts narrowing",
        "Vol 10 (1s) typically produces the most consistent even/odd patterns with lower volatility",
        "Start with Take Profit set to $20–$50 to lock in gains and manage session risk",
      ],
      recommended: "Begin with Vol 10 (1s) and Vol 25 (1s) — these indices offer the most predictable digit distributions for even/odd analysis, making them ideal for building confidence with the M Pro strategy.",
    },
  },
  {
    id: "m-digit",
    name: "M Digit",
    description: "Adaptive single-digit predictor that identifies which specific digits (0–9) are appearing most frequently in real-time tick streams",
    icon: "hash",
    status: "active",
    badge: "NEW",
    winRate: 72,
    difficulty: "intermediate",
    bestMarkets: ["1HZ50V", "1HZ75V", "R_50"],
    howToUse: {
      steps: [
        "Select M Digit from the strategy card grid on the dashboard",
        "Ensure the WebSocket is connected and ticks are flowing (green indicator in header)",
        "Monitor the Digit Strength chart to see real-time frequency distribution of digits 0–9",
        "Identify digits showing 15%+ strength (the tallest bars) — these are appearing above random probability",
        "Use Over/Under trades to capitalize on high-frequency digits: Over 4 if 5–9 dominate, Under 5 if 0–4 dominate",
        "Set tick duration to 2–5 ticks for optimal signal capture on 1-second markets",
        "Enable Reverse mode if the digit distribution suddenly shifts to the opposite range",
        "Execute when the digit chart shows a clear dominant digit pattern with a starred top digit",
      ],
      tips: [
        "Focus on digits 0, 4, 5, and 9 which statistically show the strongest recurring patterns on synthetic indices",
        "The Digit Strength chart updates with every tick — wait for 50+ collected ticks before making decisions",
        "Works best during high-activity periods when tick flow is dense and patterns are more pronounced",
        "Use confirm cycles set to 3+ to ensure the digit pattern is stable, not just a temporary spike",
        "Combine with the Market Scanner quality scores — only trade on markets with quality above 12",
      ],
      recommended: "Vol 50 (1s) and Vol 75 (1s) provide the most reliable digit frequency patterns due to their balanced volatility profile — not too smooth (like Vol 10) and not too chaotic (like Vol 100).",
    },
  },
  {
    id: "sniper-x",
    name: "Sniper X",
    description: "Deep-scan Over/Under finder that performs intensive multi-market analysis to pinpoint optimal digit threshold trades with the highest probability edge",
    icon: "crosshair",
    status: "active",
    winRate: 75,
    difficulty: "intermediate",
    bestMarkets: ["1HZ25V", "1HZ50V", "R_25", "R_50", "R_75"],
    howToUse: {
      steps: [
        "Select Sniper X from the strategy card grid on the dashboard",
        "Let the scanner collect ticks across all 10 markets — at least 20 per market recommended",
        "Open the Market Scanner and sort by Quality column — Sniper X performs best on quality scores above 15",
        "Examine the Gap column: larger gaps indicate stronger digit distribution biases suitable for Over/Under",
        "When a market shows consistent even/odd strength above 55%, that's your signal direction",
        "Set direction to EVEN for DIGITOVER contracts or ODD for DIGITUNDER based on your analysis",
        "Use Standard mode for trending markets and Reverse mode when you detect a distribution reversal",
        "Execute when quality > 15, gap > 8, and the confidence gauge reads above 65%",
      ],
      tips: [
        "Quality score above 20 combined with gap above 10 indicates an extremely strong Over/Under opportunity",
        "Trade during active market hours (typically 8AM–8PM UTC) for best tick density and clearer patterns",
        "Use smaller stakes ($1–$2) when testing Sniper X on new markets to understand their behavior",
        "The best Over/Under threshold is typically digit 4 (Over 4) or digit 5 (Under 5) for balanced probability",
        "Monitor the stability metric — values above 70% mean the pattern has persisted across multiple tick windows",
      ],
      recommended: "Vol 25 (1s) and Vol 50 (1s) are Sniper X's top picks — they offer the ideal balance of tick speed and distribution volatility for precise Over/Under entries.",
    },
  },
  {
    id: "digit-scanner",
    name: "Digit Scanner",
    description: "Probability edge scanner that detects statistical anomalies in digit distributions across all 10 synthetic indices to find exploitable trading opportunities",
    icon: "scan",
    status: "active",
    winRate: 70,
    difficulty: "intermediate",
    bestMarkets: ["1HZ10V", "1HZ25V", "1HZ75V", "1HZ100V"],
    howToUse: {
      steps: [
        "Select Digit Scanner from the strategy card grid on the dashboard",
        "Ensure WebSocket connection is live (green dot in header) and ticks are streaming",
        "Monitor the Market Scanner table for markets showing high stability values (80%+ preferred)",
        "High stability means the even/odd ratio has been consistent across multiple tick windows",
        "Match your trade direction with the dominant even or odd strength reading in the scanner",
        "Set tick duration to 3–5 ticks for a balance between signal quality and exposure time",
        "Use the confidence gauge as your primary decision tool — only trade when confidence exceeds 60%",
        "Execute with proper risk management: never risk more than 2% of your account balance per trade",
      ],
      tips: [
        "Stability above 80% is the key indicator — it means the current digit pattern is not random noise",
        "Avoid trading when stability drops below 60% as the market distribution is unpredictable",
        "Set Take Profit to $30–$50 per session and stop trading once reached to protect your gains",
        "Digit Scanner works particularly well after market opens when fresh distribution patterns form",
        "Use the cooldown setting of 5–10 seconds between trades to avoid overtrading during volatile periods",
      ],
      recommended: "Volatility 10 (1s) has the most consistent digit distribution, making it the top pick for Digit Scanner. Vol 25 (1s) and Vol 75 (1s) are strong alternatives when Vol 10 shows low quality scores.",
    },
  },
  {
    id: "rise-fall",
    name: "Rise & Fall",
    description: "Direction prediction engine that analyzes tick momentum to determine whether the next price movement will be upward (Rise) or downward (Fall)",
    icon: "bar-chart",
    status: "active",
    winRate: 73,
    difficulty: "beginner",
    bestMarkets: ["1HZ10V", "1HZ25V", "R_10", "R_25"],
    howToUse: {
      steps: [
        "Select Rise & Fall from the strategy card grid on the dashboard",
        "Verify the WebSocket is connected and the live indicator is showing green",
        "Watch the Digit Chart for your selected market — while Rise & Fall uses direction, digit patterns can indicate momentum shifts",
        "Check the Market Scanner for markets showing strong directional bias (high quality + clear even/odd lean)",
        "Rise corresponds to EVEN direction, Fall corresponds to ODD direction in the Strategy Panel",
        "Set tick duration to 2–3 ticks for short momentum trades, 5+ ticks for stronger trend captures",
        "Use Standard mode when the market is trending clearly, Reverse when you detect a momentum reversal",
        "Execute when confidence is above 65% and the market shows consistent directional movement",
      ],
      tips: [
        "Start with short tick durations (2–3 ticks) to minimize exposure and build trading confidence",
        "1-second Volatility indices (Vol 10, Vol 25) show cleaner short-term trends than standard markets",
        "Standard mode is recommended for trend-following — Reverse mode should be used sparingly",
        "Monitor the session P/L display — if you hit -3 consecutive losses, take a break before continuing",
        "Vol 10 (1s) is the most beginner-friendly market for Rise & Fall due to its lower volatility and smoother movements",
      ],
      recommended: "Vol 10 (1s) is the ideal starting market for Rise & Fall beginners — its lower volatility produces cleaner directional signals. Move to Vol 25 (1s) once you're comfortable with the strategy mechanics.",
    },
  },
  {
    id: "higher-lower",
    name: "Higher / Lower",
    description: "Barrier-based prediction bot that determines whether the next price will be higher or lower than a dynamically calculated barrier level",
    icon: "arrow-up-down",
    status: "active",
    winRate: 68,
    difficulty: "advanced",
    bestMarkets: ["R_50", "R_75", "R_100"],
    howToUse: {
      steps: [
        "Select Higher / Lower from the strategy card grid on the dashboard",
        "Wait for the scanner to complete full analysis — Higher/Lower requires stable tick data",
        "Review Market Scanner quality scores — only trade on markets with quality above 10",
        "Select a standard (non-1s) market: Vol 50, Vol 75, or Vol 100 are recommended",
        "Analyze the digit distribution to gauge current market direction — use as a trend proxy",
        "Set direction to EVEN (Higher) if even strength dominates, ODD (Lower) if odd strength leads",
        "Set longer durations (5+ ticks) as Higher/Lower performs better with extended observation windows",
        "Execute when the market has been consistently trending in one direction for 10+ ticks",
      ],
      tips: [
        "Only use standard (non-1s) volatility markets — Higher/Lower is not effective on 1-second indices",
        "Wider barriers (further from current price) have higher win rates but significantly lower payouts",
        "Set tick duration to 5–10 ticks for the best balance between accuracy and payout",
        "Avoid trading during the first 30 seconds of connecting — let tick data stabilize first",
        "Vol 50 and Vol 75 standard markets offer the best combination of barrier flexibility and pattern consistency",
      ],
      recommended: "Vol 50 and Vol 75 standard markets (R_50, R_75) are the top choices — they offer sufficient price movement for barrier-based predictions while maintaining enough consistency for reliable analysis.",
    },
  },
  {
    id: "over-under",
    name: "Over / Under",
    description: "Digit threshold predictor that determines whether the last digit of the next tick will be above or below a configurable threshold value",
    icon: "chevrons-up-down",
    status: "active",
    winRate: 71,
    difficulty: "intermediate",
    bestMarkets: ["1HZ50V", "1HZ75V", "1HZ100V", "R_50"],
    howToUse: {
      steps: [
        "Select Over / Under from the strategy card grid on the dashboard",
        "Verify WebSocket connection is live and ticks are streaming to all markets",
        "Check the Digit Strength chart to see which digit range is dominant (0–4 vs 5–9)",
        "If digits 5–9 appear more frequently (above 55%), place Over 4 trades",
        "If digits 0–4 appear more frequently (above 55%), place Under 5 trades",
        "Set your direction: EVEN for Over contracts, ODD for Under contracts",
        "Monitor the digit distribution in real-time — patterns can shift every 20–30 ticks",
        "Execute when you see a sustained bias with confirm cycles at 3+ and confidence above 62%",
      ],
      tips: [
        "Setting the threshold at digit 4 (Over 4) or digit 5 (Under 5) provides the best statistical edge — roughly 50/50 with a slight house edge",
        "Monitor digit distribution changes throughout your session — what worked an hour ago may have shifted",
        "Combine with confirm cycles set to 3 or higher for the most accurate threshold predictions",
        "Over/Under trades on Vol 75 (1s) tend to have the clearest distribution patterns during active hours",
        "Use Take Profit to lock in gains — Over/Under can be streaky, so securing profits at $30–$50 per session is recommended",
      ],
      recommended: "Vol 75 (1s) and Vol 100 (1s) show the clearest digit distribution patterns for Over/Under analysis. Their higher volatility produces more pronounced digit biases, making threshold predictions more reliable.",
    },
  },
  {
    id: "deriv-r1",
    name: "Deriv R1 Match",
    description: "Advanced digit-match auto bot that predicts exact digit matches using proprietary algorithmic analysis",
    icon: "sparkles",
    status: "disabled",
    badge: "MAINT",
    winRate: 0,
    difficulty: "advanced",
    bestMarkets: [],
    howToUse: {
      steps: ["This strategy is currently under maintenance and being rebuilt with improved algorithms"],
      tips: ["Check back in the next update for the enhanced Deriv R1 Match experience"],
      recommended: "Use M Pro or Sniper X as alternatives while Deriv R1 Match is being upgraded with new pattern recognition capabilities.",
    },
  },
  {
    id: "antiloss",
    name: "AntiLoss",
    description: "Smart recovery engine that activates drawdown protection using martingale-based position sizing and loss recovery algorithms",
    icon: "shield",
    status: "disabled",
    badge: "MAINT",
    winRate: 0,
    difficulty: "advanced",
    bestMarkets: [],
    howToUse: {
      steps: ["This strategy is currently under maintenance and being redesigned with improved risk controls"],
      tips: ["Use proper risk management with Take Profit settings in other strategies while AntiLoss is being updated"],
      recommended: "Use the Take Profit setting in M Pro, Sniper X, or other active strategies to manage drawdowns while AntiLoss is undergoing its redesign.",
    },
  },
];
