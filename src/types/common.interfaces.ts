export interface IStock {
  [key: string]: string | number | Date | null;
  particulars: string;
  category: string;
  purchasePrice: number;
  quantity: number;
  investment: number;
  portfolioPercent: number;
  nseBse: string;
  cmp: number | null;
  presentValue: number | null;
  gainLoss: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
}

export interface IPortfolioHolding extends IStock {
  [key: string]: string | number | Date | null;
  investment: number;
  presentValue: number;
  gainLoss: number;
  portfolioPercentage: number;
}

export interface YahooFinanceData {
  cmp: number | null;
  peRatio: number | null;
  latestEarnings: string | null;
}
