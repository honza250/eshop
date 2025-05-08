import express from 'express';
import path from 'path';
import { db } from './db';
import { products } from './db/schema';
import { eq } from 'drizzle-orm';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


// Nastavíme EJS jako šablonovací engine
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');

// Úvodní stránka – pořád jako statické HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Dynamická stránka s produkty – přes EJS
app.get('/products', async (req, res) => {
  const result = await db.select().from(products);
  res.render('products', { products: result });
});



// Přidání produktu do košíku
export default app;
