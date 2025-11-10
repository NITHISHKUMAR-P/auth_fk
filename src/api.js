// Change this if you serve the backend from somewhere else
export const API_BASE = "https://logauth-app.onrender.com";

export async function apiPost(path, body) {
  const token = getToken();
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText);
    err.data = data;
    throw err;
  }
  return data;
}

// local util (avoid circular import with auth.js)
function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}
