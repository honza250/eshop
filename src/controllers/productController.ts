import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

export async function getAllProducts(req: Request, res: Response) {
  const result = await db.select().from(products);
  res.render('products', { products: result, title: 'Produkty' });
}

export async function getProductById(req: Request, res: Response) {
  const { id } = req.params;
  const result = await db.select().from(products).where(eq(products.id, Number(id)));
  if (result.length === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(result[0]);
}
