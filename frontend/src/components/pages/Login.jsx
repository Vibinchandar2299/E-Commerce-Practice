import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    API.post("/auth/login", { email, password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        // Decode token to get isAdmin
        const payload = JSON.parse(atob(res.data.token.split(".")[1]));
        localStorage.setItem("isAdmin", payload.isAdmin);
        navigate("/");
      })
      .catch((err) => alert("Invalid credentials"));
  };

  return (
    <form onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
