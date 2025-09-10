// app/api/portfolio/route.ts
import { NextResponse } from "next/server";
import { getPortfolio } from "@/utils/services/finance";

export async function GET() {
  try {
    const portfolio = await getPortfolio();
    return NextResponse.json(portfolio);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch portfolio" },
      { status: 500 }
    );
  }
}
