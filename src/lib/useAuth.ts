"use client";
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);

  // ✅ Safely load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored && stored !== "undefined" && stored !== "null") {
        const parsedUser = JSON.parse(stored);
        setUser(parsedUser);
      } else {
        localStorage.removeItem("user"); // cleanup invalid values
      }
    } catch (err) {
      console.error("Invalid user data in localStorage:", err);
      localStorage.removeItem("user");
    }
  }, []);

  // ✅ Store both userData and token properly
  const login = (userData: any, token: string) => {
    try {
      const userPayload = { ...userData, token };
      localStorage.setItem("user", JSON.stringify(userPayload));
      localStorage.setItem("token", token);
      setUser(userPayload);
    } catch (err) {
      console.error("Failed to save user data:", err);
    }
  };

  // ✅ Logout function
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return { user, login, logout };
}
