import express from 'express';
import {
  showCart,
  addToCart,
  increaseQuantity,
  removeFromCart,
} from '../controllers/cartController';


const router = express.Router();

router.get('/', showCart);
router.post('/', addToCart);
router.post('/increase', increaseQuantity);
router.post('/remove', removeFromCart);

export default router;
