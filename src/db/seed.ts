import { db } from './index';
import { products } from './schema';
import { eq } from 'drizzle-orm';


async function seedProducts() {
  await db.delete(products); // Vymažeme předchozí data, pokud existují

  const existing = await db.select().from(products).where(eq(products.name, 'Aku vrtačka'));
  if (existing.length > 0) {
    console.log('Seed: Produkty už existují, seed se přeskočí.');
    return;
  }

  await db.insert(products).values([
    {
      name: 'Aku vrtačka',
      description: 'Výkonná akumulátorová vrtačka s LED osvětlením.',
      price: 2499,
      stock: 10,
      imageUrl: "images/aku-vrtacka.jpg",
    },
    {
      name: 'Kombinované kladivo',
      description: 'Ideální pro vrtání do betonu a zdiva.',
      price: 3999,
      stock: 10,
      imageUrl: "images/kombinovane-kladivo.jpg",
    },
    {
      name: 'Sada šroubováků',
      description: '12dílná sada precizních šroubováků.',
      price: 499,
      stock: 10,
      imageUrl: "images/sada-sroubovaku.jpg",
    },
  ]);
  console.log('Seed: Produkty byly úspěšně přidány.');
}

seedProducts().catch((err) => {
  console.error('Chyba při seedování:', err);
});
