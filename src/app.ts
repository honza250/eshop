import express from 'express';
import path from 'path';

const app = express();
app.use(express.json());

// Úvodní stránka
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Statická stránka s produkty
app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/products.html'));
});

export default app;
