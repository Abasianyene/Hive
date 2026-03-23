import { useEffect, useMemo, useRef, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { MessageCircleMore, Send, UserRound } from "lucide-react";
import { apiRequest, getSocketUrl } from "../lib/api";
import { getStoredSession } from "../lib/session";

type Contact = {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  online?: boolean;
};

type ChatMessage = {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
};

function Messages() {
  const session = getStoredSession();
  const socketRef = useRef<Socket | null>(null);
  const activeContactRef = useRef("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [status, setStatus] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!session?.token) {
      return;
    }

    apiRequest<{ contacts: Contact[] }>("/api/contacts", {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
      .then((result) => {
        setContacts(result.contacts);
        setSelectedId((current) => current || result.contacts[0]?.id || "");
      })
      .catch((error) => {
        setStatus(error instanceof Error ? error.message : "Unable to load contacts.");
      });
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token || !selectedId) {
      return;
    }

    setIsLoading(true);

    apiRequest<{ messages: ChatMessage[] }>(`/api/messages/${selectedId}`, {
      headers: {
        Authorization: `Bearer ${session.token}`,
      },
    })
      .then((result) => {
        setMessages(result.messages);
        setStatus("");
      })
      .catch((error) => {
        setStatus(error instanceof Error ? error.message : "Unable to load conversation.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [selectedId, session?.token]);

  useEffect(() => {
    activeContactRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    if (!session?.user.id) {
      return;
    }

    const socket = getSocketUrl() ? io(getSocketUrl()) : io();
    socketRef.current = socket;

    socket.emit("join", session.user.id);
    socket.emit("user-online", session.user.id);
    socket.on("online-users", (users: string[]) => setOnlineUsers(users));
    socket.on("message:new", (message: ChatMessage) => {
      setMessages((current) => {
        const activeContact = activeContactRef.current;

        if (!activeContact) {
          return current;
        }

        if (
          (message.from === activeContact && message.to === session.user.id) ||
          (message.from === session.user.id && message.to === activeContact)
        ) {
          return [...current, message];
        }

        return current;
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [session?.user.id]);

  const selectedContact = useMemo(
    () => contacts.find((contact) => contact.id === selectedId),
    [contacts, selectedId]
  );

  const handleSend = async () => {
    if (!session?.token || !selectedContact || !draft.trim()) {
      return;
    }

    try {
      const result = await apiRequest<{ message: ChatMessage }>("/api/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify({
          to: selectedContact.id,
          content: draft.trim(),
        }),
      });

      setMessages((current) => [...current, result.message]);
      setDraft("");
      setStatus("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to send message.");
    }
  };

  if (!session?.token) {
    return (
      <section className="page-card empty-state">
        <MessageCircleMore size={28} />
        <h1>Messaging requires a logged-in account</h1>
        <p>Sign in with one of the demo accounts or create a new account to load contacts and send messages.</p>
      </section>
    );
  }

  return (
    <section className="messages-layout">
      <aside className="page-card messages-sidebar">
        <div className="messages-sidebar__header">
          <span className="eyebrow">Private threads</span>
          <h1>Messages</h1>
          <p>{contacts.length} contacts available</p>
        </div>

        <div className="messages-contact-list">
          {contacts.map((contact) => {
            const isActive = contact.id === selectedId;
            const isOnline = onlineUsers.includes(contact.id) || contact.online;

            return (
              <button
                key={contact.id}
                type="button"
                className={`messages-contact${isActive ? " is-active" : ""}`}
                onClick={() => setSelectedId(contact.id)}
              >
                {contact.avatarUrl ? (
                  <img src={contact.avatarUrl} alt={contact.username} />
                ) : (
                  <div className="messages-contact__fallback">
                    <UserRound size={18} />
                  </div>
                )}
                <div className="messages-contact__content">
                  <strong>{contact.username}</strong>
                  <div className="messages-contact__meta">
                    <span>{contact.email}</span>
                    <span className={`presence-pill${isOnline ? " is-online" : ""}`}>
                      {isOnline ? "Online" : "Away"}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      <article className="page-card messages-thread">
        {selectedContact ? (
          <>
            <header className="messages-thread__header">
              <div className="messages-thread__person">
                {selectedContact.avatarUrl ? (
                  <img src={selectedContact.avatarUrl} alt={selectedContact.username} className="messages-thread__avatar" />
                ) : (
                  <div className="messages-thread__avatar messages-thread__avatar--fallback">
                    <UserRound size={18} />
                  </div>
                )}
                <div>
                  <h2>{selectedContact.username}</h2>
                  <p>{onlineUsers.includes(selectedContact.id) ? "Online" : selectedContact.bio || selectedContact.email}</p>
                </div>
              </div>
              <span className={`presence-pill${onlineUsers.includes(selectedContact.id) ? " is-online" : ""}`}>
                {onlineUsers.includes(selectedContact.id) ? "Live now" : "Direct thread"}
              </span>
            </header>

            <div className="messages-thread__body">
              {isLoading ? <p className="empty-copy">Loading conversation...</p> : null}

              {!isLoading && !messages.length ? (
                <p className="empty-copy">No messages yet. Start the conversation.</p>
              ) : null}

              {messages.map((message) => {
                const isOwnMessage = message.from === session.user.id;

                return (
                  <div
                    key={message.id}
                    className={`message-bubble${isOwnMessage ? " is-own" : ""}`}
                  >
                    <p>{message.content}</p>
                    <span>{new Date(message.timestamp).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>

            <div className="messages-thread__composer">
              <textarea
                rows={3}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Message ${selectedContact.username}`}
              />
              <button type="button" className="primary-button" onClick={handleSend}>
                <Send size={16} />
                Send
              </button>
            </div>

            {status ? <p className="form-message">{status}</p> : null}
          </>
        ) : (
          <div className="empty-state">
            <MessageCircleMore size={28} />
            <h2>Select a conversation</h2>
            <p>Contacts will appear here after login.</p>
          </div>
        )}
      </article>
    </section>
  );
}

export default Messages;
