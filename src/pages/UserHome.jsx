import { getUsername, isAdmin, isLoggedIn } from "../auth";
import { Link } from "react-router-dom";

export default function UserHome() {
  return (
    <section className="card">
      <h2>User Page</h2>
      {!isLoggedIn() ? (
        <p className="muted">
          You are not logged in. <Link to="/login">Login</Link> or{" "}
          <Link to="/register">Register</Link>.
        </p>
      ) : (
        <>
          <p>
            Welcome <strong>{getUsername()}</strong>.
          </p>
          {isAdmin() ? (
            <p>
              Go to your <Link to="/admin">Admin Dashboard</Link>.
            </p>
          ) : (
            <p>You are logged in as a regular user.</p>
          )}
        </>
      )}

      {/* <div className="panel">
        <h3>Books (placeholder)</h3>
        <p>No API calls here. Just a simple user page.</p>
      </div> */}
    </section>
  );
}
