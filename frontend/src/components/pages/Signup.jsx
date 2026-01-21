import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    API.post("/auth/register", { name, email, password })
      .then(() => {
        alert("User Registered");
        navigate("/login");
      })
      .catch((err) => alert("Error registering"));
  };

  return (
    <form onSubmit={submit}>
      <h2>Signup</h2>
      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <br />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <br />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <br />
      <button type="submit">Signup</button>
    </form>
  );
};

export default Signup;
