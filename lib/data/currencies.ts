// src/lib/currencies.ts

export const ALL_CURRENCIES = [
  "USD", // US Dollar
  "EUR", // Euro
  "JPY", // Japanese Yen
  "GBP", // British Pound
  "AUD", // Australian Dollar
  "CAD", // Canadian Dollar
  "CHF", // Swiss Franc
  "CNY", // Chinese Yuan
  "SEK", // Swedish Krona
  "NZD", // New Zealand Dollar
  "MXN", // Mexican Peso
  "SGD", // Singapore Dollar
  "HKD", // Hong Kong Dollar
  "NOK", // Norwegian Krone
  "KRW", // South Korean Won
  "TRY", // Turkish Lira
  "INR", // Indian Rupee
  "RUB", // Russian Ruble
  "BRL", // Brazilian Real
  "ZAR", // South African Rand
  "PHP", // Philippine Peso
] as const;

export type Currency = typeof ALL_CURRENCIES[number];

// These are the ones you want in the "Top" section of the dropdown
export const TOP_CURRENCIES: Currency[] = [
  "USD",
  "EUR",
  "JPY",
  "GBP",
  "AUD",
  "PHP",
];
