import { Link } from "react-router-dom";
import logo from "../assets/images/bee-hive.png";

function ForgotPassword() {
  return (
    <div className="auth-shell">
      <section className="auth-panel auth-panel--brand">
        <div className="auth-brand">
          <img src={logo} alt="Hive logo" />
          <div>
            <h1>Password recovery</h1>
            <p>This page is no longer blank. It explains the current state of the feature clearly.</p>
          </div>
        </div>
      </section>

      <section className="auth-panel auth-panel--form">
        <div className="auth-form">
          <div>
            <h2>Reset support is not automated yet</h2>
            <p>
              The app now handles login and registration properly, but password-reset email delivery is still not configured.
              To finish this feature in production, wire an email provider and add a reset-token flow on the backend.
            </p>
          </div>

          <div className="auth-feature-list">
            <div>
              <strong>What is done</strong>
              <span>The route exists, the UI is usable, and the app no longer sends users to an empty screen.</span>
            </div>
            <div>
              <strong>What is still needed</strong>
              <span>Email delivery, token expiry, and a secure password reset form.</span>
            </div>
          </div>

          <div className="auth-form__actions">
            <Link className="primary-button" to="/login">
              Back to login
            </Link>
            <Link className="secondary-link" to="/register">
              Create a new account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ForgotPassword;
