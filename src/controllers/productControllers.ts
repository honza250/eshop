import { db } from '../db';
import { products } from '../db/schema';
import { eq } from 'drizzle-orm';
import { Request, Response } from 'express';

export async function getAllProducts(req: Request, res: Response) {
  const result = await db.select().from(products);
  res.json(result);
}
