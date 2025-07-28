import express from "express";

// (Node 18+/22+ has a global `fetch` — no extra install needed)

const app = express();
app.use(express.json());

app.post("/api/grok", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt" });
  }

  try {
    const grokRes = await fetch("https://chat.x.ai/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROK_API_KEY}`
      },
      body: JSON.stringify({ prompt })
    });

    if (!grokRes.ok) {
      const text = await grokRes.text();
      return res.status(502).json({ error: "Upstream error", details: text });
    }

    const data = await grokRes.json();
    return res.json(data);

  } catch (err) {
    return res.status(500).json({ error: "Grok proxy failed", detail: err.message });
  }
});

// Render (and other hosts) expect you to bind to process.env.PORT
const port = process.env.PORT || 10000;
app.listen(port, () => {
  console.log(`🚀 Server listening on port ${port}`);
});
