export type CurrencyCode = "EUR" | "USD" | "GBP" | "CHF" | "JPY";

export const CURRENCIES: Record<CurrencyCode, { symbol: string; name: string }> = {
  EUR: { symbol: "€",  name: "Euro"           },
  USD: { symbol: "$",  name: "US Dollar"       },
  GBP: { symbol: "£",  name: "British Pound"   },
  CHF: { symbol: "Fr", name: "Swiss Franc"     },
  JPY: { symbol: "¥",  name: "Japanese Yen"    },
};

// Units of each currency per 1 EUR (mock rates — swap fetch call here for live API)
export const RATES: Record<CurrencyCode, number> = {
  EUR: 1.00,
  USD: 1.08,
  GBP: 0.86,
  CHF: 0.98,
  JPY: 162.50,
};

/** Convert an amount stored in EUR to the target currency. */
export function convert(amountEUR: number, to: CurrencyCode): number {
  return amountEUR * RATES[to];
}

/** Format an EUR-denominated amount as a display string in the target currency. */
export function formatCurrency(amountEUR: number, to: CurrencyCode): string {
  const value = Math.round(convert(amountEUR, to));
  return `${CURRENCIES[to].symbol}${value.toLocaleString("en")}`;
}
