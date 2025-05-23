import express from 'express';
import { showOrderForm, placeOrder } from '../controllers/orderController';

const router = express.Router();

router.get('/', showOrderForm);

router.post('/', (req, res, next) => {
  Promise.resolve(placeOrder(req, res)).catch(next);
});

export default router;
