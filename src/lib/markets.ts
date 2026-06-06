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
    name: "Quantum Sweep",
    description: "Multi-market Even/Odd scanner that analyzes all 10 Deriv indices simultaneously to find the strongest even or odd bias",
    icon: "crown",
    status: "active",
    winRate: 78,
    difficulty: "beginner",
    bestMarkets: ["1HZ10V", "1HZ25V", "1HZ75V", "R_10", "R_25"],
    howToUse: {
      steps: [
        "Select Quantum Sweep from the strategy selector grid on the dashboard",
        "Wait for the WebSocket to connect — watch for the green live indicator in the header",
        "Open Settings (gear icon) to configure: set Stake Size % (e.g. 75%), Target Profit $ (e.g. $20), and Cooldown (e.g. 5s)",
        "Enable AUTO TRADE — the bot will only place trades when confidence reaches the threshold you set (e.g. 50%)",
        "Review the Market Scanner table to see which markets have the highest quality scores and largest gaps",
        "Check the confidence gauge — look for readings above your auto-trade threshold",
        "Set your preferred direction: EVEN if even strength is dominant, ODD if odd strength leads",
        "Enable MARTINGALE if you want stakes to automatically increase after consecutive losses (stake × multiplier)",
        "Optionally enable REINVEST PROFITS to compound your session gains into each new trade stake",
        "Watch the Session PnL progress bar — when it hits your Target Profit, auto-trade stops and a celebration triggers!",
      ],
      tips: [
        "Best performance on 1-second Volatility indices (1HZ10V, 1HZ25V) due to rapid tick flow",
        "Use AUTO TRADE with a confidence threshold of 50%+ for consistent hands-free trading",
        "MARTINGALE with ×2 multiplier recovers losses quickly but increases risk — use with caution",
        "Enable REINVEST PROFITS at 50% to grow your stake as profits accumulate — compound your gains",
        "Set Target Profit to $20–$50 per session to lock in gains and manage session risk",
        "Use Standard mode when the even/odd gap is widening, Reverse mode when it starts narrowing",
        "Vol 10 (1s) typically produces the most consistent even/odd patterns with lower volatility",
      ],
      recommended: "Begin with Vol 10 (1s) and Vol 25 (1s) — these indices offer the most predictable digit distributions. Set Stake Size to 75%, Target Profit to $20, Confidence Threshold to 50%, and enable AUTO TRADE for the best Quantum Sweep experience.",
    },
  },
  {
    id: "m-digit",
    name: "Digit Matrix",
    description: "Adaptive single-digit predictor that identifies which specific digits (0–9) are appearing most frequently in real-time tick streams",
    icon: "hash",
    status: "active",
    badge: "NEW",
    winRate: 72,
    difficulty: "intermediate",
    bestMarkets: ["1HZ50V", "1HZ75V", "R_50"],
    howToUse: {
      steps: [
        "Select Digit Matrix from the strategy card grid on the dashboard",
        "Ensure the WebSocket is connected and ticks are flowing (green indicator in header)",
        "Open Settings and configure your Stake Size %, Target Profit $, and Cooldown",
        "Set the AUTO TRADE Confidence Threshold to 55%+ — Digit Matrix needs stronger signals since it tracks individual digits",
        "Monitor the Digit Strength chart to see real-time frequency distribution of digits 0–9",
        "Identify digits showing 15%+ strength (the tallest bars) — these are appearing above random probability",
        "Use Over/Under trades to capitalize on high-frequency digits: Over 4 if 5–9 dominate, Under 5 if 0–4 dominate",
        "Enable MARTINGALE with ×2 if you want automatic loss recovery, or REINVEST PROFITS to compound gains",
        "Set tick duration to 2–5 ticks for optimal signal capture on 1-second markets",
        "Enable AUTO TRADE and let the bot execute when digit patterns align with your threshold",
      ],
      tips: [
        "Focus on digits 0, 4, 5, and 9 which statistically show the strongest recurring patterns on synthetic indices",
        "The Digit Strength chart updates with every tick — wait for 50+ collected ticks before enabling AUTO TRADE",
        "Set Confidence Threshold to 60%+ for safer auto-trading with Digit Matrix — digit patterns can shift quickly",
        "Enable REINVEST PROFITS at 50% to maximize compound growth during strong digit trends",
        "Works best during high-activity periods when tick flow is dense and patterns are more pronounced",
        "Combine with the Market Scanner quality scores — only trade on markets with quality above 12",
      ],
      recommended: "Vol 50 (1s) and Vol 75 (1s) provide the most reliable digit frequency patterns. Set Stake Size to 60%, Confidence Threshold to 60%, and enable AUTO TRADE with MARTINGALE ×2 for optimal Digit Matrix results.",
    },
  },
  {
    id: "sniper-x",
    name: "Neural Strike",
    description: "Deep-scan Over/Under finder that performs intensive multi-market analysis to pinpoint optimal digit threshold trades with the highest probability edge",
    icon: "crosshair",
    status: "active",
    winRate: 75,
    difficulty: "intermediate",
    bestMarkets: ["1HZ25V", "1HZ50V", "R_25", "R_50", "R_75"],
    howToUse: {
      steps: [
        "Select Neural Strike from the strategy card grid on the dashboard",
        "Let the scanner collect ticks across all 10 markets — at least 5 per market (happens fast with 1s indices)",
        "Open Settings: set Stake Size % to 60%, Target Profit $ to $30, Cooldown to 5–8s",
        "Set AUTO TRADE Confidence Threshold to 55% — Neural Strike needs quality signals before firing",
        "Open the Market Scanner and sort by Quality column — Neural Strike performs best on quality scores above 15",
        "Examine the Gap column: larger gaps indicate stronger digit distribution biases for Over/Under",
        "When a market shows consistent even/odd strength above 55%, that's your signal direction",
        "Set direction to EVEN for DIGITOVER contracts or ODD for DIGITUNDER based on your analysis",
        "Enable MARTINGALE with ×2 or ×3 for aggressive loss recovery on Over/Under trades",
        "Enable AUTO TRADE — the bot will wait for quality > 15, gap > 8, and confidence above your threshold before executing",
      ],
      tips: [
        "Quality score above 20 combined with gap above 10 indicates an extremely strong Over/Under opportunity",
        "Trade during active market hours (typically 8AM–8PM UTC) for best tick density and clearer patterns",
        "Use smaller Stake Size % (40–50%) when testing Neural Strike — Over/Under can have higher variance",
        "MARTINGALE ×2 recovers quickly on Neural Strike but cap at 3 consecutive doublings to manage risk",
        "The best Over/Under threshold is typically digit 4 (Over 4) or digit 5 (Under 5) for balanced probability",
        "Monitor the stability metric — values above 70% mean the pattern has persisted across multiple tick windows",
        "Enable REINVEST PROFITS at 30% to modestly compound wins without overexposing your balance",
      ],
      recommended: "Vol 25 (1s) and Vol 50 (1s) are Neural Strike's top picks. Set Stake Size 60%, Confidence Threshold 55%, Target Profit $30, enable AUTO TRADE with MARTINGALE ×2 for the best Over/Under experience.",
    },
  },
  {
    id: "digit-scanner",
    name: "Spectrum Edge",
    description: "Probability edge scanner that detects statistical anomalies in digit distributions across all 10 synthetic indices to find exploitable trading opportunities",
    icon: "scan",
    status: "active",
    winRate: 70,
    difficulty: "intermediate",
    bestMarkets: ["1HZ10V", "1HZ25V", "1HZ75V", "1HZ100V"],
    howToUse: {
      steps: [
        "Select Spectrum Edge from the strategy card grid on the dashboard",
        "Ensure WebSocket connection is live (green dot in header) and ticks are streaming",
        "Open Settings: set Stake Size % to 50%, Target Profit $ to $40, and Cooldown to 8–10s",
        "Set AUTO TRADE Confidence Threshold to 60% — Spectrum Edge prioritizes stability over speed",
        "Monitor the Market Scanner table for markets showing high stability values (80%+ preferred)",
        "High stability means the even/odd ratio has been consistent across multiple tick windows",
        "Match your trade direction with the dominant even or odd strength reading in the scanner",
        "Enable MARTINGALE to protect against streak losses when stability temporarily drops",
        "Enable REINVEST PROFITS at 50% — Spectrum Edge's consistency makes it ideal for compounding",
        "Enable AUTO TRADE and let the bot execute only when confidence exceeds your threshold with stable patterns",
      ],
      tips: [
        "Stability above 80% is the key indicator — it means the current digit pattern is not random noise",
        "Set Confidence Threshold to 65%+ for conservative auto-trading — only trade the strongest anomalies",
        "Avoid trading when stability drops below 60% as the market distribution is unpredictable",
        "Set Target Profit to $30–$50 per session and stop trading once reached — Spectrum Edge is consistent",
        "MARTINGALE ×2 works well here since the high stability means losses tend to be isolated, not streaky",
        "Spectrum Edge works particularly well after market opens when fresh distribution patterns form",
        "Use the cooldown setting of 8–10 seconds between trades to avoid overtrading during volatile periods",
      ],
      recommended: "Volatility 10 (1s) has the most consistent digit distribution, making it the top pick for Spectrum Edge. Set Stake Size 50%, Confidence Threshold 65%, Target Profit $40, enable AUTO TRADE with MARTINGALE ×2 and REINVEST 50% for hands-free profits.",
    },
  },
  {
    id: "rise-fall",
    name: "Velocity Tracker",
    description: "Direction prediction engine that analyzes tick momentum to determine whether the next price movement will be upward (Rise) or downward (Fall)",
    icon: "bar-chart",
    status: "active",
    winRate: 73,
    difficulty: "beginner",
    bestMarkets: ["1HZ10V", "1HZ25V", "R_10", "R_25"],
    howToUse: {
      steps: [
        "Select Velocity Tracker from the strategy card grid on the dashboard",
        "Verify the WebSocket is connected and the live indicator is showing green",
        "Open Settings: set Stake Size % to 75%, Target Profit $ to $20, and Cooldown to 3–5s",
        "Set AUTO TRADE Confidence Threshold to 45% — Velocity Tracker is great for beginners with faster signals",
        "Watch the Digit Chart for your selected market — digit patterns can indicate momentum shifts",
        "Check the Market Scanner for markets showing strong directional bias (high quality + clear even/odd lean)",
        "Rise corresponds to EVEN direction, Fall corresponds to ODD direction in the Strategy Panel",
        "Set tick duration to 2–3 ticks for short momentum trades, 5+ ticks for stronger trend captures",
        "Use Standard mode when the market is trending clearly, Reverse when you detect a momentum reversal",
        "Enable AUTO TRADE — the bot will execute Rise/Fall trades automatically when confidence hits your threshold",
      ],
      tips: [
        "Start with short tick durations (2–3 ticks) to minimize exposure and build trading confidence",
        "Set Confidence Threshold to 40–50% for frequent auto-trade entries — Velocity Tracker is designed for speed",
        "1-second Volatility indices (Vol 10, Vol 25) show cleaner short-term trends than standard markets",
        "MARTINGALE ×2 is recommended for Velocity Tracker since short-duration trades settle quickly, limiting exposure",
        "Standard mode is recommended for trend-following — Reverse mode should be used sparingly",
        "Monitor the session P/L display — if you hit 3 consecutive losses, consider raising your Confidence Threshold",
        "Vol 10 (1s) is the most beginner-friendly market due to its lower volatility and smoother movements",
      ],
      recommended: "Vol 10 (1s) is the ideal starting market for Velocity Tracker beginners. Set Stake Size 75%, Confidence Threshold 45%, Target Profit $20, enable AUTO TRADE with MARTINGALE ×2 for quick recovery — perfect for learning automated trading.",
    },
  },
  {
    id: "higher-lower",
    name: "Horizon Pro",
    description: "Barrier-based prediction bot that determines whether the next price will be higher or lower than a dynamically calculated barrier level",
    icon: "arrow-up-down",
    status: "active",
    winRate: 68,
    difficulty: "advanced",
    bestMarkets: ["R_50", "R_75", "R_100"],
    howToUse: {
      steps: [
        "Select Horizon Pro from the strategy card grid on the dashboard",
        "Wait for the scanner to complete full analysis — Horizon Pro requires stable tick data",
        "Open Settings: set Stake Size % to 40%, Target Profit $ to $50, and Cooldown to 10–15s",
        "Set AUTO TRADE Confidence Threshold to 65%+ — Horizon Pro trades on standard markets with longer windows",
        "Review Market Scanner quality scores — only trade on markets with quality above 10",
        "Select a standard (non-1s) market: Vol 50, Vol 75, or Vol 100 are recommended",
        "Analyze the digit distribution to gauge current market direction — use as a trend proxy",
        "Set direction to EVEN (Higher) if even strength dominates, ODD (Lower) if odd strength leads",
        "Set longer durations (5+ ticks) as Horizon Pro performs better with extended observation windows",
        "Enable MARTINGALE with ×2 and REINVEST at 40% — Horizon Pro's higher payout rewards patience",
        "Enable AUTO TRADE — the bot executes only after the market has trended consistently for 10+ ticks",
      ],
      tips: [
        "Only use standard (non-1s) volatility markets — Horizon Pro is not effective on 1-second indices",
        "Set Confidence Threshold to 70%+ for Horizon Pro — the wider barriers need stronger confirmation",
        "Wider barriers have higher win rates but lower payouts — use higher Stake Size % to compensate",
        "MARTINGALE ×2.5 works well for Horizon Pro since win rates are higher but losses hit harder",
        "Set tick duration to 5–10 ticks for the best balance between accuracy and payout",
        "Avoid trading during the first 30 seconds of connecting — let tick data stabilize first",
        "Enable REINVEST PROFITS at 40% to grow your stake from Horizon Pro's consistent wins",
      ],
      recommended: "Vol 50 and Vol 75 standard markets (R_50, R_75) are the top choices for Horizon Pro. Set Stake Size 40%, Confidence Threshold 70%, Target Profit $50, enable AUTO TRADE with MARTINGALE ×2.5 and REINVEST 40% for advanced barrier trading.",
    },
  },
  {
    id: "over-under",
    name: "Pivot Line",
    description: "Digit threshold predictor that determines whether the last digit of the next tick will be above or below a configurable threshold value",
    icon: "chevrons-up-down",
    status: "active",
    winRate: 71,
    difficulty: "intermediate",
    bestMarkets: ["1HZ50V", "1HZ75V", "1HZ100V", "R_50"],
    howToUse: {
      steps: [
        "Select Pivot Line from the strategy card grid on the dashboard",
        "Verify WebSocket connection is live and ticks are streaming to all markets",
        "Open Settings: set Stake Size % to 60%, Target Profit $ to $30, and Cooldown to 5–8s",
        "Set AUTO TRADE Confidence Threshold to 55% — Pivot Line needs clear digit distribution before firing",
        "Check the Digit Strength chart to see which digit range is dominant (0–4 vs 5–9)",
        "If digits 5–9 appear more frequently (above 55%), place Over 4 trades",
        "If digits 0–4 appear more frequently (above 55%), place Under 5 trades",
        "Set your direction: EVEN for Over contracts, ODD for Under contracts",
        "Monitor the digit distribution in real-time — patterns can shift every 20–30 ticks",
        "Enable MARTINGALE ×2 and REINVEST 50% — Pivot Line can have streaks that benefit from compounding",
        "Enable AUTO TRADE — the bot waits for a sustained bias and confidence above your threshold before executing",
      ],
      tips: [
        "Setting the threshold at digit 4 (Over 4) or digit 5 (Under 5) provides the best statistical edge",
        "Set Confidence Threshold to 55%+ and let AUTO TRADE wait for clear distribution biases",
        "MARTINGALE ×2 is ideal for Pivot Line since digit threshold trades have near-50/50 odds — losses are recoverable",
        "Enable REINVEST PROFITS at 50% — Pivot Line's moderate win rate benefits significantly from compounding",
        "Monitor digit distribution changes throughout your session — what worked an hour ago may have shifted",
        "Combine with confirm cycles set to 3 or higher for the most accurate threshold predictions",
        "Use Target Profit of $30–$50 per session — Pivot Line can be streaky, so lock in gains consistently",
      ],
      recommended: "Vol 75 (1s) and Vol 100 (1s) show the clearest digit distribution patterns for Pivot Line analysis. Set Stake Size 60%, Confidence Threshold 55%, Target Profit $30, enable AUTO TRADE with MARTINGALE ×2 and REINVEST 50% for reliable threshold trading.",
    },
  },
  {
    id: "deriv-r1",
    name: "Precision Match",
    description: "Advanced digit-match auto bot that predicts exact digit matches using proprietary algorithmic analysis",
    icon: "sparkles",
    status: "disabled",
    badge: "MAINT",
    winRate: 0,
    difficulty: "advanced",
    bestMarkets: [],
    howToUse: {
      steps: [
        "This strategy is currently under maintenance and being rebuilt with improved algorithms",
        "The new Precision Match will support AUTO TRADE with configurable confidence thresholds",
        "It will integrate with the MARTINGALE and REINVEST system for automated position management",
        "When it returns, it will include a dedicated digit-match confidence scoring engine",
      ],
      tips: [
        "Check back in the next update for the enhanced Precision Match experience",
        "While waiting, use Quantum Sweep or Neural Strike with AUTO TRADE, MARTINGALE ×2, and REINVEST 50% enabled",
      ],
      recommended: "Use Quantum Sweep or Neural Strike as alternatives while Precision Match is being upgraded with new pattern recognition capabilities. Both support full AUTO TRADE with confidence threshold, martingale, and reinvest features.",
    },
  },
  {
    id: "antiloss",
    name: "Sentinel Guard",
    description: "Smart recovery engine that activates drawdown protection using martingale-based position sizing and loss recovery algorithms",
    icon: "shield",
    status: "disabled",
    badge: "MAINT",
    winRate: 0,
    difficulty: "advanced",
    bestMarkets: [],
    howToUse: {
      steps: [
        "This strategy is currently under maintenance and being redesigned with improved risk controls",
        "In the meantime, the built-in MARTINGALE system in all active strategies provides similar loss recovery",
        "Enable MARTINGALE in Settings on any active strategy — it uses configurable Mart × multiplier on consecutive losses",
        "The REINVEST PROFITS toggle also provides passive growth during winning sessions",
      ],
      tips: [
        "While Sentinel Guard is being updated, use the global MARTINGALE toggle (Settings panel) on any active strategy",
        "Set Mart × to 2 for moderate recovery, or ×3 for aggressive recovery — but cap your losses",
        "Always use Target Profit ($) to automatically stop trading and lock in gains",
        "The celebration animation triggers when you hit your target — auto-trade stops to protect your profits",
        "Use Stake Size % to automatically adjust trade size relative to your balance",
      ],
      recommended: "Use the MARTINGALE and REINVEST settings in Quantum Sweep, Neural Strike, or other active strategies while Sentinel Guard is undergoing its redesign. Set Target Profit to protect gains, and Confidence Threshold to control auto-trade entry quality.",
    },
  },
];
