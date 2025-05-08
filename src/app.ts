import express from 'express';
import path from 'path';
import productsRouter from './routes/products';

const app = express();
app.use(express.json());

// Statická úvodní stránka z /views
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Produkty
app.use('/products', productsRouter);

export default app;
