"use client";

export function Disclaimer() {
  return (
    <section className="px-4 pb-12">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 text-sm text-gray-300">
          <span className="font-medium">Powered by Deriv</span>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden border border-amber-500/25 bg-gradient-to-br from-amber-950/40 to-slate-900/80 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none" />
            <div className="relative px-6 py-5 md:px-8 md:py-6">
              <p className="text-sm text-gray-300 leading-relaxed">
                Deriv offers complex derivatives, such as options and contracts
                for difference (&quot;CFDs&quot;). These products may not be
                suitable for all clients, and trading them puts you at risk.
                Please make sure that you understand the following risks before
                trading Deriv products: a) you may lose some or all of the money
                you invest in the trade, b) if your trade involves currency
                conversion, exchange rates will affect your profit and loss. You
                should never trade with borrowed money or with money that you
                cannot afford to lose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
