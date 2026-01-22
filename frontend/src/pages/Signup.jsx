import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    API.post("/auth/register", { name, email, password })
      .then(() => {
        setLoading(false);
        alert("✅ Account created successfully!");
        navigate("/login");
      })
      .catch((err) => {
        setError("❌ Error registering. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h2>📝 Create Account</h2>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={submit} autoComplete="off">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <p style={{ textAlign: "center", marginTop: "1rem", color: "#666" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#667eea", fontWeight: "600" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
