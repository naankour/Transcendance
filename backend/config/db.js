require('dotenv').config()
const { Pool } = require('pg')

const pool = new Pool({
  host: 'database',
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
})

const initializeDatabase = async () => {
  let retries = 5

  while (retries > 0) {
    try {
      await pool.query('SELECT 1;')
      console.log("🚀 Connected to PostgreSQL successfully!")
      return true
    } catch (err) {
      retries--

      console.log(`⏳ Database not ready yet. Retries left: ${retries}...`)

      if (retries === 0) {
        console.error("❌ Database connection failed completely:", err)
        throw err
      }

      await new Promise(res => setTimeout(res, 3000))
    }
  }
}

module.exports = { pool, initializeDatabase }