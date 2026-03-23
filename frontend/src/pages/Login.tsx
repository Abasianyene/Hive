import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/bee-hive.png";
import { apiRequest } from "../lib/api";
import { setStoredSession, type Session } from "../lib/session";

const demoAccounts = [
  {
    username: "Jane Doe",
    email: "jane@hive.demo",
    password: "Password123!",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    username: "John Smith",
    email: "john@hive.demo",
    password: "Password123!",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const session = await apiRequest<Session>("/api/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setStoredSession(session);
      navigate("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to log in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (email: string, password: string) => {
    setForm({ email, password });
    setMessage("Demo credentials loaded. Submit to continue.");
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-panel--brand">
        <div className="auth-brand">
          <img src={logo} alt="Hive logo" />
          <div>
            <h1>Hive</h1>
            <p>Social tools, messaging, and community spaces in one deployable app.</p>
          </div>
        </div>

        <div className="auth-demo-card">
          <h2>Demo access</h2>
          <p>Use one of the seeded accounts below to test the deployed app quickly.</p>
          <div className="auth-demo-list">
            {demoAccounts.map((account) => (
              <button
                key={account.email}
                type="button"
                className="auth-demo-user"
                onClick={() => handleDemoLogin(account.email, account.password)}
              >
                <img src={account.avatar} alt={account.username} />
                <div>
                  <strong>{account.username}</strong>
                  <span>{account.email}</span>
                </div>
              </button>
            ))}
          </div>
          <small>
            Password for both demo users: <code>Password123!</code>
          </small>
        </div>
      </section>

      <section className="auth-panel auth-panel--form">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <h2>Sign in</h2>
            <p>Log in to access your feed, profile settings, and messaging.</p>
          </div>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="Enter your password"
              required
            />
          </label>

          <div className="auth-form__meta">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Log in"}
          </button>

          {message ? <p className="form-message">{message}</p> : null}

          <p className="auth-form__footer">
            Need an account? <Link to="/register">Create one</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Login;
