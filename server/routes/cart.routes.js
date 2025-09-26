import express from 'express';
import rateLimit from '../middleware/rateLimit.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { 
  getCart, 
  addToCart, 
  removeFromCart, 
  updateCartItem, 
  clearCart 
} from '../controllers/cart.controller.js';
import { 
  addToCartSchema, 
  removeFromCartSchema, 
  updateCartItemSchema 
} from '../validations/cart.validation.js';

const router = express.Router();

// Rate limiting for cart operations
const rlModerate = rateLimit({ windowMs: 60_000, max: 30 }); // 30 requests per minute
const rlStrict = rateLimit({ windowMs: 60_000, max: 10 });   // 10 requests per minute

// GET /api/cart - Get current cart
router.get('/', rlModerate, getCart);

// POST /api/cart/add - Add item to cart
router.post('/add', rlModerate, validate(addToCartSchema), addToCart);

// POST /api/cart/remove - Remove item from cart  
router.post('/remove', rlModerate, validate(removeFromCartSchema), removeFromCart);

// PUT /api/cart/update - Update item in cart
router.put('/update', rlModerate, validate(updateCartItemSchema), updateCartItem);

// DELETE /api/cart/clear - Clear entire cart
router.delete('/clear', rlStrict, clearCart);

export default router;