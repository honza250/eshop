import { Request, Response } from 'express';
import { db } from '../db';
import { cartItems, orders } from '../db/schema';
import { eq } from 'drizzle-orm';

// Zobrazit formulář pro objednávku
export const showOrderForm = async (req: Request, res: Response) => {
  const items = await db.select().from(cartItems);
  if (items.length === 0) {
    return res.redirect('/cart');
  }
  res.render('order', { title: 'Objednávka' });
};

// Zpracování objednávky
export const placeOrder = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Email je povinný.');
  }

  const items = await db.select().from(cartItems);
  if (items.length === 0) {
    return res.status(400).send('Košík je prázdný.');
  }

  await db.insert(orders).values({
    userEmail: email,
    status: 'pending',
  });

  await db.delete(cartItems); // Vymazat košík po objednávce

  res.render('order-success', { title: 'Objednávka odeslána', email });
};
