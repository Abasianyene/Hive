const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const OPENAI_API_KEY = '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';

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  console.log('Received messages:', messages); // Log incoming messages
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 200,
      }),
    });
    const data = await response.json();
    console.log('OpenAI response:', data); // Log OpenAI response
    res.json(data);
  } catch (err) {
    console.error('OpenAI Proxy Error:', err);
    res.status(500).json({ error: 'OpenAI request failed', details: err.message });
  }
});

app.listen(5000, () => console.log('Proxy running on http://localhost:5000'));