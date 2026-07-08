# Database Schema Suggestions

## Core Collections / Tables

### Users
- id
- email
- displayName
- role (buyer / seller / both)
- sellerLevel (new / upcoming / trusted / top)
- totalSales
- positiveFeedbackPercentage
- createdAt
- updatedAt

### Listings
- id
- sellerId
- title
- description
- price
- condition
- category
- subcategory
- images (array)
- format (buy_it_now / auction / live)
- status (active / sold / ended)
- isJuiced
- juiceExpiresAt
- currentHighestBid (for auctions)
- createdAt

### RageBuySessions
- id
- listingId
- currentHighestBid
- rageBuyPrice
- allMinePrice
- isActive
- countdownStartedAt
- triggeredBy (auto / seller)
- winnerUserId (if completed)

### LiveStreams
- id
- sellerId
- title
- description
- isActive
- viewerCount
- moderationLevel (relaxed / medium / strict)
- startedAt
- endedAt

### JuiceActivations
- id
- listingId
- sellerId
- activatedAt
- expiresAt

### Orders / Transactions
- id
- listingId
- buyerId
- sellerId
- finalPrice
- platformFee
- payoutStatus
- trackingNumber
- deliveredAt
- createdAt
