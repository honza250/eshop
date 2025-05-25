import { db } from '../db';
import { products } from '../db/schema';

async function dropProducts() {
  await db.run(`DROP TABLE IF EXISTS products`);
  console.log('Tabulka "products" byla smazána.');
}

dropProducts().catch(console.error);
