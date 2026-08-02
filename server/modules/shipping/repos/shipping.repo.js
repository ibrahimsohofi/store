import knex from '../../../config/knex.js';

export const shippingRepo = {
  async getZones() {
    return knex('shop_shipping_zones')
      .where('is_active', true)
      .orderBy('name', 'asc')
      .select('*');
  },

  async getZoneById(id) {
    return knex('shop_shipping_zones')
      .where({ id, is_active: true })
      .first();
  },

  async getZoneRates(zoneId) {
    return knex('shop_shipping_rates')
      .where({ zone_id: zoneId, is_active: true })
      .orderBy('min_weight', 'asc')
      .select('*');
  },

  async getZoneByPostalCode(postalCode) {
    // Match postal code patterns (e.g., "10*" matches 10000-10999)
    return knex('shop_shipping_zones')
      .where('is_active', true)
      .where(function() {
        this.where('postal_code_pattern', 'ALL')
          .orWhere('postal_code_pattern', 'like', `${postalCode.substring(0, 2)}%`)
          .orWhere('postal_code_pattern', 'like', `${postalCode.substring(0, 3)}%`);
      })
      .first();
  },

  async calculateShippingCost(zoneId, totalWeight, orderValue) {
    const rates = await this.getZoneRates(zoneId);
    
    for (const rate of rates) {
      // Check weight range
      if (rate.min_weight !== null && totalWeight < rate.min_weight) continue;
      if (rate.max_weight !== null && totalWeight > rate.max_weight) continue;
      
      // Check order value range
      if (rate.min_order_value !== null && orderValue < rate.min_order_value) continue;
      if (rate.max_order_value !== null && orderValue > rate.max_order_value) continue;
      
      return {
        rateId: rate.id,
        cost: rate.cost,
        estimatedDays: rate.estimated_days,
        name: rate.name,
      };
    }
    
    // Default fallback rate
    return {
      rateId: null,
      cost: 50,
      estimatedDays: 5,
      name: 'Standard',
    };
  },
};
