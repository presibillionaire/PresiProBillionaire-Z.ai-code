import { useEffect, useRef, useCallback } from "react";
import { useTradingStore } from "@/stores/trading-store";
import { MARKETS, DERIV_WS_URL, TICKS_REQUIRED } from "@/lib/markets";

type WsMessage = {
  msg_type: string;
  tick?: { symbol: string; quote: number; epoch: number; id: string };
  authorize?: {
    balance: number;
    currency: string;
    loginid: string;
    account_list: Array<{ account_type: string; currency: string }>;
    fullname: string;
  };
  error?: { message: string; code: string };
};

export function useDerivWs() {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const subscriptionIdsRef = useRef<string[]>([]);
  const isConnectingRef = useRef(false);

  const store = useTradingStore;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }
    if (isConnectingRef.current) return;

    isConnectingRef.current = true;
    store.getState().setWsConnected(false);

    const ws = new WebSocket(DERIV_WS_URL);

    ws.onopen = () => {
      isConnectingRef.current = false;
      store.getState().setWsConnected(true);
      store.getState().setStatusMessage("WebSocket connected");

      // Authorize if we have a token
      const { token, authStatus } = store.getState();
      if (token && authStatus === "authenticated") {
        ws.send(JSON.stringify({ authorize: token }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data: WsMessage = JSON.parse(event.data);

        // Handle authorize response
        if (data.msg_type === "authorize" && data.authorize) {
          const auth = data.authorize;
          store.getState().setBalance(auth.balance);
          const mainAccount = auth.account_list?.find((a) => a.account_type === "main");
          const isDemo = mainAccount?.currency === "USD" && (auth.loginid.startsWith("VRTC") || mainAccount.account_type === "main");
          store.getState().setAccountType(isDemo ? "demo" : "real");
          store.getState().setAuthorizeResponse(data);
          store.getState().setStatusMessage(`Authorized: ${auth.fullname} (${auth.currency} ${auth.balance.toFixed(2)})`);
        }

        // Handle authorize error
        if (data.msg_type === "authorize" && data.error) {
          store.getState().setStatusMessage(`Auth error: ${data.error.message}`);
        }

        // Handle tick data
        if (data.msg_type === "tick" && data.tick) {
          const { symbol, quote } = data.tick;
          processTick(symbol, quote);
        }
      } catch {
        // Ignore parse errors
      }
    };

    ws.onclose = () => {
      isConnectingRef.current = false;
      store.getState().setWsConnected(false);
      store.getState().setStatusMessage("WebSocket disconnected. Reconnecting...");

      // Reconnect after 3 seconds
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = () => {
      // Error handled by onclose
    };

    wsRef.current = ws;
  }, [store]);

  const processTick = useCallback((symbol: string, quote: number) => {
    const s = store.getState();
    const quoteStr = quote.toString();
    const lastDigit = parseInt(quoteStr[quoteStr.length - 1], 10);

    if (isNaN(lastDigit)) return;

    const currentData = s.marketData[symbol];
    if (!currentData) return;

    // Keep last 100 digits
    const lastDigits = [...currentData.lastDigits, lastDigit].slice(-100);
    const totalTicks = lastDigits.length;

    // Calculate even/odd strength
    let evenCount = 0;
    let oddCount = 0;
    lastDigits.forEach((d) => {
      if (d % 2 === 0) evenCount++;
      else oddCount++;
    });

    const evenStrength = totalTicks > 0 ? (evenCount / totalTicks) * 100 : 50;
    const oddStrength = totalTicks > 0 ? (oddCount / totalTicks) * 100 : 50;
    const gap = Math.abs(evenStrength - oddStrength);

    // Calculate stability: how consistent is the ratio over recent windows
    let stability = 50;
    if (totalTicks >= 10) {
      const windowSize = 10;
      let stableCount = 0;
      const totalWindows = Math.floor(totalTicks / windowSize);
      for (let w = 0; w < totalWindows; w++) {
        const window = lastDigits.slice(w * windowSize, (w + 1) * windowSize);
        let wEven = 0;
        window.forEach((d) => { if (d % 2 === 0) wEven++; });
        const wRatio = (wEven / windowSize) * 100;
        if (Math.abs(wRatio - evenStrength) < 15) stableCount++;
      }
      stability = totalWindows > 0 ? (stableCount / totalWindows) * 100 : 50;
    }

    // Quality: composite of gap and stability
    const quality = (gap * 0.6) + (stability * 0.4);

    // Confidence: scaled composite score
    const confidence = Math.min(100, Math.max(0, gap * (stability / 100) * 1.5));

    // Direction
    const direction = evenStrength > oddStrength + 2 ? "EVEN" as const
      : oddStrength > evenStrength + 2 ? "ODD" as const
      : "NEUTRAL" as const;

    // Update market data in store
    store.getState().updateMarketData(symbol, {
      lastDigits,
      ticksCollected: totalTicks,
      evenStrength,
      oddStrength,
      gap,
      stability,
      quality,
      confidence,
      direction,
    });

    // Update scan progress and status
    const allData = store.getState().marketData;
    const marketsWithMinTicks = Object.values(allData).filter(
      (m) => m.ticksCollected >= TICKS_REQUIRED
    ).length;

    const scanProgress = Math.round((marketsWithMinTicks / MARKETS.length) * 100);
    store.getState().setScanProgress(scanProgress);

    if (scanProgress >= 80 && s.scanStatus === "scanning") {
      store.getState().setScanStatus("ready");
      store.getState().setStatusMessage("Scan complete — ready to trade");
    }

    // Update last tick time
    store.getState().setLastTickTime(Date.now());
  }, [store]);

  const subscribeToTicks = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    MARKETS.forEach((market) => {
      wsRef.current?.send(
        JSON.stringify({ ticks: market.symbol, subscribe: 1 })
      );
    });

    store.getState().setIsScanning(true);
    store.getState().setScanStatus("scanning");
    store.getState().setStatusMessage("Subscribing to all 10 markets...");
  }, [store]);

  const authorizeWithToken = useCallback((token: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(JSON.stringify({ authorize: token }));
    // Subscribe to ticks after a short delay to allow auth
    setTimeout(() => {
      subscribeToTicks();
    }, 1000);
  }, [subscribeToTicks]);

  const getWebSocket = useCallback(() => {
    return wsRef.current;
  }, []);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect
        wsRef.current.close();
      }
    };
  }, []);

  return {
    connect,
    authorizeWithToken,
    subscribeToTicks,
    getWebSocket,
  };
}
