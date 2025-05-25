import http from 'http';
import { WebSocketServer } from 'ws';
import app from './app';
import { db } from './db/index';
import { products } from './db/schema';
import { eq } from 'drizzle-orm';

const server = http.createServer(app); // důležité – spojíme app s HTTP serverem
const wss = new WebSocketServer({ server }); // WebSocket server běží na stejném portu

wss.on('connection', async (ws) => {
  console.log('Nový WebSocket klient');

  const allProducts = await db.select().from(products);
  ws.send(JSON.stringify({ type: 'stock_update', products: allProducts }));

  ws.on('message', async (msg) => {
    const data = JSON.parse(msg.toString());

    if (data.type === 'decrease_stock') {
      const { productId } = data;

      const prod = await db.select().from(products).where(eq(products.id, productId));
      if (prod.length > 0 && prod[0].stock > 0) {
        const newStock = prod[0].stock - 1;

        await db.update(products)
          .set({ stock: newStock })
          .where(eq(products.id, productId));

        const updatedProduct = await db.select().from(products).where(eq(products.id, productId));

        wss.clients.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'stock_update', products: updatedProduct }));
          }
        });
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server běží na http://localhost:${PORT}`);
});

export { wss };
