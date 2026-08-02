import { shippingRepo } from '../repos/shipping.repo.js';

export const shippingService = {
  async getAvailableZones() {
    return await shippingRepo.getZones();
  },

  async getShippingQuote(postalCode, totalWeight, orderValue) {
    const zone = await shippingRepo.getZoneByPostalCode(postalCode);
    
    if (!zone) {
      // Default zone for unknown postal codes
      return {
        zoneId: null,
        zoneName: 'Standard',
        cost: 50,
        estimatedDays: 5,
      };
    }

    const quote = await shippingRepo.calculateShippingCost(
      zone.id,
      totalWeight,
      orderValue
    );

    return {
      zoneId: zone.id,
      zoneName: zone.name,
      ...quote,
    };
  },

  async getZoneRates(zoneId) {
    return await shippingRepo.getZoneRates(zoneId);
  },
};
