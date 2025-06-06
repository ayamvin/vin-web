import express from 'express';
import { Pool } from 'pg';
import cors from 'cors';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
  origin: 'http://100.95.12.16:5000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(helmet());
app.use(bodyParser.json());

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

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Error handling middleware (no types)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Helper function to get or create user session
async function getOrCreateUser(sessionId, ip, userAgent) {
  const client = await pool.connect();
  try {
    const userRes = await client.query(
      'SELECT id FROM users WHERE session_id = $1',
      [sessionId]
    );

    if (userRes.rows.length > 0) {
      await client.query(
        'UPDATE users SET last_interaction = NOW() WHERE id = $1',
        [userRes.rows[0].id]
      );
      return userRes.rows[0].id;
    } else {
      const newUserRes = await client.query(
        'INSERT INTO users (session_id, ip_address, user_agent) VALUES ($1, $2, $3) RETURNING id',
        [sessionId, ip, userAgent]
      );
      return newUserRes.rows[0].id;
    }
  } finally {
    client.release();
  }
}

app.post('/api/chat', async (req, res) => {
  const { sessionId, message } = req.body;
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || '';

  if (!sessionId || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const userId = await getOrCreateUser(sessionId, ip, userAgent);

    const convRes = await pool.query(
      'INSERT INTO conversations (user_id) VALUES ($1) RETURNING id',
      [userId]
    );
    const conversationId = convRes.rows[0].id;

    await pool.query(
      'INSERT INTO messages (conversation_id, content, sender_type) VALUES ($1, $2, $3)',
      [conversationId, message, 'user']
    );

    const botResponse = await getBotResponse(message);

    await pool.query(
      'INSERT INTO messages (conversation_id, content, sender_type) VALUES ($1, $2, $3)',
      [conversationId, botResponse, 'bot']
    );

    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/track-download', async (req, res) => {
  const { sessionId } = req.body;
  const ip = req.ip;
  const userAgent = req.get('User-Agent') || '';

  try {
    const userId = await getOrCreateUser(sessionId, ip, userAgent);

    await pool.query(
      'INSERT INTO resume_downloads (user_id, ip_address, user_agent) VALUES ($1, $2, $3)',
      [userId, ip, userAgent]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking download:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/conversation-history', async (req, res) => {
  const sessionId = req.query.sessionId;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing sessionId' });
  }

  try {
    const result = await pool.query(`
      SELECT m.content, m.sender_type, m.created_at
      FROM messages m
      JOIN conversations c ON m.conversation_id = c.id
      JOIN users u ON c.user_id = u.id
      WHERE u.session_id = $1
      ORDER BY m.created_at ASC
    `, [sessionId]);

    res.json({ messages: result.rows });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function for bot response (no types)
async function getBotResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Match phrases where trigger_phrases is a text[] column (array of text)
  const responseRes = await pool.query(`
    SELECT response_text
    FROM bot_responses
    WHERE EXISTS (
      SELECT 1
      FROM unnest(trigger_phrases) AS phrase
      WHERE $1 ILIKE '%' || phrase || '%'
    )
    ORDER BY array_length(trigger_phrases, 1) DESC
    LIMIT 1
  `, [lowerMessage]);

  if (responseRes.rows.length > 0) {
    return responseRes.rows[0].response_text;
  }

  // Fallbacks for hardcoded keyword matching
  if (lowerMessage.includes("name") || lowerMessage.includes("hi") || lowerMessage.includes("hello")) {
    return "Hi I'm Malvin A. Manalang, nice to meet you!";
  } else if (lowerMessage.includes("age")) {
    return "I'm currently in my early 20s.";
  } else if (lowerMessage.includes("contact") || lowerMessage.includes("email") || lowerMessage.includes("phone")) {
    return "You can contact me via email at manalangmalvin@gmail.com or reach me by phone at 0916-299-1409.";
  }

  return "I'm happy to answer questions about my experience, projects, skills, education, or anything else from my resume. Just ask!";
}


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
