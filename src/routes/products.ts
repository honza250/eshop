import { Router } from 'express';
import { getAllProducts } from '../controllers/productControllers';

const router = Router();

router.get('/', getAllProducts);

export default router;
