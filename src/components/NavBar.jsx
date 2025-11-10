import { Link, useNavigate } from "react-router-dom";
import { clearAuth, isAdmin, isAuthenticated, getUsername } from "../auth";

export default function Navbar() {
  const nav = useNavigate();
  const authed = isAuthenticated();
  const admin = isAdmin();

  function logout() {
    clearAuth();
    nav("/login");
  }

  return (
    <nav style={{display:"flex", gap:12, padding:"12px 16px", borderBottom:"1px solid #eee"}}>
      <Link to="/">Books</Link>
      {!authed && <Link to="/register">Register</Link>}
      {!authed && <Link to="/login">Login</Link>}
      {authed && admin && <Link to="/admin">Admin</Link>}
      <div style={{marginLeft:"auto"}}>
        {authed ? (
          <>
            <span style={{marginRight:10}}>Hi, {getUsername()}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <span style={{opacity:.7}}>guest</span>
        )}
      </div>
    </nav>
  );
}
