import { useEffect } from "react";
import { isAdmin } from "../auth";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const nav = useNavigate();

  useEffect(() => {
    if (!isAdmin()) {
      nav("/login");
    }
  }, [nav]);

  if (!isAdmin()) return null;

  return (
    <section className="card">
      <h2>Admin Page</h2>
      <p className="muted">Welcome, Admin. This is your dashboard.</p>

      {/* <div className="panel">
        <h3>Books (placeholder)</h3>
        <p>No API calls here in this demo.</p>
        <ul className="bullets">
          <li>Add book form (disabled)</li>
          <li>List of books (disabled)</li>
        </ul>
      </div> */}
    </section>
  );
}
