import { useState } from "react";
import { apiPost } from "../api";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "USER",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await apiPost("/api/auth/register", form);
      setMsg("✅ " + (res?.message || "Registered successfully"));
      setForm({ username: "", email: "", password: "", role: "USER" });
    } catch (e2) {
      setMsg("❌ " + (e2?.data?.message || e2.message || "Registration failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Create account</h2>
      <p className="muted">Register as USER or ADMIN.</p>

      <form className="form" onSubmit={submit}>
        <label>
          <span>Username</span>
          <input
            name="username"
            placeholder="e.g. alice"
            value={form.username}
            onChange={onChange}
            required
            autoComplete="username"
          />
        </label>

        <label>
          <span>Email</span>
          <input
            name="email"
            type="email"
            placeholder="alice@example.com"
            value={form.email}
            onChange={onChange}
            required
            autoComplete="email"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={onChange}
            required
            autoComplete="new-password"
          />
        </label>

        <label>
          <span>Role</span>
          <select name="role" value={form.role} onChange={onChange}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </label>

        <button className="btn primary" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Register"}
        </button>
      </form>

      {msg && <div className="alert">{msg}</div>}
    </section>
  );
}
