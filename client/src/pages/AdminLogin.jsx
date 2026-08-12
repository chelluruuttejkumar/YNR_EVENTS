import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "../styles/admin-login.css";

function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      console.error("Login error:", error);
      setError("Invalid email or password.");
      return;
    }

    if (data?.user) {
  sessionStorage.setItem("ynr_admin_session", "true");
  navigate("/admin", { replace: true });
}
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-card">

        <p className="admin-login-eyebrow">
          YNR EVENTS · ADMIN
        </p>

        <h1>
          Welcome
          <span> Back.</span>
        </h1>

        <p className="admin-login-subtitle">
          Sign in to manage your event enquiries.
        </p>

        <form onSubmit={handleLogin}>

          <label htmlFor="email">
            EMAIL ADDRESS
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="admin@ynrevents.com"
            required
          />

          <label htmlFor="password">
            PASSWORD
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            required
          />

          {error && (
            <p className="admin-login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            <span>
              {loading ? "SIGNING IN..." : "LOGIN"}
            </span>

            <span>↗</span>
          </button>

        </form>

        <a
          href="/"
          className="back-home"
        >
          ← Back to website
        </a>

      </div>
    </main>
  );
}

export default AdminLogin;