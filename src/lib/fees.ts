// Centralized fee structure for As Is

export const FEES = {
  listing: 0.20,
  finalValue: 0.02,        // 2%
  juice: 0.99,
  promotionalSpotlight7Day: 9.99,
  promotionalSpotlightMonthly: 19.99,
} as const;

export const MINIMUM_PAYOUT = 5; // Example: minimum $5 to cash out
