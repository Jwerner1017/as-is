# As Is - Full Platform Specification

## Overview
As Is is a raw, adult-oriented marketplace where everything is sold strictly "As Is". The platform minimizes interference and expects users to take responsibility for their decisions.

## Core Rules
- All sales are final except for 3 specific exceptions (see As Is Policy)
- Platform does not mediate disputes outside of those 3 exceptions
- Sellers must be honest in descriptions and photos
- Misrepresentation = permanent ban + fund forfeiture

## Design Requirements
- Dark Mode by default
- Available themes: Exotic Dark, Explosive Dark
- Tone throughout the app should be blunt, direct, and slightly unfiltered

## Main Features

### 1. Rage Buy & All Mine (Live Only)
- Rage Buy triggers after 15 total bids or when seller manually activates it
- Rage Buy price = Current highest bid + 20%
- When Rage Buy is used, a 3-second countdown begins
- During countdown, "All Mine" button appears
- All Mine price = Original highest bid + 25%
- Both actions are final with no refunds

### 2. Juice Feature
- Costs $0.99
- Pushes listing to the top of the homepage for 24 hours
- Only available to Trusted Sellers and above
- Maximum 2 Juiced listings per category at once
- Can only be used once every 24 hours per listing

### 3. Live Selling
- Sellers can go live and sell items in real time
- 3 chat moderation levels: Relaxed (default), Medium, Strict
- Must show the physical item on camera
- No nudity or sexually explicit content allowed
- Live games are permitted (Giveaways, Mystery Boxes, Spin the Wheel, etc.)
- All live sales follow normal As Is rules

### 4. Seller Levels
- New Seller → Up & Coming → Trusted Seller → Top Seller
- Higher levels unlock: lower fees, faster payouts, Juice access, higher limits

## Categories
Platform must support these 10 main categories with 3-tier navigation:
1. Electronics
2. Fashion & Apparel
3. Home & Garden
4. Automotive
5. Sports & Outdoors
6. Collectibles
7. Tools & Equipment
8. Beauty & Personal Wellness
9. Toys & Hobbies
10. Miscellaneous

## Filters & Sorting
Must include:
- Sort: Newest, Oldest, Ending Soonest, Price Low-High, Price High-Low, Most Juiced
- Filters: Price range, Condition, Format (Buy It Now / Auction / Live), Shipping, Seller Level

## Payout Logic
- Payouts triggered by tracking status showing "Delivered"
- New/Up & Coming: 48 hours after delivery
- Trusted: 24 hours after delivery
- Top Seller: Instant after delivery
- Weekly payout option available for all levels
- Tips paid out immediately with no hold

## Important Notes for Development
- Tone should remain blunt and direct throughout the UI
- Do not add fake buyer protection language
- Rage Buy and All Mine should feel high-stakes and exciting
- Keep the platform feeling chaotic but functional
