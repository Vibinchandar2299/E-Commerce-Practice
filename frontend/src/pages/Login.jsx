import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginRole, setLoginRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    API.post("/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        const payload = JSON.parse(atob(res.data.token.split(".")[1]));

        if (loginRole === "admin" && !payload.isAdmin) {
          localStorage.removeItem("token");
          localStorage.removeItem("isAdmin");
          setLoading(false);
          setError("❌ This account is not an admin");
          return;
        }

        localStorage.setItem("isAdmin", String(payload.isAdmin));
        setLoading(false);
        navigate(payload.isAdmin ? "/admin" : "/");
      })
      .catch((err) => {
        const message = err?.response?.data || "Invalid email or password";
        setError(`❌ ${message}`);
        setLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>🔐 Login</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit}>
          <div className="form-group">
            <label>Login as</label>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="loginRole"
                  value="user"
                  checked={loginRole === "user"}
                  onChange={() => setLoginRole("user")}
                />
                User
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="radio"
                  name="loginRole"
                  value="admin"
                  checked={loginRole === "admin"}
                  onChange={() => setLoginRole("admin")}
                />
                Admin
              </label>
            </div>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#667eea", fontWeight: "600" }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
