import express from 'express';
import 'dotenv/config';             // automatically loads .env into process.env

const app = express();
app.use(express.json());

const PORT        = process.env.PORT || 10000;
const GROK_URL    = 'https://api.grok.ai/v1/generate';  // replace with your actual Grok endpoint
const GROK_API_KEY = process.env.GROK_API_KEY;          // set this in Render → Environment

app.post('/api/grok', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt in request body' });
  }

  try {
    const grokRes = await fetch(GROK_URL, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${GROK_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });

    if (!grokRes.ok) {
      const text = await grokRes.text();
      return res
        .status(grokRes.status)
        .json({ error: 'Grok proxy failed', detail: text });
    }

    // forward the JSON response
    const data = await grokRes.json();
    return res.json(data);

  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Grok proxy failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
