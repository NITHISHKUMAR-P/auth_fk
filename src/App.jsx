import { Link, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import UserHome from "./pages/UserHome.jsx";
import { clearAuth, getUsername, isAdmin, isLoggedIn } from "./auth";

function Nav() {
  const nav = useNavigate();
  const authed = isLoggedIn();
  const name = getUsername();

  return (
    <header className="topbar">
      <nav className="nav">
        <div className="brand">LogAuth</div>
        <div className="links">
          <Link to="/">Home</Link>
          {!authed && <Link to="/login">Login</Link>}
          {!authed && <Link to="/register">Register</Link>}
          {authed && isAdmin() && <Link to="/admin">Admin</Link>}
        </div>
        <div className="right">
          {authed ? (
            <>
              <span className="chip">Hi, {name}</span>
              <button
                className="btn secondary"
                onClick={() => {
                  clearAuth();
                  nav("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <span className="muted">Guest</span>
          )}
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main className="container">
        <Routes>
          <Route path="/" element={<UserHome />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
      <footer className="footer">LogAuth demo</footer>
    </>
  );
}
