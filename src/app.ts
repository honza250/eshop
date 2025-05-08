import express from 'express';
import productsRouter from './routes/products';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/products', productsRouter);

app.get('/', (req, res) => {
    res.send('Vítej v e-shopu s nářadím! 🚀');
  });  

export default app;
