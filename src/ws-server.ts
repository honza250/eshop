import { WebSocketServer } from 'ws';
import { db } from './db/index'; // Uprav cestu dle struktury
import { products } from './db/schema';
import { eq } from 'drizzle-orm';

const wss = new WebSocketServer({ port: 3001 }); // nebo integrovaně do Express, viz níže

function broadcast(data: any) {
  const msg = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(msg);
    }
  });
}

wss.on('connection', ws => {
  console.log('Klient připojen k WebSocketu');

  // Pošleme aktuální zásoby
  (async () => {
    const allProducts = await db.select().from(products);
    ws.send(JSON.stringify({ type: 'stock_update', products: allProducts }));
  })();

  // Případná zpráva od klienta – např. odebrání ze skladu
  ws.on('message', async msg => {
    const data = JSON.parse(msg.toString());

    if (data.type === 'decrease_stock') {
      await db
        .update(products)
        .set({ stock: data.stock })
        .where(eq(products.id, data.productId));

      const updatedProduct = await db
        .select()
        .from(products)
        .where(eq(products.id, data.productId));

      broadcast({ type: 'stock_update', products: updatedProduct });
    }
  });
});
