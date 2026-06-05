"use client";

interface ConfidenceGaugeProps {
  confidence: number;
  direction: "EVEN" | "ODD" | "NEUTRAL";
  market: string;
  status: string;
}

export function ConfidenceGauge({ confidence, direction, market, status }: ConfidenceGaugeProps) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (confidence / 100) * circumference;

  const colorClass =
    direction === "EVEN"
      ? "stroke-emerald-400"
      : direction === "ODD"
      ? "stroke-violet-400"
      : "stroke-sky-400";

  const glowColor =
    direction === "EVEN"
      ? "drop-shadow-[0_0_6px_rgba(52,211,153,0.4)]"
      : direction === "ODD"
      ? "drop-shadow-[0_0_6px_rgba(167,139,250,0.4)]"
      : "drop-shadow-[0_0_6px_rgba(56,189,248,0.4)]";

  return (
    <div className="flex flex-col items-center">
      <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
        {/* Background ring */}
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="8"
        />
        {/* Confidence ring */}
        <circle
          cx="88"
          cy="88"
          r={radius}
          fill="none"
          className={colorClass}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 1s ease-out",
            filter: glowColor,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
          {direction === "NEUTRAL" ? "WAIT" : direction}
        </span>
        <span className="text-4xl font-bold text-white tabular-nums leading-none mt-1">
          {confidence}%
        </span>
        <span className="text-[10px] text-gray-400 mt-1">{market}</span>
        <div
          className={`mt-2 px-2 py-0.5 rounded-full text-[9px] font-medium ${
            status === "LOCKED ON"
              ? "bg-emerald-500/10 border border-emerald-400/20 text-emerald-300"
              : status === "SCANNING"
              ? "bg-blue-500/10 border border-blue-400/20 text-blue-300"
              : "bg-amber-500/10 border border-amber-400/20 text-amber-300"
          }`}
        >
          {status}
        </div>
      </div>
    </div>
  );
}
