import { Request, Response } from 'express';
import { db } from '../db';
import { products, cartItems } from '../db/schema';
import { eq } from 'drizzle-orm';
import { wss } from '../server';

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

  // Zkontroluj skladovou zásobu
  if (product.stock <= 0) {
    res.status(400).send('Produkt není skladem');
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

  // ✅ Snížit sklad o 1 ks
  await db.update(products)
    .set({ stock: product.stock - 1 })
    .where(eq(products.id, productId));

  // ✅ Získat aktualizovaný produkt
  const updatedProduct = await db.select().from(products).where(eq(products.id, productId));

  // ✅ Poslat websocket zprávu všem klientům
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'stock_update',
        products: updatedProduct,
      }));
    }
  });

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

// Snížit množství
export const decreaseQuantity = async (req: Request, res: Response) => {
  const productId = parseInt(req.body.productId, 10);
  const existingArr = await db.select().from(cartItems).where(eq(cartItems.productId, productId));
  const existing = existingArr[0];
  if (existing) {
    if (existing.quantity > 1) {
      await db.update(cartItems)
        .set({ quantity: existing.quantity - 1 })
        .where(eq(cartItems.productId, productId));
    } else {
      // Pokud je množství 1, položku odstraníme
      await db.delete(cartItems).where(eq(cartItems.productId, productId));
    }
  }
  res.redirect('/cart');
};  

// Odebrat z košíku
export const removeFromCart = async (req: Request, res: Response) => {
  const productId = parseInt(req.body.productId, 10);
  await db.delete(cartItems).where(eq(cartItems.productId, productId));
  res.redirect('/cart');
};