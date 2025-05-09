import { Request, Response } from 'express';
import { db } from '../db';
import { products, cartItems } from '../db/schema';
import { eq } from 'drizzle-orm';

// Zobrazit košík
export const showCart = async (req: Request, res: Response) => {
  // Načti všechny položky v košíku
  const items = await db.select().from(cartItems);
  // Načti produkty pro každou položku v košíku
  const cart = [];
  let total = 0;
  for (const item of items) {
    const productArr = await db.select().from(products).where(eq(products.id, item.productId));
    const product = productArr[0];
    if (product) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
      total += product.price * item.quantity;
    }
  }
  res.render('cart', { cart, total, title: 'Košík' });
};

// Přidat do košíku
export const addToCart = async (req: Request, res: Response) => {
  const productId = parseInt(req.body.productId, 10);
  // Zkontroluj, zda produkt existuje
  const productArr = await db.select().from(products).where(eq(products.id, productId));
  const product = productArr[0];
  if (!product) {
    res.status(404).send('Produkt nenalezen');
    return;
  }
  // Zkontroluj, zda už je v košíku
  const existingArr = await db.select().from(cartItems).where(eq(cartItems.productId, productId));
  const existing = existingArr[0];
  if (existing) {
    // Zvyšit množství
    await db.update(cartItems)
      .set({ quantity: existing.quantity + 1 })
      .where(eq(cartItems.productId, productId));
  } else {
    // Přidat novou položku
    await db.insert(cartItems).values({
      productId: productId,
      quantity: 1,
    });
  }
  res.redirect('/cart');
};

// Zvýšit množství
export const increaseQuantity = async (req: Request, res: Response) => {
  const productId = parseInt(req.body.productId, 10);
  const existingArr = await db.select().from(cartItems).where(eq(cartItems.productId, productId));
  const existing = existingArr[0];
  if (existing) {
    await db.update(cartItems)
      .set({ quantity: existing.quantity + 1 })
      .where(eq(cartItems.productId, productId));
  }
  res.redirect('/cart');
};

// Odebrat z košíku
export const removeFromCart = async (req: Request, res: Response) => {
  const productId = parseInt(req.body.productId, 10);
  await db.delete(cartItems).where(eq(cartItems.productId, productId));
  res.redirect('/cart');
};