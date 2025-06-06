// server.ts (or server.js)
import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;
app.use(cors({
  origin: 'http://100.95.12.16:5000', // <-- your frontend origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

const pool = new Pool({
  user: 'vin',
  host: 'localhost',
  database: 'devportfolio',
  password: 'honeyT1i143',
  port: 5432
});

app.get('/api/projects', async (req, res) => {
  const result = await pool.query('SELECT * FROM projects ORDER BY id');
  res.json(result.rows);
});

app.get('/api/skills', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM skills ORDER BY years DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});

