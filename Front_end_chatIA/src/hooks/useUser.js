import { useState, useEffect } from "react";

/**
 * Custom hook for retrieving the current user from localStorage.
 * Provides a single source of truth for user information across components.
 *
 * @returns {Object|null} The parsed user object or null if not found
 */
export const useUser = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        setUser(null);
      }
    }
  }, []);

  return user;
};
