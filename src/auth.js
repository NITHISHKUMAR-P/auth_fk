export function saveAuth({ token }) {
  localStorage.setItem("token", token);
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    localStorage.setItem("roles", JSON.stringify(payload.roles || []));
    localStorage.setItem("username", payload.sub || "");
  } catch {}
}

export function clearAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  localStorage.removeItem("username");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRoles() {
  try {
    return JSON.parse(localStorage.getItem("roles") || "[]");
  } catch {
    return [];
  }
}

export function isAdmin() {
  return getRoles().includes("ROLE_ADMIN");
}

export function getUsername() {
  return localStorage.getItem("username") || "";
}

export function isLoggedIn() {
  return !!getToken();
}
