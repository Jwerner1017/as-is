# Rage Buy & All Mine - Detailed Logic

## Trigger Conditions
- Automatically triggers when a listing reaches **15 total bids**, OR
- Seller can manually trigger it during a live stream at any time

## Pricing Rules
- Rage Buy Price = Current highest bid + 20%
- All Mine Price = Original highest bid (before Rage Buy was triggered) + 25%

## Step-by-Step Flow
1. Rage Buy button appears on the listing (Live only)
2. First user to click "Rage Buy" pays current bid + 20% and becomes the temporary winner
3. A 3-second countdown immediately starts on screen
4. During the 3 seconds, an "ALL MINE" button appears
5. If someone clicks "ALL MINE" during the countdown, they pay original bid + 25% and steal the item
6. If no one clicks "ALL MINE" within 3 seconds, the Rage Buy winner keeps the item
7. Both actions are final — no refunds or disputes allowed

## Important Notes
- This feature is **only available during Live Selling**
- The 25% for All Mine is always calculated from the original highest bid, not from the Rage Buy price
- The platform takes its normal 2% fee on the final sale price
