import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/bee-hive.png";
import { apiRequest } from "../lib/api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const result = await apiRequest<{ message: string }>("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setMessage(result.message);
      window.setTimeout(() => navigate("/login"), 900);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to create account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-shell">
      <section className="auth-panel auth-panel--brand">
        <div className="auth-brand">
          <img src={logo} alt="Hive logo" />
          <div>
            <h1>Create your Hive account</h1>
            <p>Registration is wired to the backend now, so new accounts persist and can log in immediately.</p>
          </div>
        </div>

        <div className="auth-feature-list">
          <div>
            <strong>Single-origin deployment</strong>
            <span>The same backend serves both API routes and the built frontend.</span>
          </div>
          <div>
            <strong>Working auth flow</strong>
            <span>Passwords are hashed, sessions are stored locally, and profile data syncs.</span>
          </div>
          <div>
            <strong>Deploy-ready runtime</strong>
            <span>Environment variables replace hardcoded secrets and local-only URLs.</span>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-panel--form">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div>
            <h2>Register</h2>
            <p>Create an account with a password of at least 8 characters.</p>
          </div>

          <label>
            <span>Username</span>
            <input
              type="text"
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              placeholder="Your display name"
              required
            />
          </label>

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
              placeholder="Minimum 8 characters"
              minLength={8}
              required
            />
          </label>

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          {message ? <p className="form-message">{message}</p> : null}

          <p className="auth-form__footer">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
