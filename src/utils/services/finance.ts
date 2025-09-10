"use server";
import { IStock } from "@/types/common.interfaces";
import yahooFinance from "yahoo-finance2";
import portfolio from "@/lib/data/portfolio.json";
import { symbolMapping } from "@/lib/constants";

// Fetch Yahoo Finance data
export async function fetchYahooData(symbol: string) {
  const resolvedSymbol = symbolMapping[symbol] || undefined;

  if (!resolvedSymbol) {
    console.warn(`No valid Yahoo symbol found for "${symbol}". Skipping.`);
    return {
      cmp: null,
      peRatio: null,
      latestEarnings: null,
    };
  }

  try {
    const quote = await yahooFinance.quote(resolvedSymbol);
    const summary = await yahooFinance.quoteSummary(resolvedSymbol, {
      modules: ["defaultKeyStatistics", "financialData", "earnings"],
    });

    const earningsDateRaw = summary?.earnings?.earningsChart?.earningsDate?.[0];

    const latestEarnings = earningsDateRaw
      ? new Date(earningsDateRaw).toISOString().split("T")[0]
      : null;

    return {
      cmp: quote.regularMarketPrice ?? null,
      peRatio: summary?.defaultKeyStatistics?.forwardPE ?? null,
      latestEarnings,
    };
  } catch (err) {
    console.error(
      `Error fetching data for symbol "${symbol}" (resolved: "${resolvedSymbol}")`,
      err
    );
    return {
      cmp: null,
      peRatio: null,
      latestEarnings: null,
    };
  }
}

// Enrich portfolio with live data
export async function getPortfolio(): Promise<IStock[]> {
  const enrichedStocks = await Promise.all(
    (portfolio as IStock[]).map(async (stock) => {
      const yahooData = await fetchYahooData(stock.nseBse);

      const cmp = yahooData.cmp ?? stock.cmp ?? null;
      const presentValue = cmp && stock.quantity ? cmp * stock.quantity : null;
      const gainLoss =
        presentValue !== null ? presentValue - stock.investment : null;

      return {
        ...stock,
        cmp,
        presentValue,
        gainLoss,
        peRatio: yahooData.peRatio,
        latestEarnings: yahooData.latestEarnings,
      };
    })
  );
  // console.log(enrichedStocks);
  return enrichedStocks;
}
