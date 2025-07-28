// server.js
const app = express()
const PORT = process.env.PORT || 10000

app.use(express.json())

app.post('/api/grok', async (req, res) => {
  const { prompt } = req.body
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' })

  const apiKey = process.env.GROK_API_KEY
  if (!apiKey) return res
    .status(500)
    .json({ error: 'Missing GROK_API_KEY env var' })

  try {
    const grokRes = await fetch('https://chat.x.ai/api/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-1.5',
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    })
    const data = await grokRes.json()
    return res.json(data)
  } catch (err) {
    return res
      .status(500)
      .json({ error: 'Grok proxy failed', detail: err.message })
  }
})

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)
