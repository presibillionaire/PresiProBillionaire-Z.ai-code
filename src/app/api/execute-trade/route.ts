import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { token, market, direction, stake, tickDuration } = await request.json();

    if (!token || !market || !direction || !stake) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Execute trade via Deriv API
    const contractType = direction === "EVEN" ? "DIGITEVEN" : "DIGITODD";

    const res = await fetch("https://api.derivws.com/contract/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buy: 1,
        price: stake,
        parameters: {
          contract_type: contractType,
          symbol: market,
          duration: tickDuration,
          duration_unit: "t",
          basis: "stake",
          amount: stake,
          currency: "USD",
        },
      }),
    });

    const data = await res.json();

    if (data.error) {
      // Simulate trade for demo purposes if API fails
      const profit = Math.random() > 0.45 ? stake * 0.85 : -stake;
      const tradeId = `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;

      // Save to database
      await db.tradeSession.create({
        data: {
          sessionKey: tradeId,
          market,
          direction,
          stake,
          tickDuration: tickDuration || 2,
          netProfit: profit,
          isSimulation: true,
          result: profit > 0 ? "win" : "loss",
          strategy: "m-pro",
        },
      });

      return NextResponse.json({
        success: profit > 0,
        tradeId,
        profit,
        contractId: null,
        simulated: true,
      });
    }

    const buy = data.buy;
    const profit = buy?.profit || 0;

    // Save to database
    await db.tradeSession.create({
      data: {
        sessionKey: `live-${Date.now()}`,
        market,
        direction,
        stake,
        tickDuration: tickDuration || 2,
        netProfit: profit,
        contractId: buy?.contract_id,
        isSimulation: false,
        result: profit > 0 ? "win" : "loss",
        strategy: "m-pro",
      },
    });

    return NextResponse.json({
      success: profit > 0,
      tradeId: buy?.contract_id?.toString() || `trade-${Date.now()}`,
      profit,
      contractId: buy?.contract_id,
      simulated: false,
    });
  } catch (error) {
    console.error("Trade execution error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute trade" },
      { status: 500 }
    );
  }
}
