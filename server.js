const express = require('express');
const app = express();

// parse JSON bodies
app.use(express.json());

// Use Render’s PORT or fallback to 10000 locally
const port = process.env.PORT || 10000;

app.post('/api/grok', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  try {
    // `fetch` is built into Node 18+—no extra install needed
    const grokRes = await fetch('https://chat.openrouter.ai/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        prompt,
        max_tokens: 512
      })
    });

    const data = await grokRes.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: 'Grok proxy failed',
      detail: err.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
