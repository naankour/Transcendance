require('dotenv').config();
const { Pool } = require('pg');

// récupère les variables d'environnement pour se connecter
const pool = new Pool({
  host: 'database',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

 // fonction asynchrone qui check si la database est prête
const initializeDatabase = async () => {  // async permet de ne pas bloquer tout le serveur pendant que la database charge
  let retries = 5;
  while (retries) {
    try {
      await pool.query('SELECT 1;');  // await bloque la fonction tant que la database n'est pas prête
      console.log("🚀 Connected to PostgreSQL successfully!");
      break;
    } catch (err) {
      retries -= 1;
      console.log(`⏳ Database not ready yet. Retries left: ${retries}...`);
      if (retries === 0) {
        console.error("❌ Database connection failed completely:", err);
      } else {
        await new Promise(res => setTimeout(res, 3000));
      }
    }
  }
};

module.exports = { pool, initializeDatabase };