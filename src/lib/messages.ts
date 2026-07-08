// Keep the blunt tone consistent across the entire app

export const Messages = {
  rageBuy: {
    success: (amount: number) =>
      `You just hit RAGE BUY and paid \[ {amount}. This item is now yours. No refunds. No take-backs.`,
    alreadyActive: "Rage Buy is already active on this item.",
  },

  allMine: {
    success: (amount: number) =>
      `ALL MINE successful! You just stole that shit for \]{amount}. Enjoy it.`,
  },

  outbid: "You’ve been outbid. Don’t be a loser — get back in there.",

  purchaseComplete: "Purchase Complete. You now own this item As Is. Don’t come crying if it’s broken.",

  itemSold: (price: number, fee: number, payout: number) =>
    `Your item just sold for \[ {price}. Our cut: \]{fee}. Your payout: \[ {payout}. Now go on and ship that shit.`,

  payoutSent: (amount: number) =>
    `We just sent you \]{amount}. It should hit your account within 1–3 business days.`,
};
