import { adminRepo } from '../repos/admin.repo.js';

export const adminService = {
  async getDashboard() {
    const stats = await adminRepo.getDashboardStats();
    const recentOrders = await adminRepo.getRecentOrders(5);
    
    return {
      stats,
      recentOrders,
    };
  },

  async getOrders(query) {
    return await adminRepo.getOrders(query);
  },

  async updateOrderStatus(orderId, status) {
    return await adminRepo.updateOrderStatus(orderId, status);
  },

  async getProducts(query) {
    return await adminRepo.getProducts(query);
  },

  async updateProduct(productId, data) {
    return await adminRepo.updateProduct(productId, data);
  },

  async getCustomers(query) {
    return await adminRepo.getCustomers(query);
  },

  async getSalesReport(startDate, endDate) {
    return await adminRepo.getSalesReport(startDate, endDate);
  },
};
