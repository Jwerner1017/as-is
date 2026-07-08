export const orderService = {
  async createOrder(listingId: string, buyerId: string) {
    // TODO: Create transaction record
    // TODO: Mark listing as sold
    // TODO: Trigger payout hold logic based on seller level
    console.log(`Order created for listing: ${listingId}`);
  },

  async markAsShipped(orderId: string, trackingNumber: string) {
    // TODO: Update tracking number
    // TODO: Start payout timer based on seller level
  },

  async confirmDelivery(orderId: string) {
    // This should ideally be triggered automatically via tracking API
    // Not by buyer clicking a button
  }
};
