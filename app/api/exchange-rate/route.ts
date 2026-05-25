import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error("Upstream fetch failed");
    const data = await res.json();
    if (data.result !== "success" || !data.rates?.JMD) {
      throw new Error("Unexpected response shape");
    }
    return NextResponse.json(
      { rate: data.rates.JMD as number },
      { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=300" } }
    );
  } catch {
    // Fallback rate so the page never breaks
    return NextResponse.json({ rate: 157, fallback: true }, { status: 200 });
  }
}
