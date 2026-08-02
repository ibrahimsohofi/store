import { cartRepo } from '../repos/cart.repo.js';
import { catalogRepo } from '../../catalog/repos/catalog.repo.js';

export const cartService = {
  async getCart(cartToken, customerId) {
    let cart;
    
    if (customerId) {
      cart = await cartRepo.getCartByCustomerId(customerId);
    } else if (cartToken) {
      cart = await cartRepo.getCartByToken(cartToken);
    }

    if (!cart) {
      return { items: [], total: 0 };
    }

    const items = await cartRepo.getCartItems(cart.id);
    const total = items.reduce((sum, item) => sum + item.unit_price_snapshot * item.qty, 0);

    return { cart, items, total };
  },

  async addItem(cartToken, customerId, productId, qty) {
    const product = await catalogRepo.getProductById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock_quantity < qty) {
      throw new Error('Insufficient stock');
    }

    let cart;
    
    if (customerId) {
      cart = await cartRepo.getCartByCustomerId(customerId);
    } else if (cartToken) {
      cart = await cartRepo.getCartByToken(cartToken);
    }

    if (!cart) {
      const token = cartToken || this.generateToken();
      cart = await cartRepo.createCart({
        token,
        customer_id: customerId || null,
        currency: 'MAD',
      });
    }

    const existingItem = await cartRepo.getCartItem(cart.id, productId);

    if (existingItem) {
      const newQty = Math.min(existingItem.qty + qty, 99);
      await cartRepo.updateCartItem(existingItem.id, { qty: newQty });
    } else {
      await cartRepo.addCartItem({
        cart_id: cart.id,
        product_id: productId,
        qty,
        unit_price_snapshot: product.price,
      });
    }

    return await this.getCart(cart.token, customerId);
  },

  async updateItem(cartToken, customerId, itemId, qty) {
    let cart;
    
    if (customerId) {
      cart = await cartRepo.getCartByCustomerId(customerId);
    } else if (cartToken) {
      cart = await cartRepo.getCartByToken(cartToken);
    }

    if (!cart) {
      throw new Error('Cart not found');
    }

    if (qty === 0) {
      await cartRepo.removeCartItem(itemId);
    } else {
      await cartRepo.updateCartItem(itemId, { qty });
    }

    return await this.getCart(cart.token, customerId);
  },

  async removeItem(cartToken, customerId, itemId) {
    let cart;
    
    if (customerId) {
      cart = await cartRepo.getCartByCustomerId(customerId);
    } else if (cartToken) {
      cart = await cartRepo.getCartByToken(cartToken);
    }

    if (!cart) {
      throw new Error('Cart not found');
    }

    await cartRepo.removeCartItem(itemId);
    return await this.getCart(cart.token, customerId);
  },

  async clearCart(cartToken, customerId) {
    let cart;
    
    if (customerId) {
      cart = await cartRepo.getCartByCustomerId(customerId);
    } else if (cartToken) {
      cart = await cartRepo.getCartByToken(cartToken);
    }

    if (!cart) {
      throw new Error('Cart not found');
    }

    await cartRepo.clearCart(cart.id);
    return await this.getCart(cart.token, customerId);
  },

  async mergeCarts(sourceToken, customerId) {
    const sourceCart = await cartRepo.getCartByToken(sourceToken);
    if (!sourceCart) {
      return await this.getCart(null, customerId);
    }

    const targetCart = await cartRepo.getCartByCustomerId(customerId);
    
    if (targetCart) {
      const sourceItems = await cartRepo.getCartItems(sourceCart.id);
      
      for (const sourceItem of sourceItems) {
        const existingItem = await cartRepo.getCartItem(targetCart.id, sourceItem.product_id);
        
        if (existingItem) {
          const newQty = Math.min(existingItem.qty + sourceItem.qty, 99);
          await cartRepo.updateCartItem(existingItem.id, { qty: newQty });
        } else {
          await cartRepo.addCartItem({
            cart_id: targetCart.id,
            product_id: sourceItem.product_id,
            qty: sourceItem.qty,
            unit_price_snapshot: sourceItem.unit_price_snapshot,
          });
        }
      }
      
      await cartRepo.clearCart(sourceCart.id);
      return await this.getCart(null, customerId);
    } else {
      await cartRepo.updateCart(sourceCart.id, { customer_id: customerId });
      return await this.getCart(sourceCart.token, customerId);
    }
  },

  generateToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  },
};
