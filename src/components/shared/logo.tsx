
import { CircuitBoard } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const sizeMap = {
    sm: { container: "w-9 h-9", icon: 18, text: "text-sm" },
    md: { container: "w-11 h-11", icon: 22, text: "text-xl" },
    lg: { container: "w-14 h-14", icon: 28, text: "text-2xl" },
  };

  const s = sizeMap[size];

  return (
    <div className="flex items-center gap-2.5">
      <div
        className={`${s.container} bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center`}
        style={{
          animation: "circuit-rock 3s ease-in-out infinite, circuit-glow 2s ease-in-out infinite",
        }}
      >
        <CircuitBoard className="text-white" size={s.icon} strokeWidth={2} />
      </div>
      <span className={`${s.text} text-white font-bold tracking-tight`}>
        PresiProBillionaire
      </span>
    </div>
  );
}
