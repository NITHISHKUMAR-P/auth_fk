import { useEffect, useState } from "react";
import { getToken, isAdmin, getUsername } from "../auth";

export default function useAuth() {
  const [token, setToken] = useState(getToken());
  const [admin, setAdmin] = useState(isAdmin());
  const [username, setUsername] = useState(getUsername());

  useEffect(() => {
    const onStorage = () => {
      setToken(getToken());
      setAdmin(isAdmin());
      setUsername(getUsername());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return { token, admin, username };
}
