import { useEffect, useState } from "react";

const useRiderAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get rider data from localStorage immediately
    const storedToken = localStorage.getItem("rider-token");
    const storedUser = localStorage.getItem("rider-user");

    if (storedToken && storedUser) {
      try {
        const riderUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(riderUser);
      } catch (err) {
        console.error("Failed to parse rider user", err);
        localStorage.removeItem("rider-token");
        localStorage.removeItem("rider-user");
      }
    }
    setLoading(false);
  }, []);

  // Listen for storage changes (if user logs in from another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedToken = localStorage.getItem("rider-token");
      const storedUser = localStorage.getItem("rider-user");

      if (storedToken && storedUser) {
        try {
          const riderUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(riderUser);
        } catch (err) {
          console.error("Failed to parse rider user", err);
        }
      } else {
        setToken(null);
        setUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const logout = () => {
    localStorage.removeItem("rider-token");
    localStorage.removeItem("rider-user");
    setUser(null);
    setToken(null);
  };

  return { user, token, loading, logout };
};

export default useRiderAuth;
