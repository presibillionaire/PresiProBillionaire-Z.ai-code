"use client";

import { SlideUp, AnimatedPopup, FadeIn, PageTransition, AnimatedPresence } from "@/components/shared/animations";

export function LandingPage({ children }: { children: React.ReactNode }) {
  return (
    <AnimatedPresence>
      <PageTransition>
        {children}
      </PageTransition>
    </AnimatedPresence>
  );
}

export { SlideUp, AnimatedPopup, FadeIn };
