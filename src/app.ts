import express from 'express';
import path from 'path';
import { db } from './db';
import { products } from './db/schema';

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Dočasné úložiště v paměti
const cart: { productId: number; quantity: number }[] = [];

app.use(express.urlencoded({ extended: true }));

app.post('/cart', (req, res) => {
  const { productId } = req.body;

  const existing = cart.find(item => item.productId === Number(productId));
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId: Number(productId), quantity: 1 });
  }

  // Přesměruj zpět na /products
  res.redirect('/products');
});

app.get('/cart', async (req, res) => {
  const cartWithDetails = await Promise.all(
    cart.map(async (item) => {
      const product = await db.query.products.findFirst({
        where: (p, { eq }) => eq(p.id, item.productId),
      });

      return {
        ...item,
        name: product?.name,
        price: product?.price,
      };
    })
  );

  res.render('cart', { cart: cartWithDetails });
});


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
