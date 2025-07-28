import express from "express";

const app = express();
app.use(express.json());

app.post("/api/grok", async (req, res) => {
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing prompt" });
  }
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Missing GROK_API_KEY" });
  }
  try {
    const grokRes = await fetch("https://chat.x.ai/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "grok-1.5",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await grokRes.json();
    res.status(grokRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", detail: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
