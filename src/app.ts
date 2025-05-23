
import express from 'express';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/order';

const app = express();

// Nastavení EJS + layouty
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Parsování formulářů
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Statické soubory (styly, obrázky)
app.use(express.static(path.join(__dirname, '..', 'public')));

// Hlavní stránka
app.get('/', (req, res) => {
  res.render('index', { title: 'Domů' });
});

// Produkty
app.use('/products', productRoutes);

// Košík (pokud máte)
app.use('/cart', cartRoutes);

app.use('/order', orderRoutes);

export default app;
