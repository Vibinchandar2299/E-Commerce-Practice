import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import Profile from "./pages/Profile";

const getAuthState = () => {
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  return { token, isAdmin };
};

const RequireAuth = ({ children }) => {
  const { token } = getAuthState();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const RequireAdmin = ({ children }) => {
  const { token, isAdmin } = getAuthState();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const RedirectIfAuthed = ({ children }) => {
  const { token, isAdmin } = getAuthState();

  if (!token) return children;

  return <Navigate to={isAdmin ? "/admin" : "/"} replace />;
};

const LandingRoute = () => {
  const { token, isAdmin } = getAuthState();

  if (!token) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/admin" replace />;

  return <Home />;
};

const AppLayout = () => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route
          path="/login"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/signup"
          element={
            <RedirectIfAuthed>
              <Signup />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/cart"
          element={
            <RequireAuth>
              <Cart />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;