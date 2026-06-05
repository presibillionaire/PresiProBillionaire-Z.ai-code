
import { AnimatedPopup } from "@/components/shared/animations";

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
    direction === "EVEN" ? "stroke-teal-400"
    : direction === "ODD" ? "stroke-violet-400"
    : "stroke-teal-400";

  const glowColor =
    direction === "EVEN" ? "drop-shadow-[0_0_8px_rgba(20,184,166,0.5)]"
    : direction === "ODD" ? "drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]"
    : "drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]";

  return (
    <AnimatedPopup delay={0}>
      <div className="flex flex-col items-center">
        <svg width="176" height="176" viewBox="0 0 176 176" className="transform -rotate-90">
          <circle cx="88" cy="88" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
          <circle
            cx="88" cy="88" r={radius} fill="none" className={colorClass}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out", filter: glowColor }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] font-medium uppercase tracking-wider text-gray-500">
            {direction === "NEUTRAL" ? "WAIT" : direction}
          </span>
          <span className="text-4xl font-bold text-white tabular-nums leading-none mt-1">
            {confidence}%
          </span>
          <span className="text-[10px] text-gray-400 mt-1">{market}</span>
          <div className={`mt-2 px-2 py-0.5 rounded-full text-[9px] font-medium ${
            status === "LOCKED ON"
              ? "bg-teal-500/10 border border-teal-400/20 text-teal-300"
              : status === "SCANNING"
              ? "bg-teal-500/10 border border-teal-400/20 text-teal-300"
              : "bg-amber-500/10 border border-amber-400/20 text-amber-300"
          }`}>
            {status}
          </div>
        </div>
      </div>
    </AnimatedPopup>
  );
}
