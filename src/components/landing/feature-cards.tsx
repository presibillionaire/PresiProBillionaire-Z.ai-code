"use client";

import { TrendingUp, BarChart2, Link2 } from "lucide-react";
import { StaggerGrid, StaggerItem, AnimatedCard } from "@/components/shared/animations";

const features = [
  {
    icon: TrendingUp,
    title: "Rise & Fall Engine",
    description:
      "Executes Rise/Fall trades with clean controls and reliable order flow.",
  },
  {
    icon: BarChart2,
    title: "High-Spec Analysis",
    description:
      "Real-time market reading + confidence view to help you pick smarter entries.",
  },
  {
    icon: Link2,
    title: "Quick Deriv Connect",
    description: "OAuth login — fast and secure.",
  },
];

export function FeatureCards() {
  return (
    <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full mt-20">
      {features.map((feature) => (
        <StaggerItem key={feature.title}>
        <AnimatedCard
          className="bg-gray-900/70 border border-gray-800/60 rounded-xl p-4 sm:p-6 flex flex-col gap-2 sm:gap-4 hover:border-gray-700/60 transition-colors"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800/80 border border-gray-700/50 rounded-lg flex items-center justify-center">
            <feature.icon className="text-teal-400" size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
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
