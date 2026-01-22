import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav>
      <div className="nav-left">
        <Link to="/" className="logo">🛒 ShopHub</Link>
        <Link to="/">Home</Link>
      </div>
      <div className="nav-right">
        {token ? (
          <>
            {!isAdmin && <Link to="/cart">🛍️ Cart</Link>}
            <Link to="/profile">👤 Profile</Link>
            {isAdmin && <Link to="/admin">⚙️ Admin</Link>}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
