"use client";

import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-800/40 py-4 px-6">
      <div className="flex items-center justify-center gap-3 text-gray-600 text-sm">
        <div className="w-6 h-6 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-md flex items-center justify-center">
          <Zap className="text-white" size={12} strokeWidth={2.5} />
        </div>
        <span className="text-gray-500 font-medium">PresiProBillionaire</span>
        <span className="text-gray-700">•</span>
        <span>Deriv Live Tick Stream</span>
      </div>
    </footer>
  );
}
