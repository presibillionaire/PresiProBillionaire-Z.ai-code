import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTradingStore } from '@/stores/trading-store'
import { Header, HeroSection } from '@/components/landing/hero'
import { FeatureCards } from '@/components/landing/feature-cards'
import { AuthSection } from '@/components/landing/auth-section'
import { Disclaimer } from '@/components/landing/disclaimer'
import { Footer } from '@/components/shared/footer'
import { DashboardHeader } from '@/components/dashboard/header'
import { StrategySelector } from '@/components/dashboard/strategy-selector'
import { StrategyPanel } from '@/components/dashboard/strategy-panel'
import { AIStrategist } from '@/components/dashboard/ai-strategist'
import { ExecuteButton } from '@/components/dashboard/execute-button'
import { DigitChart } from '@/components/dashboard/digit-chart'
import { MarketScanner } from '@/components/dashboard/market-scanner'
import { TradeHistory } from '@/components/dashboard/trade-history'
import { motion, AnimatePresence } from 'framer-motion'

function LandingView() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712]">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <HeroSection />
        <AuthSection />
        <FeatureCards />
      </main>
      <Disclaimer />
      <Footer />
    </div>
  )
}

function DashboardView() {
  return (
    <div className="min-h-screen flex flex-col bg-[#030712]">
      <DashboardHeader />
      <main className="flex-1 pb-8">
        <StrategySelector />
        <StrategyPanel />
        <AIStrategist />
        <DigitChart />
        <MarketScanner />
        <ExecuteButton />
        <TradeHistory />
      </main>
    </div>
  )
}

function AppContent() {
  const { authStatus } = useTradingStore()
  const isAuthenticated = authStatus === 'authenticated'

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <motion.div
          key="dashboard"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <DashboardView />
        </motion.div>
      ) : (
        <motion.div
          key="landing"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <LandingView />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  )
}
