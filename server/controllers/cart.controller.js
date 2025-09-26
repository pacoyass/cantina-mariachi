import { createSuccess, createError } from '../utils/response.js';
import { LoggerService } from '../utils/logger.js';

// In-memory cart storage for sessions (for simplicity)
// In production, you'd use Redis or database
const cartStore = new Map();

// Get cart ID from session/cookies
function getCartId(req) {
  // Try session first, then fallback to a simple session ID
  if (req.session?.id) {
    return req.session.id;
  }
  
  // Create a simple session ID from IP + user agent (basic approach)
  const userAgent = req.headers['user-agent'] || 'unknown';
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  return `cart_${Buffer.from(`${ip}_${userAgent}`).toString('base64').slice(0, 16)}`;
}

// Get current cart
export const getCart = async (req, res) => {
  try {
    const cartId = getCartId(req);
    const cart = cartStore.get(cartId) || { items: [], total: 0 };
    
    LoggerService.logActivity('Cart viewed', { cartId, itemCount: cart.items.length });
    
    return createSuccess(res, 'Cart retrieved successfully', cart);
  } catch (error) {
    LoggerService.logError('Failed to get cart', error.stack, { 
      path: req.path,
      method: req.method 
    });
    return createError(res, 500, 'internalError', 'CART_GET_ERROR');
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { itemId, quantity = 1, notes = '' } = req.body;
    
    if (!itemId) {
      return createError(res, 400, 'validationError', 'ITEM_ID_REQUIRED');
    }

    const cartId = getCartId(req);
    let cart = cartStore.get(cartId) || { items: [], total: 0 };
    
    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(item => item.itemId === itemId);
    
    if (existingItemIndex >= 0) {
      // Update quantity if item exists
      cart.items[existingItemIndex].quantity += parseInt(quantity);
      cart.items[existingItemIndex].notes = notes || cart.items[existingItemIndex].notes;
    } else {
      // Add new item to cart
      cart.items.push({
        itemId,
        quantity: parseInt(quantity),
        notes,
        addedAt: new Date().toISOString()
      });
    }
    
    // Recalculate total (simplified - in real app you'd fetch item prices from DB)
    cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * 12.99), 0); // Mock price
    cart.updatedAt = new Date().toISOString();
    
    // Save cart
    cartStore.set(cartId, cart);
    
    LoggerService.logActivity('Item added to cart', { 
      cartId, 
      itemId, 
      quantity, 
      cartSize: cart.items.length 
    });
    
    return createSuccess(res, 'Item added to cart successfully', { 
      cart, 
      addedItem: { itemId, quantity, notes }
    });
    
  } catch (error) {
    LoggerService.logError('Failed to add item to cart', error.stack, { 
      path: req.path,
      method: req.method,
      body: req.body 
    });
    return createError(res, 500, 'internalError', 'CART_ADD_ERROR');
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;
    
    if (!itemId) {
      return createError(res, 400, 'validationError', 'ITEM_ID_REQUIRED');
    }

    const cartId = getCartId(req);
    let cart = cartStore.get(cartId) || { items: [], total: 0 };
    
    // Remove item from cart
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item.itemId !== itemId);
    
    if (cart.items.length === initialLength) {
      return createError(res, 404, 'notFound', 'ITEM_NOT_IN_CART');
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * 12.99), 0); // Mock price
    cart.updatedAt = new Date().toISOString();
    
    // Save cart
    cartStore.set(cartId, cart);
    
    LoggerService.logActivity('Item removed from cart', { 
      cartId, 
      itemId, 
      cartSize: cart.items.length 
    });
    
    return createSuccess(res, 'Item removed from cart successfully', { 
      cart, 
      removedItem: { itemId }
    });
    
  } catch (error) {
    LoggerService.logError('Failed to remove item from cart', error.stack, { 
      path: req.path,
      method: req.method,
      body: req.body 
    });
    return createError(res, 500, 'internalError', 'CART_REMOVE_ERROR');
  }
};

// Update item quantity in cart
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity, notes } = req.body;
    
    if (!itemId || quantity === undefined) {
      return createError(res, 400, 'validationError', 'ITEM_ID_AND_QUANTITY_REQUIRED');
    }

    const cartId = getCartId(req);
    let cart = cartStore.get(cartId) || { items: [], total: 0 };
    
    // Find and update item
    const itemIndex = cart.items.findIndex(item => item.itemId === itemId);
    
    if (itemIndex === -1) {
      return createError(res, 404, 'notFound', 'ITEM_NOT_IN_CART');
    }
    
    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1);
    } else {
      // Update item
      cart.items[itemIndex].quantity = parseInt(quantity);
      if (notes !== undefined) {
        cart.items[itemIndex].notes = notes;
      }
    }
    
    // Recalculate total
    cart.total = cart.items.reduce((sum, item) => sum + (item.quantity * 12.99), 0); // Mock price
    cart.updatedAt = new Date().toISOString();
    
    // Save cart
    cartStore.set(cartId, cart);
    
    LoggerService.logActivity('Cart item updated', { 
      cartId, 
      itemId, 
      newQuantity: quantity,
      cartSize: cart.items.length 
    });
    
    return createSuccess(res, 'Cart item updated successfully', { 
      cart, 
      updatedItem: { itemId, quantity, notes }
    });
    
  } catch (error) {
    LoggerService.logError('Failed to update cart item', error.stack, { 
      path: req.path,
      method: req.method,
      body: req.body 
    });
    return createError(res, 500, 'internalError', 'CART_UPDATE_ERROR');
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const cartId = getCartId(req);
    
    // Clear cart
    cartStore.delete(cartId);
    
    LoggerService.logActivity('Cart cleared', { cartId });
    
    return createSuccess(res, 'Cart cleared successfully', { 
      cart: { items: [], total: 0 }
    });
    
  } catch (error) {
    LoggerService.logError('Failed to clear cart', error.stack, { 
      path: req.path,
      method: req.method 
    });
    return createError(res, 500, 'internalError', 'CART_CLEAR_ERROR');
  }
};

export default {
  getCart,
  addToCart,
  removeFromCart, 
  updateCartItem,
  clearCart
};