
import { CircuitBoard } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizeMap = {
    sm: { container: "w-6 h-6", icon: 12, text: "text-sm" },
    md: { container: "w-8 h-8", icon: 16, text: "text-xl" },
    lg: { container: "w-10 h-10", icon: 20, text: "text-2xl" },
  };

  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2">
      <div
        className={`${s.container} bg-gradient-to-br from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center`}
        style={{
          animation: "circuit-rock 3s ease-in-out infinite, circuit-glow 2s ease-in-out infinite",
        }}
      >
        <CircuitBoard className={`text-white`} size={s.icon} strokeWidth={2.5} />
      </div>
      <span className={`${s.text} text-white font-bold tracking-tight`}>
        PresiProBillionaire
      </span>
    </div>
  );
}
