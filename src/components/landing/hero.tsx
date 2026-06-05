import { Zap, Play, Activity, Radio } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { SlideUp, AnimatedPopup, FadeIn, GlowPulse, BounceIn } from "@/components/shared/animations";
import { motion } from "framer-motion";

export function Header() {
  return (
    <header className="px-6 py-4 flex items-center justify-between border-b border-white/[0.06] relative z-10">
      <Logo size="md" />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-400/20 rounded-full px-2.5 py-1">
          <Radio size={10} className="text-teal-400" />
          <span className="text-teal-400 text-[10px] font-medium">Live WebSocket</span>
        </div>
      </div>
    </header>
  );
}

export function HeroSection() {
  return (
    <div className="relative flex flex-col items-center text-center max-w-3xl mx-auto overflow-hidden">
      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 30, -20, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-40 w-80 h-80 bg-emerald-500/8 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -30, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-40 left-1/3 w-64 h-64 bg-violet-500/5 rounded-full blur-[80px]"
        />
      </div>

      {/* Animated Badge */}
      <FadeIn delay={0.1} className="flex items-center gap-2 bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-full px-4 py-2 mb-8 shadow-lg shadow-black/10">
        <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
        <Activity className="text-teal-400" size={12} />
        <span className="text-teal-300 text-xs sm:text-sm font-medium">
          AI-Powered Trading Signals
        </span>
      </FadeIn>

      {/* Heading */}
      <AnimatedPopup delay={0.2} className="mb-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
          <span className="block">AI-Powered</span>
          <span className="block bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
            Trading Signals
          </span>
        </h1>
      </AnimatedPopup>

      {/* Subtitle */}
      <SlideUp delay={0.3}>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-3 max-w-xl">
          Real-time Deriv market analysis with multi-strategy signal detection.
          Direct WebSocket connection to 10 synthetic indices.
        </p>
      </SlideUp>
      <SlideUp delay={0.35}>
        <p className="text-gray-600 text-sm mb-10">
          Zero server delays. Client-side processing. Serverless architecture.
        </p>
      </SlideUp>

      {/* Buttons */}
      <SlideUp delay={0.4}>
        <div className="w-full max-w-sm space-y-3">
          {/* OAuth Button */}
          <GlowPulse color="teal">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 40px rgba(20, 184, 166, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-semibold text-base px-8 py-4 rounded-2xl transition-all duration-200 shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Zap size={18} />
              Connect with Deriv OAuth
            </motion.button>
          </GlowPulse>

          {/* Live Stats */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-gray-500 text-xs">10 Live Markets</span>
            </div>
            <div className="w-px h-3 bg-gray-800" />
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">7 Strategies</span>
            </div>
            <div className="w-px h-3 bg-gray-800" />
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs">Zero Latency</span>
            </div>
          </div>
        </div>
      </SlideUp>
    </div>
  );
}
