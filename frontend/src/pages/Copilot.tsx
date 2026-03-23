import { useState, type KeyboardEvent } from "react";
import { Sparkles } from "lucide-react";
import { apiRequest } from "../lib/api";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

function Copilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: input.trim() }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const data = await apiRequest<{
        choices?: Array<{ message?: { content?: string } }>;
      }>("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: nextMessages }),
      });

      const aiMessage = data.choices?.[0]?.message?.content || "No response returned.";
      setMessages([...nextMessages, { role: "assistant", content: aiMessage }]);
    } catch (error) {
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Copilot is unavailable right now.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      void sendMessage();
    }
  };

  return (
    <section className="copilot-layout">
      <article className="page-card copilot-card">
        <div className="copilot-card__header">
          <span className="eyebrow">
            <Sparkles size={16} />
            AI assistant
          </span>
          <h1>Hive Copilot</h1>
          <p>
            The Copilot route is now connected to the backend. If the server has no `OPENAI_API_KEY`, the UI shows a
            clear configuration message instead of failing silently.
          </p>
        </div>

        <div className="copilot-thread">
          {messages.length === 0 ? <p className="empty-copy">Ask about rollout steps, release notes, or deployment checks.</p> : null}
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`copilot-message${message.role === "user" ? " is-user" : ""}`}>
              {message.content}
            </div>
          ))}
          {isLoading ? <p className="empty-copy">Copilot is thinking...</p> : null}
        </div>

        <div className="copilot-input">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Hive Copilot anything"
            disabled={isLoading}
          />
          <button type="button" className="primary-button" disabled={isLoading || !input.trim()} onClick={() => void sendMessage()}>
            Send
          </button>
        </div>
      </article>
    </section>
  );
}

export default Copilot;
