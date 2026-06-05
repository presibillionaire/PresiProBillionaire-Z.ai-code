import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== "string" || token.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: "Invalid token format" },
        { status: 400 }
      );
    }

    // Validate token with Deriv API
    const res = await fetch(
      `https://api.derivws.com/authorize?authorize=${encodeURIComponent(token.trim())}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    if (data.error) {
      return NextResponse.json(
        { success: false, error: "Invalid API token" },
        { status: 401 }
      );
    }

    const authorize = data.authorize;
    if (!authorize) {
      return NextResponse.json(
        { success: false, error: "Authorization failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      balance: parseFloat(authorize.balance) || 0,
      accountType: authorize.is_virtual ? "demo" : "real",
      loginid: authorize.loginid,
      currency: authorize.currency,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate token" },
      { status: 500 }
    );
  }
}
