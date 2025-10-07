import { useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const localAuth = localStorage.getItem("bfinitBlogAccessToken");
    if (localAuth) {
      try {
        // Parse if it's JSON, otherwise use as-is
        setUser(JSON.parse(localAuth));
      } catch {
        // If it's just a plain token string
        setUser(localAuth);
      }
    }
    setLoading(false); // Set loading to false after check
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("bfinitBlogAccessToken");
  };

  const value = {
    user,
    setUser,
    handleLogout,
    loading, // Expose loading state
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
