import { useEffect, useMemo, useState } from "react";
import { apiPost } from "../api";
import { saveAuth, isAdmin } from "../auth";
import { useNavigate } from "react-router-dom";

const THRESHOLD = 3;

// Parse backend message: "Account locked. Try again in 123s"
function parseLock(msg) {
  if (!msg) return null;
  const m = /Account locked\. Try again in (\d+)s/i.exec(msg);
  return m ? Number(m[1]) : null;
}

export default function LoginPage() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // local UI counter per-username to show “attempts remaining”
  const [attempts, setAttempts] = useState({}); // { [username]: count }
  const attemptsForUser = useMemo(
    () => attempts[form.username] || 0,
    [attempts, form.username]
  );
  const remainingLocal = Math.max(0, THRESHOLD - attemptsForUser);

  // lock countdown UI (seconds)
  const [lockSecs, setLockSecs] = useState(0);
  useEffect(() => {
    if (!lockSecs) return;
    const t = setInterval(() => setLockSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [lockSecs]);

  useEffect(() => {
    // reset message when user switches username
    setMessage("");
  }, [form.username]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    if (lockSecs > 0) return;
    setMessage("");
    setLoading(true);
    try {
      const res = await apiPost("/api/auth/login", form);
      // success → reset attempts, save token, route
      setAttempts(prev => ({ ...prev, [form.username]: 0 }));
      saveAuth(res);
      setLoading(false);
      setMessage("✅ Logged in successfully.");
      setTimeout(() => {
        if (isAdmin()) nav("/admin");
        else nav("/");
      }, 300);
    } catch (err) {
      setLoading(false);
      const msg = err?.data?.message || err.message || "Login failed";
      const lock = parseLock(msg);
      if (typeof lock === "number") {
        setLockSecs(lock);
        setMessage(`🔒 ${msg}`);
        // optional: reset local attempts when server locks
        setAttempts(prev => ({ ...prev, [form.username]: 0 }));
        return;
      }
      // bump local attempts and derive “remaining” from the new value
      setAttempts(prev => {
        const cur = prev[form.username] || 0;
        const next = Math.min(THRESHOLD, cur + 1);
        setMessage(`❌ Invalid credentials. Attempts remaining: ${Math.max(0, THRESHOLD - next)}`);
        return { ...prev, [form.username]: next };
      });
    }
  }

  return (
    <section className="card">
      <h2>Welcome back</h2>
      <p className="muted">Sign in to continue.</p>

      <form className="form" onSubmit={submit}>
        <label>
          <span>Username</span>
          <input
            name="username"
            
            value={form.username}
            onChange={onChange}
            required
            autoComplete="username"
          />
        </label>

        <label>
          <span>Password</span>
          <input
            name="password"
            type="password"
           
            value={form.password}
            onChange={onChange}
            required
            autoComplete="current-password"
          />
        </label>

        <button
          className="btn primary"
          type="submit"
          disabled={loading || lockSecs > 0}
        >
          {lockSecs > 0 ? `Locked (${lockSecs}s)` : loading ? "Signing in..." : "Login"}
        </button>
      </form>

      {/* helper text */}
      {message && <div className="alert">{message}</div>}
      {!message && attemptsForUser > 0 && (
        <div className="muted small">
          Attempts used: {attemptsForUser} / {THRESHOLD} (left {remainingLocal})
        </div>
      )}
    </section>
  );
}
