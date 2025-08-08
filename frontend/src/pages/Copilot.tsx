import React, { useState } from 'react';
import '../index.css';

const Copilot = () => {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', { // <-- Use your proxy
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await response.json();
      const aiMessage = data.choices?.[0]?.message?.content || 'No response';
      setMessages([...newMessages, { role: 'assistant', content: aiMessage }]);
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Error contacting ChatGPT.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="copilot-chat-container" style={{ maxWidth: 500, margin: '40px auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #0001', padding: 24 }}>
      <h2>Hive Copilot</h2>
      <div style={{ minHeight: 200, marginBottom: 16 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '8px 0', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
            <span style={{
              display: 'inline-block',
              background: msg.role === 'user' ? '#e6f7ff' : '#f0f0f0',
              color: '#222',
              borderRadius: 8,
              padding: '8px 12px',
              maxWidth: '80%',
              wordBreak: 'break-word'
            }}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <div style={{ color: '#888' }}>Copilot is typing...</div>}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
          style={{ flex: 1, padding: 10, borderRadius: 6, border: '1px solid #ddd' }}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} style={{ padding: '0 18px', borderRadius: 6, background: '#0078d4', color: '#fff', border: 'none', fontWeight: 600 }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Copilot;