import { useCallback } from "react";
import { useTradingStore } from "@/stores/trading-store";

// Deriv WebSocket message types
interface ProposalResponse {
  msg_type: string;
  proposal?: {
    id: string;
    ask_price: number;
    payout: number;
    display_value: string;
    contract_type: string;
    longcode: string;
  };
  error?: { message: string; code: string };
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
    balance_after: number;
  };
  error?: { message: string; code: string };
}

interface ContractUpdate {
  msg_type: string;
  proposal_open_contract?: {
    contract_id: number;
    buy_price: number;
    payout: number;
    profit: number;
    status: string;
    sell_price?: number;
    contract_type: string;
    longcode: string;
  };
}

type WsMessage = ProposalResponse & BuyResponse & ContractUpdate;

// Strategy/direction to Deriv contract type mapping
const STRATEGY_TO_CONTRACT: Record<string, Record<string, string>> = {
  "m-pro": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "m-digit": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "sniper-x": { EVEN: "DIGITOVER", ODD: "DIGITUNDER" },
  "digit-scanner": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "rise-fall": { EVEN: "CALL", ODD: "PUT" },
  "higher-lower": { EVEN: "DIGITEVEN", ODD: "DIGITODD" },
  "over-under": { EVEN: "DIGITOVER", ODD: "DIGITUNDER" },
};

const DEFAULT_CONTRACT: Record<string, string> = {
  EVEN: "DIGITEVEN",
  ODD: "DIGITODD",
};

function getContractType(strategyId: string, direction: string, mode: string): { contractType: string; barrier?: string } {
  const map = STRATEGY_TO_CONTRACT[strategyId] || DEFAULT_CONTRACT;
  let contractType = map[direction] || "DIGITEVEN";

  // Apply mode reversal
  if (mode === "reverse") {
    const reversals: Record<string, string> = {
      DIGITEVEN: "DIGITODD",
      DIGITODD: "DIGITEVEN",
      CALL: "PUT",
      PUT: "CALL",
      DIGITOVER: "DIGITUNDER",
      DIGITUNDER: "DIGITOVER",
      DIGITMATCH: "DIGITDIFF",
      DIGITDIFF: "DIGITMATCH",
    };
    contractType = reversals[contractType] || contractType;
  }

  // Add barrier for DIGITOVER/DIGITUNDER
  let barrier: string | undefined;
  if (contractType === "DIGITOVER") {
    barrier = "4";
  } else if (contractType === "DIGITUNDER") {
    barrier = "5";
  }

  return { contractType, barrier };
}

export function useDerivTrade() {
  const store = useTradingStore;

  const executeTrade = useCallback(() => {
    const s = store.getState();
    const ws = s._wsRef;

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      s.setStatusMessage("⚠ Not connected to Deriv WebSocket");
      s.setIsTrading(false);
      return;
    }

    const { direction, mode, stake, tickDuration, selectedMarket, marketData, activeStrategy } = s;
    const currentMarket = marketData[selectedMarket];

    if (!currentMarket || !activeStrategy) {
      s.setStatusMessage("⚠ No market data or active strategy selected");
      s.setIsTrading(false);
      return;
    }

    const { contractType, barrier } = getContractType(activeStrategy.id, direction, mode);

    // === STEP 1: Send proposal request ===
    const proposalMsg: Record<string, unknown> = {
      proposal: 1,
      amount: stake,
      basis: "stake",
      contract_type: contractType,
      currency: "USD",
      duration: tickDuration,
      duration_unit: "t",
      symbol: selectedMarket,
    };

    if (barrier) {
      proposalMsg.barrier = barrier;
    }

    s.setStatusMessage(`Requesting proposal: ${contractType} · ${currentMarket.label} · ${stake.toFixed(2)} USD`);

    let settled = false;

    // Response handler for the entire trade flow
    const handler = (event: MessageEvent) => {
      try {
        const data: WsMessage = JSON.parse(event.data);

        // === STEP 2: Handle proposal response ===
        if (data.msg_type === "proposal" && !settled) {
          if (data.error) {
            s.setStatusMessage(`⚠ Proposal failed: ${data.error.message}`);
            s.setIsTrading(false);
            ws.removeEventListener("message", handler);
            settled = true;
            return;
          }

          if (data.proposal && data.proposal.id) {
            s.setStatusMessage(
              `Proposal received — buying ${contractType} for ${data.proposal.ask_price.toFixed(2)} USD (payout: ${data.proposal.payout.toFixed(2)})`
            );

            // Send buy request with the proposal ID
            ws.send(JSON.stringify({
              buy: data.proposal.id,
              price: data.proposal.ask_price + 5, // Allow slight slippage
            }));
          }
        }

        // === STEP 3: Handle buy response ===
        if (data.msg_type === "buy" && !settled) {
          if (data.error) {
            s.setStatusMessage(`⚠ Trade failed: ${data.error.message}`);
            s.setIsTrading(false);
            ws.removeEventListener("message", handler);
            settled = true;
            return;
          }

          if (data.buy) {
            const buy = data.buy;
            const trade = {
              id: `trade-${buy.contract_id || Date.now()}`,
              market: selectedMarket,
              marketLabel: currentMarket.label || "Unknown",
              direction: direction as "EVEN" | "ODD",
              stake: buy.buy_price,
              result: "open" as const,
              profit: 0,
              timestamp: Date.now(),
              contractId: buy.contract_id,
            };
            s.addTrade(trade);
            s.setStatusMessage(
              `✅ Trade opened: ${contractType} · Contract #${buy.contract_id} · Payout: ${buy.payout.toFixed(2)} USD`
            );

            // Subscribe to contract updates for result tracking
            ws.send(JSON.stringify({
              proposal_open_contract: 1,
              contract_id: buy.contract_id,
              subscribe: 1,
            }));
          }
        }

        // === STEP 4: Handle contract completion ===
        if (data.msg_type === "proposal_open_contract" && data.proposal_open_contract) {
          const poc = data.proposal_open_contract;

          // Only process for our market's contracts that have completed
          if (poc.status === "sold" || poc.status === "lost" || poc.status === "won") {
            const isWin = poc.status === "won" || (poc.profit !== undefined && poc.profit > 0);
            const profit = poc.profit || -(poc.buy_price || stake);

            s.updateTrade(`trade-${poc.contract_id}`, {
              result: isWin ? "win" : "loss",
              profit: profit,
            });

            const currentPL = s.sessionPL + profit;
            s.setSessionPL(currentPL);
            s.setStatusMessage(
              `${isWin ? "🎉 Won" : "❌ Lost"}: ${poc.contract_type} · ${profit >= 0 ? "+" : ""}${profit.toFixed(2)} USD`
            );

            ws.removeEventListener("message", handler);
            s.setIsTrading(false);
            settled = true;
          }
        }
      } catch {
        // JSON parse error, ignore
      }
    };

    ws.addEventListener("message", handler);

    // Send the proposal
    ws.send(JSON.stringify(proposalMsg));

    // Safety timeout: 30 seconds
    setTimeout(() => {
      if (!settled) {
        settled = true;
        try {
          ws.removeEventListener("message", handler);
        } catch {
          // Ignore
        }
        s.setIsTrading(false);
        s.setStatusMessage("⚠ Trade timed out — no response from Deriv");
      }
    }, 30000);
  }, [store]);

  return { executeTrade };
}
