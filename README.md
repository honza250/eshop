# E-shop – Jak projekt spustit

## 1. Klonování repozitáře
bash
git clone https://github.com/honza250/eshop.git
cd eshop


## 2. Instalace závislostí
bash
npm install


## 3. Vytvoření a migrace databáze
bash
npm run migrate


## 4. (Volitelné) Naplnění databáze testovacími daty
bash
npm run seed

## 5. Spuštění vývojového serveru
bash
npm run dev

## Poznámky

- Pokud změníte schéma databáze, spusťte znovu `npm run migrate`.
- Pokud chcete změnit port, nastavte proměnnou prostředí `PORT`.
- Databáze je ve výchozím nastavení soubor `src/db/sqlite.db`.