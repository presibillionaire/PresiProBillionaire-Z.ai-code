import { TrendingUp, Layers, Zap } from "lucide-react";
import { StaggerGrid, StaggerItem, AnimatedCard } from "@/components/shared/animations";
import { motion } from "framer-motion";

const features = [
  {
    icon: TrendingUp,
    title: "Live Market Scanning",
    description:
      "Real-time tick streaming from 10 Deriv synthetic indices with instant analysis. Every tick is processed client-side for zero-latency signal detection.",
    gradient: "from-teal-500/20 to-emerald-500/10",
  },
  {
    icon: Layers,
    title: "Multi-Strategy Engine",
    description:
      "7 professional strategies from beginner to advanced with smart signal detection. Each strategy has detailed guides and real-time confidence scoring.",
    gradient: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Zap,
    title: "Zero Latency",
    description:
      "Client-side processing with direct WebSocket connection to Deriv — no server delays. All analysis happens instantly in your browser.",
    gradient: "from-amber-500/20 to-orange-500/10",
  },
];

export function FeatureCards() {
  return (
    <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mt-20">
      {features.map((feature) => (
        <StaggerItem key={feature.title}>
          <AnimatedCard
            className="relative bg-white/[0.03] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-5 sm:p-6 flex flex-col gap-4 hover:border-teal-500/20 transition-all overflow-hidden"
          >
            {/* Gradient accent */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${feature.gradient}`} />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-teal-500/[0.03] to-transparent" />

            <div className="relative w-10 h-10 bg-gray-800/80 border border-white/[0.08] rounded-xl flex items-center justify-center">
              <feature.icon className="text-teal-400" size={20} />
            </div>
            <div className="relative">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1.5">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          </AnimatedCard>
        </StaggerItem>
      ))}
    </StaggerGrid>
  );
}
