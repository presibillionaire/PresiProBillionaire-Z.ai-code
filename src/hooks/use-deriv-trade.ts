import { useCallback } from "react";
import { useTradingStore } from "@/stores/trading-store";

interface BuyRequest {
  buy: number;
  price: number;
  parameters: {
    contract_type: string;
    symbol: string;
    duration: number;
    duration_unit: string;
    basis: string;
    amount: number;
    currency: string;
  };
}

interface BuyResponse {
  msg_type: string;
  buy?: {
    buy_price: number;
    contract_id: number;
    longcode: string;
    payout: number;
    purchase_time: number;
    shortcode: string;
    start_time: number;
    transaction_id: number;
  };
  proposal_open_contract?: {
    contract_id: number;
    buy_price: number;
    payout: number;
    profit: number;
    status: string;
    sell_price?: number;
  };
  error?: { message: string; code: string };
}

const DIRECTION_TO_CONTRACT: Record<string, string> = {
  EVEN: "DIGITEVEN",
  ODD: "DIGITODD",
};

const STRATEGY_TO_CONTRACT: Record<string, Record<string, string>> = {
  "m-pro": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "m-digit": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "sniper-x": { EVEN: "DIGITOVER", ODD: "DIGITUNDER" },
  "digit-scanner": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "rise-fall": { EVEN: "CALL", ODD: "PUT" },
  "higher-lower": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "over-under": { EVEN: "DIGITOVER", ODD: "DIGITUNDER" },
};

function getNextId(ws: WebSocket): number {
  return (ws as any).__msgId || 1;
}

export function useDerivTrade() {
  const store = useTradingStore;

  const executeTrade = useCallback(() => {
    const ws = store.getState()._wsRef;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      store.getState().setStatusMessage("Not connected to Deriv. Cannot execute trade.");
      return;
    }

    const s = store.getState();
    const { direction, mode, stake, tickDuration, selectedMarket, marketData, activeStrategy } = s;
    const currentMarket = marketData[selectedMarket];
    if (!currentMarket || !activeStrategy) return;

    // Determine contract type based on strategy and direction
    const strategyContracts = STRATEGY_TO_CONTRACT[activeStrategy.id] || DIRECTION_TO_CONTRACT;
    let contractType = strategyContracts[direction] || "DIGITEVEN";

    // Apply mode reversal
    if (mode === "reverse") {
      if (contractType === "DIGITEVEN") contractType = "DIGITODD";
      else if (contractType === "DIGITODD") contractType = "DIGITEVEN";
      else if (contractType === "CALL") contractType = "PUT";
      else if (contractType === "PUT") contractType = "CALL";
      else if (contractType === "DIGITOVER") contractType = "DIGITUNDER";
      else if (contractType === "DIGITUNDER") contractType = "DIGITOVER";
    }

    // For DIGITOVER/DIGITUNDER, we need a barrier
    let barrier: string | undefined;
    if (contractType === "DIGITOVER") {
      barrier = "4"; // Over 4
    } else if (contractType === "DIGITUNDER") {
      barrier = "5"; // Under 5
    }

    const buyMsg: Record<string, unknown> = {
      buy: 1,
      price: stake,
      parameters: {
        contract_type: contractType,
        symbol: selectedMarket,
        duration: tickDuration,
        duration_unit: "t",
        basis: "stake",
        amount: stake,
        currency: "USD",
      },
    };

    if (barrier) {
      (buyMsg.parameters as Record<string, unknown>).barrier = barrier;
    }

    store.getState().setIsTrading(true);
    store.getState().setStatusMessage(
      `Placing trade: ${contractType} · ${currentMarket?.label} · ${stake.toFixed(2)} USD`
    );

    // Set up one-time listener for the response
    const handler = (event: MessageEvent) => {
      try {
        const data: BuyResponse = JSON.parse(event.data);

        if (data.msg_type === "buy" && data.buy) {
          // Trade placed successfully
          const buy = data.buy;
          const trade = {
            id: `trade-${buy.contract_id || Date.now()}`,
            market: selectedMarket,
            marketLabel: currentMarket?.label || "Unknown",
            direction: direction as "EVEN" | "ODD",
            stake,
            result: "open" as const,
            profit: 0,
            timestamp: Date.now(),
            contractId: buy.contract_id,
          };
          store.getState().addTrade(trade);
          store.getState().setStatusMessage(
            `Trade opened: ${contractType} · ${buy.contract_id} · ${buy.payout.toFixed(2)} potential payout`
          );

          // Subscribe to contract updates
          ws.send(JSON.stringify({
            proposal_open_contract: 1,
            contract_id: buy.contract_id,
            subscribe: 1,
          }));

          ws.removeEventListener("message", handler);
        }

        if (data.msg_type === "buy" && data.error) {
          store.getState().setStatusMessage(`Trade failed: ${data.error.message}`);
          store.getState().setIsTrading(false);
          ws.removeEventListener("message", handler);
        }

        // Handle contract completion
        if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
          const poc = data.proposal_open_contract;
          if (poc.status === "sold" || poc.status === "lost" || poc.status === "won") {
            const isWin = poc.status === "won" || (poc.profit !== undefined && poc.profit > 0);
            const profit = poc.profit || -(poc.buy_price || stake);

            store.getState().updateTrade(
              `trade-${poc.contract_id}`,
              {
                result: isWin ? "win" : "loss",
                profit: profit,
              }
            );

            const currentPL = store.getState().sessionPL + profit;
            store.getState().setSessionPL(currentPL);

            store.getState().setStatusMessage(
              `Trade ${isWin ? "won" : "lost"}: ${profit >= 0 ? "+" : ""}${profit.toFixed(2)} USD`
            );

            ws.removeEventListener("message", handler);
            store.getState().setIsTrading(false);
          }
        }
      } catch {
        // Parse error
      }
    };

    ws.addEventListener("message", handler);

    // Send the buy request
    ws.send(JSON.stringify(buyMsg));

    // Timeout after 30 seconds
    setTimeout(() => {
      try {
        ws.removeEventListener("message", handler);
        store.getState().setIsTrading(false);
      } catch {
        // Ignore
      }
    }, 30000);
  }, [store]);

  return { executeTrade };
}
