# Juice Feature - Logic & Rules

## Activation Rules
- Only available to **Trusted Seller** level and above
- Costs $0.99 per activation
- Lasts exactly **24 hours** from the moment it is activated
- A listing can only be Juiced **once every 24 hours**

## Visibility Rules
- When activated, the listing moves to a special **"Juiced"** section at the top of the homepage
- Newer Juice activations push older ones down (rolling stack system)
- Juiced listings are mixed across all categories on the main homepage feed

## Limits
- Maximum of **2 active Juiced listings per category** per seller at any time
- If a seller tries to Juice a 3rd listing in the same category, the oldest one is automatically removed from the Juice section

## Technical Notes
- When Juice expires, the listing should naturally fall back into normal category sorting
- Juice status should be clearly visible on the listing card (e.g. a small "Juiced" badge)
