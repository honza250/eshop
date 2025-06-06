import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({autoIncrement: true}),
  name: text('name').notNull(),
  description: text('description'),
  price: integer('price').notNull(),
  stock: integer('stock').notNull().default(10),
  imageUrl: text('image_url'),
});

export const cartItems = sqliteTable('cart_items', {
  id: integer('id').primaryKey(),
  productId: integer('product_id').notNull(),
  quantity: integer('quantity').notNull(),
});

export const orders = sqliteTable('orders', {
  id: integer('id').primaryKey(),
  userEmail: text('user_email').notNull(),
  status: text('status').default('pending'),
});
